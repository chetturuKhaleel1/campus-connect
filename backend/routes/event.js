import express from "express";
import Event from "../models/Event.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// ================== GET ALL EVENTS ==================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "_id student_name")
      .sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error("Fetch events error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ================== CREATE EVENT ==================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, date, location, joinLink } = req.body;

    const event = new Event({
      title,
      description,
      date,
      location,
      joinLink: joinLink || "https://forms.gle/default-google-form", // fallback
      createdBy: req.user.id,
    });

    await event.save();
    res.status(201).json({ success: true, event });
  } catch (err) {
    console.error("Create event error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ================== TOGGLE INTEREST ==================
router.post("/interest/:eventId", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const userId = req.user.id;

    if (event.interestedUsers.map(id => id.toString()).includes(userId)) {
      event.interestedUsers = event.interestedUsers.filter(id => id.toString() !== userId);
    } else {
      event.interestedUsers.push(userId);
    }

    await event.save();
    res.json({ success: true, event });
  } catch (err) {
    console.error("Toggle interest error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ================== UPDATE EVENT ==================
router.put("/:eventId", authMiddleware, async (req, res) => {
  try {
    const { title, description, date, location, joinLink } = req.body;
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Debug who owns the event
    console.log("Event createdBy:", event.createdBy.toString());
    console.log("User id from token:", req.user.id);

    if (event.createdBy.toString() !== String(req.user.id)) {
      return res.status(403).json({ message: "You are not allowed to edit this event" });
    }

    // Update fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (location) event.location = location;
    if (joinLink) event.joinLink = joinLink;

    await event.save();
    res.json({ success: true, event });
  } catch (err) {
    console.error("Update event error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ================== DELETE EVENT ==================
router.delete("/:eventId", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Debugging
    console.log("Event createdBy:", event.createdBy.toString());
    console.log("User id from token:", req.user.id);

    if (event.createdBy.toString() !== String(req.user.id)) {
      return res.status(403).json({ message: "You are not allowed to delete this event" });
    }

    await event.deleteOne(); // ✅ safer than remove()
    res.json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    console.error("Delete event error:", err);
    res.status(500).json({ message: err.message });
  }
});


// ================== GET MY EVENTS ==================
// ================== GET MY EVENTS ==================
router.get("/my-events", authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.id })
      .populate("createdBy", "student_name name")
      .lean(); // lean already returns plain objects

    const eventsWithCounts = events.map(event => ({
      ...event,
      interestedCount: event.interestedUsers ? event.interestedUsers.length : 0,
    }));

    res.json(eventsWithCounts);
  } catch (err) {
    console.error("Error fetching my events:", err);
    res.status(500).json({ message: err.message });
  }
});



export default router;
