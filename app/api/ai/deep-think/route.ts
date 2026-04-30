import { anthropic, MODEL } from "@/lib/ai/client";
import { DEEP_THINKING_SYSTEM_PROMPT } from "@/lib/ai/prompts";

export const maxDuration = 120;

export async function POST(req: Request) {
  const { question, context } = await req.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await anthropic.messages.create({
          model: MODEL,
          max_tokens: 16000,
          thinking: { type: "enabled", budget_tokens: 10000 },
          system: DEEP_THINKING_SYSTEM_PROMPT,
          messages: [{
            role: "user",
            content: `${context ? `Org Context:\n${context}\n\n` : ""}Strategic Question: ${question}`,
          }],
        });

        for (const block of response.content) {
          if (block.type === "thinking") {
            const data = JSON.stringify({ type: "thinking", text: block.thinking });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
          if (block.type === "text") {
            const chunks = block.text.match(/.{1,50}/g) ?? [];
            for (const chunk of chunks) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", text: chunk })}\n\n`));
              await new Promise((r) => setTimeout(r, 10));
            }
          }
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "meta", tokens: response.usage.input_tokens + response.usage.output_tokens })}\n\n`));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err: any) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", message: err.message })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
