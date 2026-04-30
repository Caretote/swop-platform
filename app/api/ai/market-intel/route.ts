import { anthropic, MODEL } from "@/lib/ai/client";
import { MARKET_INTEL_SYSTEM_PROMPT } from "@/lib/ai/prompts";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { jobFamily, location, skill } = await req.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const userMessage = `Job Family: ${jobFamily}\nLocation: ${location}${skill ? `\nSkill: ${skill}` : ""}\n\nProvide a comprehensive labor market intelligence report for workforce planning purposes.`;

        const streamResp = await anthropic.messages.create({
          model: MODEL,
          max_tokens: 3000,
          system: MARKET_INTEL_SYSTEM_PROMPT,
          messages: [{ role: "user", content: userMessage }],
          stream: true,
        });

        for await (const event of streamResp) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", text: event.delta.text })}\n\n`));
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
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
