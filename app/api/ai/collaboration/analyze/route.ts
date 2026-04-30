import { anthropic, MODEL } from "@/lib/ai/client";
import {
  COLLABORATION_DISCOVERY_PROMPT, COLLABORATION_AUGMENTATION_PROMPT,
  COLLABORATION_ROI_PROMPT, ANTI_PATTERN_PROMPT,
} from "@/lib/ai/prompts";

export const maxDuration = 120;

async function runStage(systemPrompt: string, contextData: object, maxTokens = 4000) {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: `Context:\n${JSON.stringify(contextData, null, 2)}\n\nProduce the JSON output now.` }],
  });
  const text = response.content[0].type === "text" ? response.content[0].text : "{}";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return { result: JSON.parse(jsonMatch?.[0] ?? "{}"), tokens: response.usage.input_tokens + response.usage.output_tokens };
}

export async function POST(req: Request) {
  const { functionName, businessUnit, scope } = await req.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (stage: string, data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ stage, ...data })}\n\n`));
      };

      try {
        send("progress", { message: "Stage 1/4: Mapping workflows and tasks..." });
        const { result: discovery } = await runStage(COLLABORATION_DISCOVERY_PROMPT, { functionName, businessUnit, scope });
        send("discovery", discovery);

        send("progress", { message: "Stage 2/4: Analyzing task augmentation modes..." });
        const { result: augmentation } = await runStage(COLLABORATION_AUGMENTATION_PROMPT, { functionName, taskInventory: discovery.task_inventory });
        send("augmentation", augmentation);

        send("progress", { message: "Stages 3-4: Calculating ROI and checking anti-patterns..." });
        const [{ result: roi }, { result: antiPatterns }] = await Promise.all([
          runStage(COLLABORATION_ROI_PROMPT, { functionName, taskAugmentations: augmentation.task_augmentations }),
          runStage(ANTI_PATTERN_PROMPT, { functionName, taskAugmentations: augmentation.task_augmentations }),
        ]);
        send("roi", roi);
        send("anti_patterns", antiPatterns);

        send("complete", { analysisId: `analysis_${Date.now()}`, functionName });
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err: any) {
        send("error", { message: err.message });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
