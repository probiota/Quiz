import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase";

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "placeholder_supabase_url") {
      return NextResponse.json({
        total_leads: 0,
        conversion_rate: 0,
        top_concerns: [],
        recent_leads_trend: []
      });
    }

    // Fetch all leads (or a reasonable limit for stats)
    const { data: leads, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) {
      console.error("Supabase error fetching stats:", error);
      return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }

    if (!leads || leads.length === 0) {
      return NextResponse.json({
        total_leads: 0,
        conversion_rate: 0,
        top_concerns: [],
        recent_leads_trend: []
      });
    }

    const total_leads = leads.length;
    
    // Calculate top concerns
    const concernCounts: Record<string, number> = {};
    leads.forEach((lead: any) => {
      const concern = lead.primary_concern;
      if (concern) {
        concernCounts[concern] = (concernCounts[concern] || 0) + 1;
      }
    });

    const top_concerns = Object.entries(concernCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate recent leads trend (last 7 days)
    const trendCounts: Record<string, number> = {};
    leads.forEach((lead: any) => {
      const date = new Date(lead.created_at).toLocaleDateString();
      trendCounts[date] = (trendCounts[date] || 0) + 1;
    });

    const recent_leads_trend = Object.entries(trendCounts)
      .map(([date, count]) => ({ date, count }))
      .slice(0, 7)
      .reverse();

    return NextResponse.json({
      total_leads,
      conversion_rate: 100, // Placeholder, would need page view data to calculate real rate
      top_concerns,
      recent_leads_trend
    });
  } catch (error) {
    console.error("API /admin/stats error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
