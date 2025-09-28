import supabase from "../../../supabase/index.js";
import { sendMail } from "../../../utils/mailer.js";
import { generateSixDigitCode } from "../../../utils/randomNumber.js";
import "dotenv/config";

export async function signup(req, res) {
  const { email, password, name,age } = req.body;
    console.log("got body ",req.body);
  if (!email || !password || !name || !age ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Generate a random 6-digit code
    const code = generateSixDigitCode();

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // not confirmed yet
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Insert user info into your custom users table with OTP
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          otp: code,
          isverified: false,
          uid: authData.user.id,
          age

        }
      ])
      .select();

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    // Send OTP email (styled HTML)
    await sendMail({
      to: email,
      subject: "Welcome to Mero Sathi - Verify Your Email",
      from: "vexito.nepal@gmail.com",
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background-color: #4CAF50; color: #ffffff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Vexito</h1>
          </div>
          <div style="padding: 30px; color: #333333; font-size: 16px; line-height: 1.5;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Thank you for signing up! To complete your registration, please use the verification code below:</p>
            <p style="text-align: center; margin: 30px 0;">
              <span style="display: inline-block; padding: 15px 25px; font-size: 24px; font-weight: bold; background-color: #f0f0f0; border-radius: 6px; letter-spacing: 4px;">
                ${code}
              </span>
            </p>
            <p>If you did not sign up for this account, please ignore this email.</p>
            <p>Best regards,<br>The Vexito Team</p>
          </div>
          <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 12px; color: #777777;">
            &copy; ${new Date().getFullYear()} Vexito. All rights reserved.
          </div>
        </div>
      </div>
      `
    });

    return res.status(200).json({
      message: "Signup successful. Check your email for the verification code.",
      user: userData[0]
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
