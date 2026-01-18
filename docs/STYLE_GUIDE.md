# University School AI - Brand Style Guide

> **Design Philosophy:** "Playful Yet Academic" - Solarpunk meets High-Performance

![University School Logo](/public/images/unischool-logo.png)

---

## 1. Color Palette

### Primary Colors (From Logo)

| Name | Hex | HSL | Usage |
|------|-----|-----|-------|
| **Crimson** | `#8B2332` | `352°, 60%, 34%` | Primary brand, headers, CTAs |
| **Gold** | `#C9B47C` | `43°, 42%, 64%` | Accents, highlights, achievements |
| **Deep Crimson** | `#6B1A26` | `350°, 62%, 26%` | Hover states, borders |

### Extended Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Ivory** | `#FAF8F5` | Light mode backgrounds |
| **Warm White** | `#FFFDF9` | Cards, panels |
| **Charcoal** | `#2D2D2D` | Body text |
| **Slate** | `#5A5A5A` | Secondary text |
| **Success Green** | `#2E7D32` | XP gains, completions |
| **Quest Blue** | `#1565C0` | Active quests, links |

### Dark Mode (The Cockpit)

| Name | Hex | Usage |
|------|-----|-------|
| **Midnight** | `#0A1628` | App background |
| **Panel Dark** | `#142238` | Cards, surfaces |
| **Crimson Glow** | `#A8324C` | Accent lighting |
| **Gold Bright** | `#E5C97A` | Highlights |

---

## 2. Typography

### Font Stack

```css
/* Headlines - Academic with Character */
--font-display: 'Playfair Display', 'Georgia', serif;

/* Body - Clean & Modern */
--font-body: 'Inter', 'Segoe UI', sans-serif;

/* UI Elements - Friendly */
--font-ui: 'Nunito', 'Poppins', sans-serif;

/* Code/Data - Technical */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

| Element | Size | Weight | Font |
|---------|------|--------|------|
| Hero Title | 4rem (64px) | 700 | Playfair Display |
| Section Header | 2.5rem (40px) | 600 | Playfair Display |
| Card Title | 1.5rem (24px) | 600 | Nunito |
| Body | 1rem (16px) | 400 | Inter |
| Caption | 0.875rem (14px) | 400 | Inter |
| Button | 0.875rem (14px) | 600 | Nunito |

---

## 3. Visual Elements

### Iconography
- **Style:** Rounded, friendly with academic undertones
- **Stroke:** 2px consistent weight
- **Library:** Phosphor Icons (matches "playful yet professional")

### Border Radius
```css
--radius-sm: 8px;   /* Buttons, inputs */
--radius-md: 12px;  /* Cards */
--radius-lg: 20px;  /* Modals, panels */
--radius-xl: 28px;  /* Hero elements */
```

### Shadows
```css
/* Subtle lift - cards */
--shadow-card: 0 4px 20px rgba(139, 35, 50, 0.08);

/* Interactive hover */
--shadow-hover: 0 8px 30px rgba(139, 35, 50, 0.15);

/* Floating elements */
--shadow-float: 0 12px 40px rgba(139, 35, 50, 0.2);
```

---

## 4. Component Patterns

### Buttons

```css
/* Primary CTA */
.btn-primary {
  background: linear-gradient(135deg, #8B2332 0%, #A8324C 100%);
  color: #FFFDF9;
  border-radius: 12px;
  padding: 14px 28px;
  font-family: var(--font-ui);
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(139, 35, 50, 0.3);
}

/* Secondary */
.btn-secondary {
  background: transparent;
  border: 2px solid #C9B47C;
  color: #8B2332;
}

/* Quest Accept */
.btn-quest {
  background: linear-gradient(135deg, #C9B47C 0%, #E5C97A 100%);
  color: #2D2D2D;
}
```

### Cards

```css
.card-quest {
  background: var(--bg-panel);
  border: 1px solid rgba(201, 180, 124, 0.2);
  border-radius: var(--radius-md);
  /* Subtle gold shimmer on left edge */
  border-left: 4px solid var(--gold);
}

.card-achievement {
  background: linear-gradient(135deg, rgba(201, 180, 124, 0.1) 0%, transparent 100%);
  border: 1px solid var(--gold);
}
```

### Progress Bars (XP Style)

```css
.xp-bar {
  background: rgba(201, 180, 124, 0.2);
  border-radius: 100px;
  overflow: hidden;
}

.xp-fill {
  background: linear-gradient(90deg, #C9B47C, #E5C97A);
  border-radius: 100px;
  box-shadow: 0 0 10px rgba(201, 180, 124, 0.5);
}
```

---

## 5. Motion & Animation

### Principles
- **Playful but not distracting** - Micro-interactions that reward
- **Academic gravitas** - Important actions feel weighty
- **Achievement celebration** - XP gains get special treatment

### Timing Functions
```css
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-enter: cubic-bezier(0, 0, 0.2, 1);
```

### Key Animations
```css
/* Quest completion burst */
@keyframes quest-complete {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); box-shadow: 0 0 40px rgba(201, 180, 124, 0.6); }
  100% { transform: scale(1); }
}

/* XP gain notification */
@keyframes xp-pop {
  0% { opacity: 0; transform: translateY(20px) scale(0.8); }
  60% { transform: translateY(-10px) scale(1.1); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

/* Skill level up */
@keyframes level-up {
  0% { filter: brightness(1); }
  50% { filter: brightness(1.5); }
  100% { filter: brightness(1); }
}
```

---

## 6. Voice & Tone

### The Navigator's Voice
- **Encouraging but not patronizing**
- **Strategic and game-like** ("Quest," "Mission," "Level Up")
- **Academically rigorous** (never dumbs down content)

### Examples
| ❌ Don't | ✅ Do |
|----------|-------|
| "Good job on your homework!" | "Quest Complete: +150 XP. You've unlocked the Advanced Physics questline." |
| "You failed the test." | "Boss Battle Lost. The Navigator has generated a training montage to rebuild your Logic stats." |
| "Click here to start" | "Accept Mission" |

---

## 7. Responsive Breakpoints

```css
--bp-mobile: 480px;
--bp-tablet: 768px;
--bp-laptop: 1024px;
--bp-desktop: 1280px;
--bp-wide: 1536px;
```

---

## 8. Accessibility

- **Contrast Ratios:** All text meets WCAG 2.1 AA (4.5:1 minimum)
- **Focus States:** Visible gold outline on all interactive elements
- **Motion:** Respect `prefers-reduced-motion`
- **Font Sizes:** Minimum 14px, scalable with user preferences

---

## 9. File Naming Conventions

```
/public/images/
  unischool-logo.png          # Primary logo
  unischool-logo-dark.png     # Dark mode variant
  unischool-icon.png          # Favicon/app icon
  
/src/assets/icons/
  quest-*.svg                 # Quest-related icons
  skill-*.svg                 # Skill tree icons
  nav-*.svg                   # Navigation icons
```
