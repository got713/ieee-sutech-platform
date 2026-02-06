import express from "express";
import Announcement from "../models/Announcement.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all announcements (Public - only published)
router.get("/", async (req, res) => {
  try {
    const { category, priority, search } = req.query;
    
    let query = { isPublished: true };
    
    // Apply filters
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (search) {
      query.$text = { $search: search };
    }
    
    const announcements = await Announcement.find(query)
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single announcement by ID (Public)
router.get("/:id", async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate("author", "name email");
    
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    
    // Increment view count
    announcement.viewCount += 1;
    await announcement.save();
    
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all announcements for admin (includes unpublished)
router.get("/admin/all", protect, adminOnly, async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create announcement (Admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const announcement = new Announcement({
      ...req.body,
      author: req.user.id
    });
    
    const savedAnnouncement = await announcement.save();
    res.status(201).json(savedAnnouncement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update announcement (Admin only)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    
    res.json(announcement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete announcement (Admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    
    res.json({ message: "Announcement deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
