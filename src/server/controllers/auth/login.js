import supabase from "../../../supabase/index.js";
import jwt from "jsonwebtoken";

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Fetch user
    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (fetchError) {
      return res.status(400).json({ error: fetchError.message });
    }

    if (!users || users.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = users[0];

    // Check if email is verified
    if (!user.isverified) {
      return res.status(403).json({ error: "Please verify your email before logging in" });
    }

    // Check if category is assigned
    if (!user.category) {
      // Fetch schedule details
      const { data: scheduleData, error: scheduleError } = await supabase
        .from("schedule")
        .select("date, time, link")
        .eq("user", user.id)
        .limit(1)
        .single();

      if (scheduleError) {
        return res.status(400).json({ error: "You need to attend a call first. Schedule not found." });
      }

      return res.status(403).json({
        error: "You need to attend the call first before logging in.",
        schedule: {
          date: scheduleData.date,
          time: scheduleData.time,
          link: scheduleData.link
        }
      });
    }

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      message: "Login successful",
      user: user,
      session: authData.session,
      authToken: token
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
