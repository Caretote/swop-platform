import { anthropic, MODEL } from "@/lib/ai/client";
import { ATTRITION_SYSTEM_PROMPT } from "@/lib/ai/prompts";

export async function POST(req: Request) {
  const { cohortKey, cohortData } = await req.json();

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: ATTRITION_SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content: `Analyze this cohort and return the JSON prediction:\n\nCohort: ${cohortKey}\n\n${JSON.stringify(cohortData, null, 2)}`,
      }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "{}";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const prediction = JSON.parse(jsonMatch?.[0] ?? "{}");

    return Response.json({
      prediction,
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  // Return mock batch results for demo
  const mockResults = [
    { cohortKey: "Sales-L2", riskScore: 0.68, riskTier: "HIGH", topDrivers: ["Below market comp", "No promo in 18mo", "Manager change"], recommendedActions: ["Compensation review", "Promo velocity audit"] },
    { cohortKey: "Engineering-L5", riskScore: 0.52, riskTier: "ELEVATED", topDrivers: ["Strong external demand", "Equity cliff approaching", "Below P50 comp"], recommendedActions: ["Equity refresh", "Market comp adjustment"] },
    { cohortKey: "CS-Support-L3", riskScore: 0.62, riskTier: "HIGH", topDrivers: ["High ticket volume burnout", "Limited AI tooling", "Flat career path"], recommendedActions: ["Agentforce tier-1 automation", "CS career ladder redesign"] },
    { cohortKey: "Marketing-Content-L4", riskScore: 0.55, riskTier: "ELEVATED", topDrivers: ["AI disruption anxiety", "Role ambiguity", "Below market"], recommendedActions: ["Role redesign workshop", "Reskilling plan"] },
    { cohortKey: "Finance-FPA-L3", riskScore: 0.32, riskTier: "MODERATE", topDrivers: ["Repetitive work", "Limited advancement"], recommendedActions: ["FP&A automation tools", "Promotion planning"] },
    { cohortKey: "Engineering-ML-L5", riskScore: 0.40, riskTier: "ELEVATED", topDrivers: ["Competing Anthropic/OpenAI offers", "Below P75 comp"], recommendedActions: ["Immediate comp review", "Equity acceleration"] },
    { cohortKey: "Sales-AE-L5", riskScore: 0.31, riskTier: "MODERATE", topDrivers: ["Q1 quota miss", "Territory concerns"], recommendedActions: ["Quota reassessment", "Territory rebalancing"] },
    { cohortKey: "Engineering-Data-L4", riskScore: 0.22, riskTier: "MODERATE", topDrivers: ["Limited data stack modernization"], recommendedActions: ["Data tooling upgrade roadmap"] },
    { cohortKey: "Operations-L3", riskScore: 0.18, riskTier: "LOW", topDrivers: ["Manual process frustration"], recommendedActions: ["Process automation pilot"] },
    { cohortKey: "Finance-Controller", riskScore: 0.12, riskTier: "LOW", topDrivers: [], recommendedActions: [] },
  ];
  return Response.json({ results: mockResults, lastRun: new Date().toISOString(), totalScored: 847 });
}
