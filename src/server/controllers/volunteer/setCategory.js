import supabase from "../../../supabase/index.js";
// import { sendMail } from "../../../utils/mailer.js"; // Not needed for this function

/**
 * Volunteer sets the category for a user
 * Expects { userId, category } in the request body
 */
export async function setCategory(req, res) {
  const { userId, category } = req.body;

  // 1. Validate required fields
  if (!userId || !category) {
    return res.status(400).json({ error: "userId and category are required" });
  }

  try {
    // 2. Update the user's category in the 'users' table
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ category: category })
      .eq("id", userId) // Match the user by ID
      .select("id, name, category") // Select the updated columns to return
      .single(); // Expect a single updated record

    if (updateError) {
      // Handle Supabase-specific errors (e.g., foreign key violation, table constraint)
      console.error("Supabase update error:", updateError);
      return res.status(400).json({ error: updateError.message });
    }

    if (!updatedUser) {
        // This case should ideally not happen if the ID exists and the update went through,
        // but is a good safeguard against missing records.
        return res.status(404).json({ error: "User not found or nothing was updated" });
    }

    // 3. Success response
    return res.status(200).json({
      message: `Category for user ${userId} set successfully to '${category}'`,
      user: updatedUser,
    });
  } catch (err) {
    // 4. General server error handling
    console.error("Error setting user category:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}