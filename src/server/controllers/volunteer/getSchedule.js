import supabase from "../../../supabase/index.js";

/**
 * Fetch all scheduled users with their schedule details
 */
export async function getScheduledUsers(req, res) {
  try {
    // Join schedule with users to get user info along with schedule
    const { data: schedules, error } = await supabase
      .from("schedule")
      .select(`
        id,
        date,
        time,
        link,
        user (
          id,
          name,
          email,
          age,
          category
        )
      `);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Fetched scheduled users successfully",
      schedules
    });
  } catch (err) {
    console.error("Error fetching schedules:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
