import express from "express";
import Member from "../models/Member.js";
import Event from "../models/Event.js";
import Join from "../models/Join.js";
import Certificate from "../models/Certificate.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Get dashboard statistics (admin only)
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    // Count totals
    const totalMembers = await Member.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalJoinRequests = await Join.countDocuments();
    const totalCertificates = await Certificate.countDocuments();

    // Count by status
    const pendingJoinRequests = await Join.countDocuments({ status: "pending" });
    const approvedJoinRequests = await Join.countDocuments({ status: "approved" });
    const rejectedJoinRequests = await Join.countDocuments({ status: "rejected" });

    // Count members by role
    const adminCount = await Member.countDocuments({ role: "admin" });
    const memberCount = await Member.countDocuments({ role: "member" });

    // Count certificates by type
    const participationCerts = await Certificate.countDocuments({ certificateType: "participation" });
    const achievementCerts = await Certificate.countDocuments({ certificateType: "achievement" });
    const winnerCerts = await Certificate.countDocuments({ certificateType: "winner" });
    const speakerCerts = await Certificate.countDocuments({ certificateType: "speaker" });

    // Get upcoming events
    const upcomingEvents = await Event.countDocuments({ 
      date: { $gte: new Date() } 
    });

    // Get recent activities (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentMembers = await Member.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });
    const recentJoinRequests = await Join.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });
    const recentCertificates = await Certificate.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });

    // Calculate total points across all members
    const membersWithPoints = await Member.find({}, 'points');
    const totalPoints = membersWithPoints.reduce((sum, member) => sum + (member.points || 0), 0);

    res.json({
      overview: {
        totalMembers,
        totalEvents,
        totalJoinRequests,
        totalCertificates,
        upcomingEvents,
        totalPoints
      },
      joinRequests: {
        pending: pendingJoinRequests,
        approved: approvedJoinRequests,
        rejected: rejectedJoinRequests
      },
      members: {
        admins: adminCount,
        members: memberCount
      },
      certificates: {
        participation: participationCerts,
        achievement: achievementCerts,
        winner: winnerCerts,
        speaker: speakerCerts
      },
      recentActivity: {
        newMembers: recentMembers,
        newJoinRequests: recentJoinRequests,
        newCertificates: recentCertificates
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
