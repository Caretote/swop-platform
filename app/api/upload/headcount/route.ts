import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface HeadcountRow {
  employee_id?: string;
  name?: string;
  role?: string;
  level?: string;
  bu?: string;
  location?: string;
  salary?: string | number;
  start_date?: string;
  status?: string;
}

function parseCSV(text: string): HeadcountRow[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = (values[i] ?? "").trim().replace(/^"|"$/g, ""); });
    return row as HeadcountRow;
  });
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const text = form.get("text") as string | null;

    let csvText = text ?? "";
    if (file) {
      const buf = await file.arrayBuffer();
      csvText = new TextDecoder().decode(buf);
    }

    if (!csvText) {
      return NextResponse.json({ error: "No CSV data provided" }, { status: 400 });
    }

    const rows = parseCSV(csvText);
    const valid = rows.filter((r) => r.role || r.name || r.employee_id);
    const invalid = rows.length - valid.length;

    const summary = {
      total: rows.length,
      valid: valid.length,
      invalid,
      preview: valid.slice(0, 5),
      columns: rows.length > 0 ? Object.keys(rows[0]) : [],
    };

    return NextResponse.json({ success: true, summary });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
