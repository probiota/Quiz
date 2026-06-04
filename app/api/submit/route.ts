import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase";
import { sendResultsEmail } from "../../../lib/email";

// =============================================
// SERVER-SIDE VALIDATION HELPERS
// =============================================

function isValidName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim();
  if (trimmed.length < 2) return { valid: false, error: "Name must be at least 2 characters" };
  if (trimmed.length > 50) return { valid: false, error: "Name is too long" };
  if (!/^[a-zA-Z\s'\-.]+$/.test(trimmed)) return { valid: false, error: "Name contains invalid characters" };
  return { valid: true };
}

function isValidEmail(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) return { valid: false, error: "Invalid email format" };

  const localPart = email.split("@")[0].toLowerCase();
  const domain = email.split("@")[1].toLowerCase();

  // Reject common fake local parts
  const fakeLocalParts = [
    "test", "asdf", "fake", "noemail", "noreply", "xxx", "abc", "xyz",
    "aaa", "qwerty", "temp", "dummy", "sample", "admin", "info", "null",
    "undefined", "example", "foobar", "foo", "bar", "baz"
  ];
  if (fakeLocalParts.includes(localPart)) {
    return { valid: false, error: "Please use a real email address" };
  }

  // Reject too-short local parts (1 char like a@gmail.com, x@yahoo.com)
  if (localPart.length < 3) {
    return { valid: false, error: "Email address appears invalid" };
  }

  // Reject disposable / temporary email domains
  const disposableDomains = [
    "mailinator.com", "guerrillamail.com", "tempmail.com", "throwaway.email",
    "yopmail.com", "sharklasers.com", "grr.la", "discard.email", "trashmail.com",
    "10minutemail.com", "guerrillamailblock.com", "maildrop.cc", "temp-mail.org",
    "fakeinbox.com", "mytemp.email", "tmpmail.net", "tmpmail.org"
  ];
  if (disposableDomains.includes(domain)) {
    return { valid: false, error: "Disposable email addresses are not allowed" };
  }

  // Reject obviously fake domains
  if (domain === "example.com" || domain === "test.com" || domain === "fake.com") {
    return { valid: false, error: "Please use a real email address" };
  }

  return { valid: true };
}

function isValidPhone(phone: string): { valid: boolean; error?: string } {
  const digits = phone.replace(/\D/g, "");

  // Must be at least 10 digits
  if (digits.length < 10 || digits.length > 13) {
    return { valid: false, error: "Phone number must be 10-13 digits" };
  }

  // Get the last 10 digits (the actual number, stripped of country code)
  const last10 = digits.slice(-10);

  // Reject sequential patterns
  const sequentialPatterns = ["1234567890", "0123456789", "9876543210", "0987654321"];
  if (sequentialPatterns.includes(last10)) {
    return { valid: false, error: "Please enter a real phone number" };
  }

  // Reject all same digits (e.g. 0000000000, 1111111111)
  if (/^(\d)\1{9}$/.test(last10)) {
    return { valid: false, error: "Please enter a real phone number" };
  }

  // Indian mobile numbers start with 6, 7, 8, or 9
  if (!/^[6-9]/.test(last10)) {
    return { valid: false, error: "Invalid Indian mobile number format" };
  }

  return { valid: true };
}

// =============================================
// POST HANDLER
// =============================================

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { leadData, resultData } = body;

    if (!leadData || !leadData.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // --- Server-side validation ---
    const validationErrors: Record<string, string> = {};

    const firstNameCheck = isValidName(leadData.first_name || "");
    if (!firstNameCheck.valid) validationErrors.first_name = firstNameCheck.error!;

    const lastNameCheck = isValidName(leadData.last_name || "");
    if (!lastNameCheck.valid) validationErrors.last_name = lastNameCheck.error!;

    const emailCheck = isValidEmail(leadData.email);
    if (!emailCheck.valid) validationErrors.email = emailCheck.error!;

    const phoneCheck = isValidPhone(leadData.phone || "");
    if (!phoneCheck.valid) validationErrors.phone = phoneCheck.error!;

    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 422 }
      );
    }

    const firstName = (leadData.first_name || "").trim();
    const lastName = (leadData.last_name || "").trim();

    // 1. Save to Supabase (if configured)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "placeholder_supabase_url") {
      const { error: dbError } = await supabaseAdmin
        .from("leads")
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            email: leadData.email.trim().toLowerCase(),
            phone: leadData.phone || null,
            age_group: leadData.age_group || null,
            email_consent: leadData.email_consent,
            sms_consent: false,
            gender: leadData.gender,
            lifestyle_type: resultData.lifestyle_type || null,
            primary_goal: resultData.primary_goal || null,
            primary_concern: resultData.primary_concern,
            secondary_concern: resultData.secondary_concern,
            recommended_product: resultData.recommended_product,
            quiz_scores: resultData.scores,
            quiz_answers: resultData.answers || null,
            explanation: resultData.explanation || null,
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
