import express from "express";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all events (public)
router.get("/", async (req, res) => {
  try {
    const { category, dateFrom, dateTo, search } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }
    
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }
    
    const events = await Event.find(query).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single event by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new event (admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update event (admin only)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE event (admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register for event
router.post("/:id/register", protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (!event.isRegistrationOpen) return res.status(400).json({ message: "Registration is closed" });
    if (event.maxAttendees > 0 && event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ message: "Event is full" });
    }
    
    // Check if user already registered
    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ message: "Already registered" });
    }
    
    event.attendees.push(req.user.id);
    await event.save();
    
    res.json({ message: "Successfully registered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unregister from event
router.delete("/:id/unregister", protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    
    event.attendees = event.attendees.filter(attendee => attendee.toString() !== req.user.id);
    await event.save();
    
    res.json({ message: "Successfully unregistered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's registered events
router.get("/my-events", protect, async (req, res) => {
  try {
    const events = await Event.find({ attendees: req.user.id }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
