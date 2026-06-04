import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase";
import { sendResultsEmail } from "../../../lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { leadData, resultData } = body;

    if (!leadData || !leadData.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const nameParts = (leadData.full_name || "").trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    // 1. Save to Supabase (if configured)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "placeholder_supabase_url") {
      const { error: dbError } = await supabaseAdmin
        .from("leads")
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            email: leadData.email,
            phone: leadData.phone || null,
            email_consent: leadData.email_consent,
            sms_consent: false,
            gender: leadData.gender,
            primary_concern: resultData.primary_concern,
            secondary_concern: resultData.secondary_concern,
            recommended_product: resultData.recommended_product,
            quiz_scores: resultData.scores,
            source: "website_quiz"
          }
        ]);

      if (dbError) {
        console.error("Supabase insert error:", dbError);
        // Continue anyway so user can get email
      }
    } else {
      console.log("Supabase not configured, skipping DB insert for:", leadData.email);
    }

    // 2. Send Email via Resend
    if (leadData.email_consent) {
      await sendResultsEmail(leadData.email, firstName, resultData);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API /submit error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
