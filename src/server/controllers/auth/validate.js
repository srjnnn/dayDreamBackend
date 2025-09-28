import supabase from "../../../supabase/index.js";

export async function verifyOtp(req, res) {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email and code are required" });
  }

  try {
    // Fetch user with the given email and OTP
    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("otp", code);

    if (fetchError) {
      return res.status(400).json({ error: fetchError.message });
    }

    if (!users || users.length === 0) {
      return res.status(400).json({ error: "Invalid email or code" });
    }

    const user = users[0];

    // Update the isverified column to true
    const { data: updatedUsers, error: updateError } = await supabase
      .from("users")
      .update({ isverified: true })
      .eq("email", email)
      .eq("otp", code)
      .select();

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    return res.status(200).json({
      message: "Email verified successfully!",
      user: updatedUsers[0]
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
