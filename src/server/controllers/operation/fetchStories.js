import supabase from "../../../supabase/index.js";

/**
 * Get all stories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function getAllStories(req, res) {
  try {
    const { data: stories, error } = await supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false }); // optional: latest first

    if (error) {
      return res.status(500).json({ error: `Error fetching stories: ${error.message}` });
    }

    return res.status(200).json({ stories });
  } catch (err) {
    console.error("Error in getAllStories:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
