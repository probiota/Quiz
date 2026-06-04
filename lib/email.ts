import { Resend } from "resend";
import { AssessmentResult } from "../types";
import { COUPON_CODE, COUPON_DISCOUNT, COUPON_VALIDITY_DAYS } from "./config";

const resend = new Resend(process.env.RESEND_API_KEY || "placeholder_resend_api_key");

export async function sendResultsEmail(email: string, name: string, result: AssessmentResult) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "placeholder_resend_api_key") {
    console.log("Mock sending email to:", email);
    return;
  }

  const { recommended_product, product_url, primary_concern, explanation } = result;

  // Calculate expiry date
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + COUPON_VALIDITY_DAYS);
  const expiryFormatted = expiryDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  try {
    await resend.emails.send({
      from: `Gut & Beyond <${process.env.EMAIL_FROM || "hello@gutandbeyond.com"}>`,
      to: email,
      subject: "Your Gut & Beyond Wellness Profile + Exclusive Offer Inside 🎁",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1A1A1A; background-color: #FFFFFF;">
          <h1 style="color: #1A1A1A; font-size: 24px; margin-bottom: 20px;">Hi ${name},</h1>
          
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            Thank you for completing the Gut &amp; Beyond Wellness Assessment. Based on your responses, we have identified <strong>${primary_concern}</strong> as a primary focus area.
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

          <!-- Coupon Code Section -->
          <div style="background: linear-gradient(135deg, #F0FFF0 0%, #F7F5F0 100%); padding: 24px; border-radius: 12px; margin-bottom: 24px; text-align: center; border: 2px dashed #1A1A1A;">
            <p style="font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; color: #4A4A4A; margin-bottom: 8px;">
              🎁 Exclusive IHFF Offer
            </p>
            <h2 style="font-size: 28px; font-weight: bold; color: #1A1A1A; margin: 0 0 8px 0;">
              Get ${COUPON_DISCOUNT} Off
            </h2>
            <p style="font-size: 14px; color: #4A4A4A; margin-bottom: 16px;">
              Use this code at checkout on gutandbeyond.com
            </p>
            <div style="display: inline-block; background-color: #FFFFFF; border: 2px solid #1A1A1A; border-radius: 8px; padding: 12px 28px;">
              <span style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1A1A1A;">
                ${COUPON_CODE}
              </span>
            </div>
            <p style="font-size: 12px; color: #717171; margin-top: 12px;">
              ⏳ Valid until <strong>14 June</strong> only
            </p>
          </div>

          <a href="https://gutandbeyond.com" style="display: block; text-align: center; background-color: #1A1A1A; color: #FFFFFF; text-decoration: none; padding: 14px 24px; border-radius: 8px; font-weight: bold; font-size: 16px; margin-bottom: 24px;">
            Shop Now &amp; Apply Your Code →
          </a>

          <p style="font-size: 14px; color: #717171; line-height: 1.5;">
            If you have any questions about your results or our protocols, please reply directly to this email.
          </p>
          
          <p style="font-size: 14px; color: #717171; margin-top: 32px;">
            In health,<br>
            <strong>The Gut &amp; Beyond Team</strong>
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
