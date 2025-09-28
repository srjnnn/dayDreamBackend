import supabase from "../../../supabase/index.js";

/**
 * Get all events for a user based on their category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function getUserEvents(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Step 1: Fetch user
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, name, category")
      .eq("email", email)
      .single();

    if (userError) {
      return res.status(500).json({ error: `Error fetching user: ${userError.message}` });
    }

    if (!user.category) {
      return res.status(404).json({ error: "User has no category assigned." });
    }

    // Step 2: Fetch events matching user's category
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .eq("category", user.category);

    if (eventsError) {
      return res.status(500).json({ error: `Error fetching events: ${eventsError.message}` });
    }

    return res.status(200).json({ events });
  } catch (err) {
    console.error("Error in getUserEvents:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
