import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[cron/snapshot] Monthly plan snapshot triggered:", new Date().toISOString());

  return NextResponse.json({ success: true, message: "Snapshot cron triggered", timestamp: new Date().toISOString() });
}
