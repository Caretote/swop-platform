import { anthropic, MODEL } from "@/lib/ai/client";
import { RISK_AUDITOR_PROMPT, BUDGET_VALIDATOR_PROMPT, BENCHMARK_COMPARATOR_PROMPT } from "@/lib/ai/prompts";

export const maxDuration = 120;

async function runSubAgent(systemPrompt: string, planContext: string) {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: "user", content: `Review this workforce plan:\n\n${planContext}` }],
  });
  const text = response.content[0].type === "text" ? response.content[0].text : "{}";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch?.[0] ?? '{"findings":[],"score":50,"summary":"Review complete"}');
}

export async function POST(req: Request) {
  const { planId, planContext } = await req.json();

  const context = planContext ?? `Plan: FY2026 Annual Workforce Plan
Total HC: 2,400 → Target 2,460 (+60)
Budget: $236M HC spend
Key assumptions: 15% revenue growth, 8% attrition, 90-day avg TTF
Top hires: 22 SWE L5, 18 Enterprise AEs, 8 ML Engineers
Automation: 12 SDR roles → Agentforce agents`;

  try {
    const [riskFindings, budgetFindings, benchmarkFindings] = await Promise.all([
      runSubAgent(RISK_AUDITOR_PROMPT, context),
      runSubAgent(BUDGET_VALIDATOR_PROMPT, context),
      runSubAgent(BENCHMARK_COMPARATOR_PROMPT, context),
    ]);

    const overallScore = Math.round((riskFindings.score + budgetFindings.score + benchmarkFindings.score) / 3);

    const conflicts = [];
    if (riskFindings.score < 60 && benchmarkFindings.score > 75) {
      conflicts.push({ agents: ["Risk Auditor", "Benchmark Comparator"], description: "Risk Auditor flagged HIGH severity items but Benchmark Comparator found metrics within industry norms — investigate assumptions.", resolution: "MANUAL_REVIEW" });
    }

    return Response.json({
      planId,
      riskFindings,
      budgetFindings,
      benchmarkFindings,
      conflicts,
      overallScore,
      recommendation: overallScore >= 75 ? "Approve with minor notes" : overallScore >= 60 ? "Approve with modifications" : "Return for revision",
      completedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
