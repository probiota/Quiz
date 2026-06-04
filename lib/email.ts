import { Resend } from "resend";
import { AssessmentResult } from "../types";

const resend = new Resend(process.env.RESEND_API_KEY || "placeholder_resend_api_key");

export async function sendResultsEmail(email: string, name: string, result: AssessmentResult) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "placeholder_resend_api_key") {
    console.log("Mock sending email to:", email);
    return;
  }

  const { recommended_product, product_url, primary_concern, explanation } = result;

  try {
    await resend.emails.send({
      from: "Gut & Beyond <hello@gutandbeyond.com>",
      to: email,
      subject: "Your Gut & Beyond Wellness Profile",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1A1A1A;">
          <h1 style="color: #1A1A1A; font-size: 24px; margin-bottom: 20px;">Hi ${name},</h1>
          
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            Thank you for completing the Gut & Beyond Wellness Assessment. Based on your responses, we've identified <strong>${primary_concern}</strong> as a primary focus area.
          </p>

          <div style="background-color: #F7F5F0; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; margin-top: 0; margin-bottom: 12px;">Your Recommended Protocol</h2>
            <p style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">${recommended_product}</p>
            <p style="font-size: 14px; line-height: 1.5; color: #4A4A4A; margin-bottom: 16px;">
              ${explanation}
            </p>
            <a href="${product_url}" style="display: inline-block; background-color: #1A1A1A; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; font-size: 14px;">
              View Protocol Details
            </a>
          </div>

          <p style="font-size: 14px; color: #717171; line-height: 1.5;">
            If you have any questions about your results or our protocols, please reply directly to this email.
          </p>
          
          <p style="font-size: 14px; color: #717171; margin-top: 32px;">
            In health,<br>
            <strong>The Gut & Beyond Team</strong>
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
