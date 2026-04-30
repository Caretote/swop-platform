import { anthropic, MODEL } from "@/lib/ai/client";
import { INGESTION_SYSTEM_PROMPT } from "@/lib/ai/prompts";

export const maxDuration = 60;

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const textContent = formData.get("text") as string | null;

  let rawText = textContent ?? "";

  if (file) {
    if (file.type === "text/plain") {
      rawText = await file.text();
    } else {
      // For PDF/DOCX in demo, just use filename as context
      rawText = `Document: ${file.name}\nType: ${file.type}\n[Document content would be extracted here via pdf-parse/mammoth in production]`;
    }
  }

  if (!rawText.trim()) {
    return Response.json({ error: "No content to analyze" }, { status: 400 });
  }

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: INGESTION_SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content: `Extract workforce planning signals from this document:\n\n${rawText.slice(0, 50000)}`,
      }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "{}";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const signals = JSON.parse(jsonMatch?.[0] ?? '{"summary":"Analysis complete","executive_priorities":[]}');

    return Response.json({
      signals,
      fileName: file?.name ?? "text-input",
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
