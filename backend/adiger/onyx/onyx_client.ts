/**
 * onyx_client.ts â€” A-DIGER â†” Onyx Bridge
 *
 * Provides a typed TypeScript client that communicates with a locally-hosted
 * Onyx instance (http://localhost:8080) to perform deep-research RAG queries
 * against the indexed Qluu Data Room.
 *
 * The client is designed to be used by run_auto_draft.ts to generate
 * high-quality Volume 2/3/4 prose while the rigid SBIR skeleton
 * is still controlled by A-DIGER TypeScript templates.
 */

const ONYX_BASE_URL = process.env.ONYX_URL || 'http://localhost:8080';

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface OnyxMessage {
    message: string;
    chat_session_id?: number;
    parent_message_id?: number | null;
    persona_id?: number;
    retrieval_options?: {
        run_search: 'always' | 'never' | 'auto';
        filters?: {
            source_type?: string[];
            document_set?: string[];
        };
    };
}

export interface OnyxChatResponse {
    message_id: number;
    chat_session_id: number;
    answer: string;
    citations: Array<{
        document_id: string;
        source_type: string;
        link: string;
        blurb: string;
    }>;
    error?: string;
}

export interface OnyxHealthStatus {
    status: 'ok' | 'error';
    version?: string;
    detail?: string;
}

// â”€â”€â”€ Health Check â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function checkOnyxHealth(): Promise<OnyxHealthStatus> {
    try {
        const res = await fetch(`${ONYX_BASE_URL}/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(5000),
        });
        if (res.ok) {
            return { status: 'ok', detail: `Onyx reachable at ${ONYX_BASE_URL}` };
        }
        return { status: 'error', detail: `Onyx returned HTTP ${res.status}` };
    } catch (err: any) {
        return { status: 'error', detail: err.message || 'Onyx unreachable' };
    }
}

// â”€â”€â”€ Chat Session Management â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function createChatSession(personaId: number = 0): Promise<number> {
    const res = await fetch(`${ONYX_BASE_URL}/api/chat/create-chat-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            persona_id: personaId,
            description: `A-DIGER Auto-Draft Session ${new Date().toISOString()}`
        }),
    });
    if (!res.ok) throw new Error(`Failed to create Onyx session: ${res.status}`);
    const data = await res.json() as { chat_session_id: number };
    return data.chat_session_id;
}

// â”€â”€â”€ Send Message (RAG Query) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function sendOnyxMessage(payload: OnyxMessage): Promise<OnyxChatResponse> {
    const res = await fetch(`${ONYX_BASE_URL}/api/chat/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errText = await res.text().catch(() => 'Unknown error');
        throw new Error(`Onyx chat error (${res.status}): ${errText}`);
    }

    // Onyx streams responses as newline-delimited JSON.
    // We accumulate the full answer from the stream.
    const rawText = await res.text();
    const lines = rawText.split('\n').filter(l => l.trim());
    
    let finalAnswer = '';
    let messageId = 0;
    let chatSessionId = payload.chat_session_id || 0;
    const citations: OnyxChatResponse['citations'] = [];

    for (const line of lines) {
        try {
            const chunk = JSON.parse(line);
            if (chunk.answer_piece) {
                finalAnswer += chunk.answer_piece;
            }
            if (chunk.message_id) messageId = chunk.message_id;
            if (chunk.chat_session_id) chatSessionId = chunk.chat_session_id;
            if (chunk.citations) {
                citations.push(...chunk.citations);
            }
        } catch {
            // Skip non-JSON lines (SSE delimiters, etc.)
        }
    }

    return {
        message_id: messageId,
        chat_session_id: chatSessionId,
        answer: finalAnswer,
        citations,
    };
}

// â”€â”€â”€ High-Level: Generate SBIR Volume Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * queryOnyxForVolume â€” The primary interface used by run_auto_draft.ts
 *
 * Sends a structured prompt to Onyx asking it to write a specific
 * Volume section using all indexed Qluu Data Room context.
 *
 * @param section  - e.g. "Significance of the Problem"
 * @param context  - Extracted RFP text / must-haves from the shredder
 * @param guidance - Additional constraints (tone, word count, etc.)
 * @returns        - The generated prose string
 */
export async function queryOnyxForVolume(
    section: string,
    context: string,
    guidance: string = ''
): Promise<string> {
    const health = await checkOnyxHealth();
    if (health.status !== 'ok') {
        console.warn(`âš ï¸ Onyx unavailable (${health.detail}). Falling back to template.`);
        return '';
    }

    try {
        const sessionId = await createChatSession();
        
        const prompt = `You are a defense technology proposal writer for Qluu Lab Inc., 
a counter-UAS autonomous defense company. Write the "${section}" section for a DoW SBIR proposal.

CONTEXT FROM THE SOLICITATION:
${context.substring(0, 8000)}

WRITING GUIDELINES:
- Use formal, technical DoW proposal language
- Reference specific Qluu capabilities from the indexed data room
- Cite TRL levels accurately (Software TRL-6, Hardware TRL-3)
- Do NOT fabricate contract numbers, certifications, or deployment claims
- Keep the section between 300-600 words
${guidance}

Write ONLY the section content. Do not include headers or preamble.`;

        const response = await sendOnyxMessage({
            message: prompt,
            chat_session_id: sessionId,
            parent_message_id: null,
            retrieval_options: {
                run_search: 'always',
            },
        });

        if (response.answer && response.answer.length > 50) {
            console.log(`  âœ… Onyx generated ${response.answer.length} chars for "${section}" (${response.citations.length} citations)`);
            return response.answer;
        }

        console.warn(`  âš ï¸ Onyx response too short for "${section}". Falling back.`);
        return '';
    } catch (err: any) {
        console.warn(`  âš ï¸ Onyx query failed for "${section}": ${err.message}. Falling back.`);
        return '';
    }
}
