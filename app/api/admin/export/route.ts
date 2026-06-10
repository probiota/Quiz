import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase";
import Papa from "papaparse";

// Question labels for CSV column headers
const QUESTION_LABELS: Record<number, string> = {
  1: "Q1 - Primary Health Goal",
  2: "Q2 - Daily Struggle",
  3: "Q3 - Lifestyle Type",
  4: "Q4 - Digestive Discomfort",
  5: "Q5 - Energy & Wake Up Feeling"
};

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

    // Flatten each lead into a flat row with individual answer + score columns
    const flattenedLeads = leads.map((lead: any) => {
      // Build answer columns (Q1 through Q5)
      const answerColumns: Record<string, string> = {};
      for (let qId = 1; qId <= 5; qId++) {
        const colName = QUESTION_LABELS[qId] || `Q${qId}`;
        if (lead.quiz_answers && Array.isArray(lead.quiz_answers)) {
          const answer = lead.quiz_answers.find((a: any) => a.questionId === qId);
          answerColumns[colName] = answer ? answer.selectedOption : "";
        } else {
          answerColumns[colName] = "";
        }
      }

      // Build score columns
      const scoreColumns: Record<string, number> = {};
      const scoreBuckets = ["gut", "ibs", "stress", "sleep", "energy", "eye", "recovery", "omega", "general", "uti"];
      scoreBuckets.forEach(bucket => {
        scoreColumns[`Score - ${bucket.toUpperCase()}`] = lead.quiz_scores?.[bucket] ?? 0;
      });

      return {
        "Date": lead.created_at ? new Date(lead.created_at).toLocaleString() : "",
        "First Name": lead.first_name || "",
        "Last Name": lead.last_name || "",
        "Email": lead.email || "",
        "Phone": lead.phone || "",
        "Age Group": lead.age_group || "",
        "Gender": lead.gender || "",
        "Lifestyle Type": lead.lifestyle_type || "",
        "Primary Goal": lead.primary_goal || "",
        "Email Consent": lead.email_consent ? "Yes" : "No",
        ...answerColumns,
        ...scoreColumns,
        "Primary Concern": lead.primary_concern || "",
        "Secondary Concern": lead.secondary_concern || "",
        "Recommended Product": lead.recommended_product || "",
        "Explanation": lead.explanation || "",
        "Source": lead.source || ""
      };
    });

    // Convert to CSV using PapaParse
    const csv = Papa.unparse(flattenedLeads);

    // Return the CSV file
    const headers = new Headers();
    headers.set("Content-Type", "text/csv; charset=utf-8");
    headers.set("Content-Disposition", 'attachment; filename="gut_and_beyond_leads.csv"');

    return new NextResponse(csv, { status: 200, headers });
  } catch (error) {
    console.error("API /admin/export error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
