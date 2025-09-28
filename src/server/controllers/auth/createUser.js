import supabase from "../../../supabase/index.js";

export async function signup(req, res) {
  const { email, password, name, number } = req.body;

  if (!email || !password || !name || !number) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Get auth token from headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check the requesting user's info
    const { data: currentUser, error: userError } = await supabase.auth.getUser(token);
    if (userError || !currentUser?.user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Check if current user is admin in your 'users' table
    const { data: adminData, error: adminError } = await supabase
      .from("users")
      .select("isAdmin")
      .eq("uid", currentUser.user.id)
      .single();

    if (adminError || !adminData?.isAdmin) {
      return res.status(403).json({ error: "Only admins can create users" });
    }

    // Create user in Supabase Auth (skip verification)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // already confirmed
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Insert user info into your custom users table
    const { data: userData, error: userErrorInsert } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          number,
          isverified: true, // mark verified directly
          uid: authData.user.id,
        }
      ])
      .select();

    if (userErrorInsert) {
      return res.status(400).json({ error: userErrorInsert.message });
    }

    return res.status(200).json({
      message: "User created successfully.",
      user: userData[0]
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
