import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface Dimensions {
  length: number;
  formality: number;
  complexity: number;
  energy: number;
  mood: number;
}

function describeDimension(value: number, low: string, high: string): string {
  if (value <= 15) return `very ${low}`;
  if (value <= 35) return low;
  if (value <= 65) return `moderate (between ${low} and ${high})`;
  if (value <= 85) return high;
  return `very ${high}`;
}

function buildSystemPrompt(dimensions: Dimensions): string {
  const lengthDesc = describeDimension(dimensions.length, "short (tweet-length, ~30 words max)", "long (essay-length, multiple paragraphs, 200+ words)");
  const formalityDesc = describeDimension(dimensions.formality, "casual (text-message style, abbreviations ok)", "formal (legal-document level precision and propriety)");
  const complexityDesc = describeDimension(dimensions.complexity, "simple (explain like I'm 5, plain words only)", "complex (PhD-level vocabulary and nuanced reasoning)");
  const energyDesc = describeDimension(dimensions.energy, "low-energy (subdued, measured, calm)", "high-energy (enthusiastic, exclamatory, caffeinated)");
  const moodDesc = describeDimension(dimensions.mood, "pessimistic (cautious, highlighting risks and downsides)", "optimistic (upbeat, highlighting opportunities and upsides)");

  return `You are a text rewriting assistant. Rewrite the user's text to match ALL of the following stylistic dimensions simultaneously:

- LENGTH: ${lengthDesc} (value: ${dimensions.length}/100)
- FORMALITY: ${formalityDesc} (value: ${dimensions.formality}/100)
- COMPLEXITY: ${complexityDesc} (value: ${dimensions.complexity}/100)
- ENERGY: ${energyDesc} (value: ${dimensions.energy}/100)
- MOOD: ${moodDesc} (value: ${dimensions.mood}/100)

Rules:
1. Preserve the core meaning and key information of the original text.
2. Apply ALL dimensions together — don't focus on just one.
3. The length dimension is critical: low values mean aggressively short, high values mean elaborately expanded.
4. Output ONLY the rewritten text. No preamble, no explanation, no quotes around it.`;
}

export async function POST(request: NextRequest) {
  try {
    const { text, dimensions } = await request.json();

    if (!text || !dimensions) {
      return NextResponse.json(
        { error: "Missing text or dimensions" },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(dimensions);

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: text }],
    });

    const content = message.content[0];
    const rewrittenText =
      content.type === "text" ? content.text : "Error: unexpected response";

    return NextResponse.json({ text: rewrittenText });
  } catch (error) {
    console.error("Resize API error:", error);
    return NextResponse.json(
      { error: "Failed to resize text" },
      { status: 500 }
    );
  }
}
