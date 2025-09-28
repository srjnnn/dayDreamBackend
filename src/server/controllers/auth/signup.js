try {
  const code = generateSixDigitCode();

  // 1️⃣ Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authError) {
    console.error("Supabase createUser error:", authError);
    return res.status(400).json({ error: authError.message });
  }

  // 2️⃣ Insert user info into users table
  const { data: userData, error: userError } = await supabase
    .from("users")
    .insert([{ name, email, otp: code, isverified: false, uid: authData.user.id, age }])
    .select();
  if (userError) {
    console.error("Supabase insert user error:", userError);
    return res.status(400).json({ error: userError.message });
  }

  // 3️⃣ Send email
  try {
    await sendMail({
      to: email,
      subject: "Welcome to Mero Sathi - Verify Your Email",
      from: `"Mero Sathi" <${process.env.EMAIL_USER}>`,
      html: `<p>Your code: ${code}</p>`,
    });
  } catch (mailError) {
    console.error("SendMail error:", mailError);
    return res.status(500).json({ error: "Failed to send email" });
  }

  return res.status(200).json({
    message: "Signup successful. Check your email for the verification code.",
    user: userData[0],
  });

} catch (error) {
  console.error("Unhandled signup error:", error);
  return res.status(500).json({ error: error.message, stack: error.stack });
}
