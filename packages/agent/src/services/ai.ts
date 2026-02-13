import { config } from 'dotenv';

config();

interface VerificationResult {
    verified: boolean;
    confidence: number;
    reasoning: string;
}

export async function verifyWithClaude(condition: string, proofText: string): Promise<VerificationResult> {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';

        if (!apiKey) {
            throw new Error('OPENROUTER_API_KEY not found in environment');
        }

        const prompt = `You are an impartial executor for a digital inheritance vault.
Your task is to verify if the provided proof satisfies the condition set by the vault creator.

Condition: "${condition}"
Proof Content: "${proofText}"

Analyze strictly. Is the condition met?
Respond in JSON format:
{
  "verified": boolean,
  "confidence": number (0-1),
  "reasoning": "short explanation"
}`;

        console.log(`🤖 Calling OpenRouter (${model})...`);

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://reliq.app',
                'X-Title': 'ReliQ Agent'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        console.log('🤖 OpenRouter response:', content);

        // Parse JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to parse JSON from OpenRouter response');
        }

        const result = JSON.parse(jsonMatch[0]);

        return {
            verified: result.verified,
            confidence: result.confidence,
            reasoning: result.reasoning
        };
    } catch (error) {
        console.error('❌ AI Verification Error:', error);
        return {
            verified: false,
            confidence: 0,
            reasoning: `AI Verification Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}
