import supabase from "../../../supabase/index.js";
import { sendMail } from "../../../utils/mailer.js";
import { generateSixDigitCode } from "../../../utils/randomNumber.js";

export async function requestPasswordReset(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Check if the user exists
    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError || !users) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users;

    // Generate a 6-digit OTP
    const code = generateSixDigitCode();

    // Save OTP in user's record (optionally add expiration)
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ otp: code })
      .eq("email", email)
      .select()
      .single();

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    // Send OTP via styled email
    await sendMail({
      to: email,
      subject: "Mero Sathi - Password Reset Request",
      from: `"Mero Sathi" <${process.env.SMTP_USER}>`,
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background-color: #FF5722; color: #ffffff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Mero Sathi</h1>
          </div>
          <div style="padding: 30px; color: #333333; font-size: 16px; line-height: 1.5;">
            <p>Hi <strong>${user.name}</strong>,</p>
            <p>We received a request to reset your password. Use the verification code below to reset it:</p>
            <p style="text-align: center; margin: 30px 0;">
              <span style="display: inline-block; padding: 15px 25px; font-size: 24px; font-weight: bold; background-color: #f0f0f0; border-radius: 6px; letter-spacing: 4px;">
                ${code}
              </span>
            </p>
            <p>If you did not request a password reset, please ignore this email.</p>
            <p>Best regards,<br>The Mero Sathi Team</p>
          </div>
          <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 12px; color: #777777;">
            &copy; ${new Date().getFullYear()} Mero Sathi. All rights reserved.
          </div>
        </div>
      </div>
      `
    });

    return res.status(200).json({
      message: "Password reset code sent to your email",
      user: updatedUser
    });

  } catch (error) {
    console.error("Password reset request error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
