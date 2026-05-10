import { prisma } from "@/lib/db/prisma";

export const maxDuration = 10;

export async function GET(req: Request) {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Lightweight query — just counts orgs, keeps Supabase active
    const count = await prisma.organization.count();
    const ts = new Date().toISOString();
    console.log(`[keepalive] ${ts} — DB active, ${count} org(s)`);

    return Response.json({ ok: true, ts, orgs: count });
  } catch (err: any) {
    console.error("[keepalive] DB ping failed:", err.message);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
