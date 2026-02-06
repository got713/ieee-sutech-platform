import express from "express";
import Member from "../models/Member.js";
import Certificate from "../models/Certificate.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public routes

// Get all members (public access for directory)
router.get("/public", async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get member profile with certificates (public)
router.get("/profile/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Get all certificates for this member
    const certificates = await Certificate.find({ memberId: req.params.id })
      .sort({ eventDate: -1 });

    // Calculate statistics
    const stats = {
      totalCertificates: certificates.length,
      participationCerts: certificates.filter(c => c.certificateType === "participation").length,
      achievementCerts: certificates.filter(c => c.certificateType === "achievement").length,
      winnerCerts: certificates.filter(c => c.certificateType === "winner").length,
      speakerCerts: certificates.filter(c => c.certificateType === "speaker").length
    };

    res.json({
      member,
      certificates,
      stats
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Follow a member
router.post("/:id/follow", protect, async (req, res) => {
  try {
    const user = await Member.findById(req.user.id);
    const memberToFollow = await Member.findById(req.params.id);
    
    if (!user || !memberToFollow) {
      return res.status(404).json({ message: "Member not found" });
    }
    
    if (user._id.equals(memberToFollow._id)) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }
    
    // Check if already following
    if (user.following.includes(memberToFollow._id)) {
      return res.status(400).json({ message: "Already following this member" });
    }
    
    // Add to following and followers
    user.following.push(memberToFollow._id);
    memberToFollow.followers.push(user._id);
    
    await user.save();
    await memberToFollow.save();
    
    res.json({ message: "Successfully followed member" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Unfollow a member
router.delete("/:id/unfollow", protect, async (req, res) => {
  try {
    const user = await Member.findById(req.user.id);
    const memberToUnfollow = await Member.findById(req.params.id);
    
    if (!user || !memberToUnfollow) {
      return res.status(404).json({ message: "Member not found" });
    }
    
    // Check if already following
    if (!user.following.includes(memberToUnfollow._id)) {
      return res.status(400).json({ message: "Not following this member" });
    }
    
    // Remove from following and followers
    user.following = user.following.filter(id => !id.equals(memberToUnfollow._id));
    memberToUnfollow.followers = memberToUnfollow.followers.filter(id => !id.equals(user._id));
    
    await user.save();
    await memberToUnfollow.save();
    
    res.json({ message: "Successfully unfollowed member" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send message to a member
router.post("/:id/message", protect, async (req, res) => {
  try {
    const { message } = req.body;
    const sender = await Member.findById(req.user.id);
    const recipient = await Member.findById(req.params.id);
    
    if (!sender || !recipient) {
      return res.status(404).json({ message: "Member not found" });
    }
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: "Message is required" });
    }
    
    if (sender._id.equals(recipient._id)) {
      return res.status(400).json({ message: "You cannot send message to yourself" });
    }
    
    // In a real implementation, you would save this to a Messages collection
    // For now, we'll just return success
    
    res.json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin routes

// Get all members (admin only)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single member (admin only)
router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add member (admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, email, role, points, avatar } = req.body;
    const member = new Member({ name, email, role, points, avatar });
    const savedMember = await member.save();
    res.status(201).json(savedMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update member (admin only)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update own profile
router.put("/profile/update", protect, async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete member (admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
