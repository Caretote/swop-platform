import { anthropic, MODEL } from "@/lib/ai/client";
import { SWOP_SYSTEM_PROMPT } from "@/lib/ai/prompts";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const { message, deepThink, history = [] } = await req.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messages = [
          ...history.map((m: any) => ({ role: m.role, content: m.content })),
          { role: "user" as const, content: message },
        ];

        if (deepThink) {
          const response = await anthropic.messages.create({
            model: MODEL,
            max_tokens: 16000,
            thinking: { type: "enabled", budget_tokens: 8000 },
            system: SWOP_SYSTEM_PROMPT,
            messages,
          });

          for (const block of response.content) {
            if (block.type === "thinking") {
              const chunks = block.thinking.match(/.{1,50}/g) ?? [];
              for (const chunk of chunks) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "thinking", text: chunk })}\n\n`));
              }
            }
            if (block.type === "text") {
              const chunks = block.text.match(/.{1,30}/g) ?? [];
              for (const chunk of chunks) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", text: chunk })}\n\n`));
                await new Promise((r) => setTimeout(r, 8));
              }
            }
          }
        } else {
          const streamResp = await anthropic.messages.create({
            model: MODEL,
            max_tokens: 2000,
            system: SWOP_SYSTEM_PROMPT,
            messages,
            stream: true,
          });

          for await (const event of streamResp) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", text: event.delta.text })}\n\n`));
            }
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err: any) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", message: err.message })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
