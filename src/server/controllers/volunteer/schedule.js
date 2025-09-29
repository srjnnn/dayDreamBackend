import supabase from "../../../supabase/index.js";
import { sendMail } from "../../../utils/mailer.js";
import { generateRandomUrl } from "../../../utils/randomURL.js";

/**
 * Automatically schedule a user
 * Expects { userId } in the request body
 */
export async function autoScheduleUser(req, res) {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  // Basic auto scheduling logic
  const today = new Date();
  const date = today.toISOString().split("T")[0]; // YYYY-MM-DD
  const hour = (today.getHours() + 1) % 24;       // next available hour
  const time = `${hour.toString().padStart(2, "0")}:00`; 
  const link = "https://meet.jit.si/" + generateRandomUrl();

  try {
    // Fetch user
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("name, email")
      .eq("id", userId)
      .single();

    if (fetchError || !user) {
      return res.status(400).json({ error: fetchError?.message || "User not found" });
    }

    // Insert schedule
    const { data: schedule, error: scheduleError } = await supabase
      .from("schedule")
      .insert([{ user: userId, date, time, link }])
      .select()
      .maybeSingle();

    if (scheduleError) {
      return res.status(400).json({ error: scheduleError.message });
    }

    // Send email
    await sendMail({
      to: user.email,
      subject: "Your Appointment is Scheduled!",
      from: `"Vexito" <${process.env.Email_USER}>`,
      html: `
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>Your appointment has been scheduled automatically:</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Meeting Link:</strong> <a href="${link}">${link}</a></p>
      `
    });

    return res.status(200).json({
      message: "User scheduled automatically and email sent!",
      schedule
    });
  } catch (err) {
    console.error("Auto-scheduling error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
