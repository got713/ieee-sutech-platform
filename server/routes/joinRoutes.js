import express from "express";
import Join from "../models/Join.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Create join request (public)
router.post("/", async (req, res) => {
  try {
    const { name, email, department, year } = req.body;
    const request = new Join({ name, email, department, year });
    const savedRequest = await request.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all join requests (admin only)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const requests = await Join.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single join request (admin only)
router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    const request = await Join.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Join request not found" });
    }
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update join request status (admin only)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Join.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!request) {
      return res.status(404).json({ message: "Join request not found" });
    }
    res.json(request);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete join request (admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const request = await Join.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Join request not found" });
    }
    res.json({ message: "Join request deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
