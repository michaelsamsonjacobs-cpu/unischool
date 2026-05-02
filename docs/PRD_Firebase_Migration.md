# PRD: Firebase Migration & Backend Enhancement
### University School — Backend v2.0

---

## 1. Executive Summary

University School's backend is currently built on **Supabase** (PostgreSQL + Supabase Auth + Supabase Edge Functions). This PRD defines the migration to **Google Firebase** as the primary backend platform, leveraging:

- **Firebase Authentication** — replaces Supabase Auth and the `MagicLinkService.js` mock layer
- **Cloud Firestore** — replaces the PostgreSQL schema (17 tables) with a NoSQL document model
- **Firebase Cloud Functions (v2, Node.js)** — replaces Supabase Edge Functions (Deno)
- **Firebase Security Rules** — replaces PostgreSQL RLS policies
- **Firebase Extensions** — Stripe, SendGrid, and other managed integrations

### Why Migrate?

| Dimension | Supabase (Current) | Firebase (Target) |
|---|---|---|
| Auth Providers | Magic Link only | Google, Apple, Email/Link, Phone, SAML (for university SSO) |
| Realtime | Supabase Realtime (WS) | Firestore onSnapshot (built-in, no extra config) |
| Offline Support | None | Firestore offline persistence (critical for physical centers with spotty wifi) |
| Serverless Functions | Deno Edge Functions (cold-start) | Cloud Functions v2 (Node.js, scales to zero, multi-region) |
| Hosting | Separate (Vercel) | Firebase Hosting + CDN (unified deploy pipeline) |
| Mobile SDK | Limited | First-class Android & iOS SDKs (future mobile app) |
| Ecosystem | Growing | Mature — Crashlytics, Remote Config, Performance Monitoring, A/B Testing |

---

## 2. Scope of Migration

### 2.1 Services to Migrate (In-Scope)

| Current File | Current Platform | Target Firebase Service | Notes |
|---|---|---|---|
| `SupabaseClient.js` | Supabase JS SDK | `FirebaseClient.js` | New SDK init with `firebase/app`, `firebase/auth`, `firebase/firestore` |
| `MagicLinkService.js` | Supabase Auth + localStorage mock | `AuthService.js` | Firebase Auth with Email Link, Google, Apple sign-in |
| `InstitutionService.js` | Supabase `from('institutions')` | Firestore `institutions` collection | Direct query migration |
| `EnrollmentService.js` | Supabase `from('enrollments')` | Firestore `enrollments` sub-collection | Under `users/{uid}/enrollments` |
| `NCEService.js` | Supabase `from('nce_scenarios')` | Firestore `nce_scenarios` collection | Scenarios are global; progress is per-user |
| `EscalationService.js` | Supabase `from('support_tickets')` | Firestore `support_tickets` collection | With Cloud Function triggers for SLA timers |
| `PathwayService.js` | Supabase `from('career_pathways')` | Firestore `career_pathways` collection | Public read |
| `CenterOpsService.js` | Supabase `from('attendance')` | Firestore `centers/{id}/attendance` | Sub-collection under centers |
| `StripeService.js` | localStorage mock | Cloud Functions + Stripe Extension | Real Stripe integration via `firebase-extensions/stripe-payments` |
| Edge: `lms-webhook/` | Supabase Edge Function (Deno) | Cloud Function `onRequest` (Node.js) | Full rewrite, same adapter pattern |
| Edge: `create-checkout/` | Supabase Edge Function (Deno) | Cloud Function `onRequest` (Node.js) | Migrated to `stripe.checkout.sessions.create` |
| Edge: `stripe-webhook/` | Supabase Edge Function (Deno) | Cloud Function `onRequest` (Node.js) | Webhook signature verification via `stripe.webhooks.constructEvent` |
| `001_core_schema.sql` | PostgreSQL DDL | Firestore collections + Security Rules | Schema → Document model |
| `002_seed_data.sql` | PostgreSQL INSERT | `seed.js` script (Admin SDK) | One-time data population |

### 2.2 Services NOT Migrated (Unchanged)

| Service | Reason |
|---|---|
| `GeminiService.js` | Calls Google Gemini API directly — no Supabase dependency |
| `WebLLMService.js` | Runs entirely client-side via WebGPU — no backend dependency |
| `SearchService.js` | Local vector search — no backend dependency |
| `EmbeddingService.js` | Local embeddings — no backend dependency |
| `ContentService.js` | Static content loader — no backend dependency |
| `DocumentBuilder.js` | Client-side doc generation — no backend dependency |
| `FeedbackService.js` | Uses localStorage — no Supabase dependency |

---

## 3. Firestore Data Model

### 3.1 Top-Level Collections

```
firestore-root/
├── franchises/{franchiseId}
│   ├── name, slug, owner_uid, territory, timezone, status
│   ├── stripe_account_id, platform_fee_percent
│   ├── logo_url, primary_color
│   ├── operating_config: { study_hall_days, campus_days, ... }
│   ├── escalation_thresholds: { max_idle_hours, max_nce_failures }
│   ├── created_at, updated_at
│   │
│   └── centers/{centerId}                    ← SUB-COLLECTION
│       ├── name, address, city, capacity, status
│       ├── operating_config_override
│       │
│       └── attendance/{attendanceId}         ← SUB-COLLECTION
│           ├── student_uid, check_in_at, check_out_at
│           ├── session_type, recorded_by
│
├── users/{uid}                               ← Mirrors Firebase Auth UID
│   ├── email, full_name, avatar_url, role
│   ├── franchise_id, center_id
│   ├── parent_uid, date_of_birth
│   ├── enrollment_year, hs_graduation_target_year
│   ├── preferred_language
│   ├── onboarding_complete, survey_data
│   ├── created_at, updated_at
│   │
│   ├── enrollments/{enrollmentId}            ← SUB-COLLECTION
│   │   ├── course_id, external_enrollment_id
│   │   ├── status, grade_letter, grade_numeric
│   │   ├── completion_percentage
│   │   ├── enrolled_at, completed_at, last_synced_at
│   │
│   ├── nce_progress/{scenarioId}             ← SUB-COLLECTION (doc ID = scenario ID)
│   │   ├── current_step, step_data
│   │   ├── artifact_content, extracted_models
│   │   ├── evaluation_score, evaluation_feedback
│   │   ├── xp_awarded, skills_delta
│   │
│   └── student_pathways/{pathwayId}          ← SUB-COLLECTION
│       ├── pathway_id, selected_at, status
│
├── institutions/{institutionId}
│   ├── name, short_code, institution_type, country
│   ├── lms_type, lms_base_url, lti_client_id
│   ├── supports_lti, supports_webhooks
│   ├── status
│
├── courses/{courseId}
│   ├── institution_id, course_code, title, credits
│   ├── launch_url_template, ge_category
│   ├── is_self_paced, estimated_weeks, status
│
├── requirement_matrices/{matrixId}
│   ├── name, matrix_type, description
│   ├── requirements: { ... }  ← same JSONB structure
│   ├── applies_to_country, is_default
│
├── course_equivalencies/{equivId}
│   ├── course_id, matrix_id, requirement_key, credits_fulfilled
│
├── career_pathways/{pathwayId}
│   ├── name, slug, description, icon_name, color
│   ├── requires_ge_complete, display_order, status
│
├── pathway_courses/{id}
│   ├── pathway_id, course_id, is_required, display_order
│
├── nce_scenarios/{scenarioId}
│   ├── title, course_id
│   ├── step1_confusion, step2_immersion, step3_theory
│   ├── step4_artifact, step5_extraction
│   ├── system_prompt_template, knowledge_context
│   ├── difficulty_level, estimated_minutes
│   ├── skills_assessed, created_by, status
│
├── support_tickets/{ticketId}
│   ├── student_uid, franchise_id, center_id, assigned_to
│   ├── ticket_type, priority, title, description
│   ├── trigger_source, trigger_data
│   ├── status, resolution_notes
│   ├── sla_due_at, resolved_at
│
├── subscriptions/{subId}
│   ├── user_uid, franchise_id
│   ├── stripe_customer_id, stripe_subscription_id
│   ├── plan, status
│   ├── current_period_start, current_period_end
│
└── audit_log/{logId}                         ← Append-only
    ├── timestamp (serverTimestamp)
    ├── actor_uid, actor_role
    ├── franchise_id, center_id
    ├── action, resource_type, resource_id
    ├── old_data, new_data
    ├── ip_address, user_agent
```

### 3.2 Key Design Decisions

| Decision | Rationale |
|---|---|
| `enrollments` as sub-collection of `users` | Students only read their own. RLS equivalent is trivially `request.auth.uid == userId`. Avoids collection group query overhead. |
| `attendance` as sub-collection of `centers` | Queried by center staff per-center. Keeps attendance data co-located for partition efficiency. |
| `nce_progress` as sub-collection of `users` | Each student's NCE state is private. Doc ID = scenario ID for efficient upserts. |
| `audit_log` as top-level collection | Must be queryable across all tenants by super_admin. Security rules enforce append-only. |
| Flatten references (store IDs, not nested docs) | Firestore charges per document read. Storing `institution_id` on a `course` doc and fetching the institution separately is cheaper than embedding entire institution objects. |

---

## 4. Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ===== HELPER FUNCTIONS =====
    function isAuthenticated() {
      return request.auth != null;
    }

    function isRole(role) {
      return isAuthenticated() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }

    function isSuperAdmin() {
      return isRole('super_admin');
    }

    function isFranchiseOwner(franchiseId) {
      return isAuthenticated() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'franchise_owner' &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.franchise_id == franchiseId;
    }

    function isOwnData(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // ===== USERS =====
    match /users/{userId} {
      allow read: if isOwnData(userId) || isSuperAdmin();
      allow write: if isOwnData(userId) || isSuperAdmin();

      // Enrollments sub-collection
      match /enrollments/{enrollmentId} {
        allow read: if isOwnData(userId) || isSuperAdmin();
        allow write: if isSuperAdmin(); // Only admin/functions can write grades
      }

      // NCE Progress sub-collection
      match /nce_progress/{scenarioId} {
        allow read, write: if isOwnData(userId);
      }

      // Student Pathways
      match /student_pathways/{pathwayId} {
        allow read, write: if isOwnData(userId);
      }
    }

    // ===== FRANCHISES =====
    match /franchises/{franchiseId} {
      allow read: if isFranchiseOwner(franchiseId) || isSuperAdmin();
      allow write: if isSuperAdmin();

      match /centers/{centerId} {
        allow read: if isFranchiseOwner(franchiseId) || isSuperAdmin();
        allow write: if isSuperAdmin();

        match /attendance/{attendanceId} {
          allow read: if isFranchiseOwner(franchiseId) || isSuperAdmin();
          allow create: if isAuthenticated(); // Staff can create
        }
      }
    }

    // ===== PUBLIC CATALOG (Read-Only) =====
    match /institutions/{docId} {
      allow read: if true; // Public catalog
      allow write: if isSuperAdmin();
    }

    match /courses/{docId} {
      allow read: if true;
      allow write: if isSuperAdmin();
    }

    match /career_pathways/{docId} {
      allow read: if true;
      allow write: if isSuperAdmin();
    }

    match /nce_scenarios/{docId} {
      allow read: if isAuthenticated();
      allow write: if isSuperAdmin();
    }

    // ===== SUPPORT TICKETS =====
    match /support_tickets/{ticketId} {
      allow read: if isAuthenticated() &&
        (resource.data.student_uid == request.auth.uid || isSuperAdmin());
      allow create: if isAuthenticated();
      allow update: if isSuperAdmin();
    }

    // ===== AUDIT LOG (Append-Only) =====
    match /audit_log/{logId} {
      allow read: if isSuperAdmin();
      allow create: if isAuthenticated();
      // NO update or delete — immutable
    }

    // ===== SUBSCRIPTIONS =====
    match /subscriptions/{subId} {
      allow read: if isAuthenticated() &&
        resource.data.user_uid == request.auth.uid;
      allow write: if false; // Only Cloud Functions write
    }
  }
}
```

---

## 5. Firebase Authentication Strategy

### 5.1 Sign-In Methods

| Method | Use Case | Priority |
|---|---|---|
| **Email Link (Passwordless)** | Primary auth — replaces Magic Link | P0 |
| **Google Sign-In** | Convenience for students with Gmail | P0 |
| **Apple Sign-In** | Required for future iOS app | P1 |
| **SAML / OIDC Federation** | University SSO for partner institutions | P2 |
| **Phone (SMS)** | Parent verification (Brazil market) | P2 |

### 5.2 Custom Claims for RBAC

Firebase Auth supports **Custom Claims** set via the Admin SDK. This replaces the Supabase `profiles.role` column for authorization:

```javascript
// Set via Cloud Function (Admin SDK) on user creation or role change
admin.auth().setCustomUserClaims(uid, {
  role: 'franchise_owner',
  franchise_id: 'abc123',
  center_id: 'center-xyz'
});
```

**Frontend reads claims from the ID token:**
```javascript
const idTokenResult = await firebase.auth().currentUser.getIdTokenResult();
const role = idTokenResult.claims.role;       // 'student', 'franchise_owner', etc.
const franchiseId = idTokenResult.claims.franchise_id;
```

This is **faster and cheaper** than the Supabase approach (which required a DB read to `profiles` on every request to determine role).

### 5.3 Auth → Firestore Profile Sync

A Cloud Function `onUserCreate` trigger automatically provisions the `/users/{uid}` Firestore document when a new Firebase Auth user is created:

```javascript
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  await admin.firestore().doc(`users/${user.uid}`).set({
    email: user.email,
    full_name: user.displayName || '',
    role: 'student', // Default role
    onboarding_complete: false,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  });
});
```

---

## 6. Cloud Functions (v2) — Serverless Backend

### 6.1 Function Inventory

| Function | Trigger | Replaces | Description |
|---|---|---|---|
| `onUserCreate` | `auth.user().onCreate` | Profile auto-creation | Provisions Firestore user document |
| `setUserRole` | `onCall` (Admin SDK) | Manual role assignment | Sets Custom Claims and updates user doc |
| `lmsWebhook` | `onRequest` (HTTP) | `supabase/functions/lms-webhook` | LMS webhook ingestion with adapter pattern |
| `createCheckout` | `onCall` | `supabase/functions/create-checkout` | Creates Stripe Checkout Session with Connect splits |
| `stripeWebhook` | `onRequest` (HTTP) | `supabase/functions/stripe-webhook` | Processes Stripe events, updates subscriptions |
| `evaluateNce` | `onCall` | Part of `NCEService.js` server logic | LLM-as-a-judge evaluation via Gemini API |
| `runEscalationCheck` | `onSchedule` (cron) | Manual trigger in `EscalationService` | Scans telemetry, creates tickets automatically |
| `slaEnforcer` | `onSchedule` (every 15 min) | None (new) | Escalates tickets nearing SLA breach |

### 6.2 Environment Configuration

```bash
firebase functions:config:set \
  stripe.secret_key="sk_live_..." \
  stripe.webhook_secret="whsec_..." \
  stripe.team_price_id="price_..." \
  stripe.pro_price_id="price_..." \
  gemini.api_key="AIza..." \
  app.site_url="https://unischool.app"
```

---

## 7. Migration Execution Plan

### Phase 1: Foundation (Week 1)
1. `npm install firebase` — add Firebase JS SDK to the project
2. Create `src/services/FirebaseClient.js` — initialize Firebase app, auth, and Firestore
3. Create `src/services/AuthService.js` — implement Email Link + Google sign-in
4. Create Firebase project in Google Cloud Console
5. Configure Authentication providers (Email Link, Google)
6. Write initial Firestore Security Rules
7. Update `.env.local` with Firebase config variables

### Phase 2: Data Layer Migration (Week 2)
1. Rewrite `InstitutionService.js` to use Firestore queries
2. Rewrite `EnrollmentService.js` to use Firestore sub-collections
3. Rewrite `NCEService.js` to use Firestore
4. Rewrite `PathwayService.js` to use Firestore
5. Rewrite `CenterOpsService.js` to use Firestore
6. Rewrite `EscalationService.js` to use Firestore
7. Create `seed.js` script (Firebase Admin SDK) to populate initial data

### Phase 3: Cloud Functions (Week 3)
1. Initialize `firebase init functions` (Node.js)
2. Implement `onUserCreate` trigger
3. Implement `setUserRole` callable function
4. Port `lms-webhook` Edge Function → Cloud Function
5. Port `create-checkout` Edge Function → Cloud Function
6. Port `stripe-webhook` Edge Function → Cloud Function
7. Implement `runEscalationCheck` scheduled function
8. Implement `slaEnforcer` scheduled function

### Phase 4: Frontend Integration (Week 4)
1. Replace all `import { supabase }` references with `import { db, auth }`
2. Update `MagicLinkService.js` → `AuthService.js` across all components
3. Update `App.jsx` auth flow to use `onAuthStateChanged` listener
4. Add Firestore offline persistence configuration
5. Remove Supabase SDK dependency from `package.json`
6. Remove `supabase/` directory (migrations, edge functions)

### Phase 5: Testing & Cutover (Week 5)
1. End-to-end testing of all auth flows
2. Verify Security Rules with Firebase Emulator Suite
3. Load test Firestore queries
4. DNS cutover if using Firebase Hosting
5. Monitor Firebase Usage Dashboard for cost anomalies

---

## 8. Environment Variables (New)

```env
# Firebase Client SDK (Public — safe for frontend)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=unischool-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=unischool-prod
VITE_FIREBASE_STORAGE_BUCKET=unischool-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Stripe (Cloud Functions only — NOT exposed to frontend)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Gemini API (Cloud Functions only)
GEMINI_API_KEY=AIza...
```

**Variables to REMOVE:**
```env
VITE_SUPABASE_URL          ← DELETE
VITE_SUPABASE_ANON_KEY     ← DELETE
SUPABASE_SERVICE_ROLE_KEY  ← DELETE (was in Edge Functions)
```

---

## 9. Risk Mitigation

| Risk | Mitigation |
|---|---|
| **Data loss during migration** | Seed script is idempotent. No destructive operations until Supabase is confirmed decommissioned. |
| **NoSQL query limitations** | Pre-define composite indexes in `firestore.indexes.json`. Use denormalization where needed (e.g., store `institution_name` on course docs). |
| **Cost spikes from Firestore reads** | Implement client-side caching with `enablePersistence()`. Use `onSnapshot` listeners instead of repeated fetches. |
| **Security rule complexity** | Test all rules exhaustively with Firebase Emulator Suite before deploy. |
| **Stripe webhook reliability** | Cloud Functions v2 supports retry on failure. Configure dead-letter queues. |

---

## 10. Success Criteria

- [ ] All 7 role types can authenticate via Firebase Auth (Email Link + Google)
- [ ] Custom Claims correctly enforce RBAC across all Firestore collections
- [ ] Firestore Security Rules pass 100% of test cases in Emulator Suite
- [ ] Offline mode works: Student can browse courses and view progress without internet
- [ ] LMS webhook ingestion processes events within < 2 seconds
- [ ] Stripe checkout and subscription lifecycle works end-to-end
- [ ] Audit log is append-only and queryable by super_admin
- [ ] Zero Supabase dependencies remain in `package.json`
- [ ] All existing frontend components render correctly with new backend
- [ ] Seed data matches or exceeds quality of PostgreSQL seed data
