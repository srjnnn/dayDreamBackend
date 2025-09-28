import supabase from "../../../supabase/index.js";

export async function resetPassword(req, res) {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: "Email, code, and new password are required" });
  }

  try {
    // Verify OTP
    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("otp", code);

    if (fetchError) return res.status(400).json({ error: fetchError.message });
    if (!users || users.length === 0)
      return res.status(400).json({ error: "Invalid email or code" });

    const user = users[0];

    // Update password in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.updateUserById(user.uid, {
      password: newPassword
    });

    if (authError) return res.status(400).json({ error: authError.message });

    // Clear OTP after successful reset
    await supabase
      .from("users")
      .update({ otp: null })
      .eq("email", email);

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
