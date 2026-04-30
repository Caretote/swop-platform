import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // In production: run attrition model against all cohorts and store results
  console.log("[cron/attrition] Daily attrition re-score triggered:", new Date().toISOString());

  return NextResponse.json({ success: true, message: "Attrition cron triggered", timestamp: new Date().toISOString() });
}
