import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { format, data, filename } = await req.json();

  if (format === "csv") {
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: "No data" }, { status: 400 });
    }
    const headers = Object.keys(data[0]);
    const rows = [
      headers.join(","),
      ...data.map((row: Record<string, unknown>) =>
        headers.map((h) => {
          const val = String(row[h] ?? "");
          return val.includes(",") ? `"${val}"` : val;
        }).join(",")
      ),
    ];
    return new NextResponse(rows.join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename ?? "export"}.csv"`,
      },
    });
  }

  if (format === "xlsx") {
    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, "SWOP Export");
      const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
      return new NextResponse(buf, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${filename ?? "export"}.xlsx"`,
        },
      });
    } catch {
      return NextResponse.json({ error: "xlsx export failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
}
