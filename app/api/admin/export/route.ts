import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase";
import Papa from "papaparse";

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "placeholder_supabase_url") {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const { data: leads, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching leads for export:", error);
      return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }

    if (!leads || leads.length === 0) {
      return NextResponse.json({ error: "No leads found" }, { status: 404 });
    }

    // Convert JSON to CSV using PapaParse
    const csv = Papa.unparse(leads);

    // Return the CSV file
    const headers = new Headers();
    headers.set("Content-Type", "text/csv");
    headers.set("Content-Disposition", 'attachment; filename="gut_and_beyond_leads.csv"');

    return new NextResponse(csv, { status: 200, headers });
  } catch (error) {
    console.error("API /admin/export error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
