import supabase from "../../../supabase/index.js";
import { sendMail } from "../../../utils/mailer.js";

/**
 * Fetch users whose category is NULL (uncategorized clients)
 */
export async function getUncategorizedUsers(req, res) {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, name, email, age") // pick only necessary columns
      .is("category", null);          // only users with category = NULL

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Fetched uncategorized users successfully",
      users
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Volunteer schedules a user manually
 * Expects { userId, category, date, time, link } in the request body
 */
export async function scheduleUser(req, res) {
  const { userId, date, time, link } = req.body;

  if (!userId || !date || !time || !link) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Fetch the user details
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("name, email")
      .eq("id", userId)
      .single();

    if (fetchError || !user) {
      return res.status(400).json({ error: fetchError?.message || "User not found" });
    }

    // Insert or update the user's schedule
    const { data: updatedSchedule, error: updateError } = await supabase
      .from("schedule")
      .insert(
        [{
          user: userId, 
          date,
          time,
          link
        }
        ],
      )
      .select()
      .maybeSingle();

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    // Send the scheduling email
    await sendMail({
      to: user.email,
      subject: "Your Appointment is Scheduled!",
      from: `"Mero Sathi" <${process.env.SMTP_USER}>`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
            <div style="background-color: #4CAF50; color: #ffffff; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Mero Sathi</h1>
            </div>
            <div style="padding: 30px; color: #333333; font-size: 16px; line-height: 1.5;">
              <p>Hi <strong>${user.name}</strong>,</p>
              <p>Your appointment has been scheduled by our volunteer:</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${time}</p>
              <p><strong>Meeting Link:</strong> <a href="${link}" target="_blank">${link}</a></p>
              <p>We look forward to seeing you then!</p>
            </div>
            <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 12px; color: #777777;">
              &copy; ${new Date().getFullYear()} Mero Sathi. All rights reserved.
            </div>
          </div>
        </div>
      `
    });

    return res.status(200).json({
      message: "User scheduled successfully and email sent!",
      schedule: updatedSchedule
    });
  } catch (error) {
    console.error("Scheduling error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
