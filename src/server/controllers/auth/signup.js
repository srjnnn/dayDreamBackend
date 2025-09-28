import supabase from "../../../supabase/index.js";
import { sendMail } from "../../../utils/mailer.js";
import { generateSixDigitCode } from "../../../utils/randomNumber.js";
import "dotenv/config";

export async function signup(req, res) {   // ✅ function wrapper
  const { email, password, name, age } = req.body;

  if (!email || !password || !name || !age) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const code = generateSixDigitCode();

    const { data: authData, error: authError } = await supabase.admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });  // ✅ now inside function
    }

    const { data: userData, error: userError } = await supabase.admin
      .from("users")
      .insert([{ name, email, otp: code, isverified: false, uid: authData.user.id, age }])
      .select();

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    await sendMail({
      to: email,
      subject: "Verify Your Email",
      from: `"Mero Sathi" <${process.env.EMAIL_USER}>`,
      html: `<p>Your code: ${code}</p>`,
    });

    return res.status(200).json({ message: "Signup successful", user: userData[0] });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: error.message });
  }
}
