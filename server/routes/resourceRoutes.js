import express from "express";
import Resource from "../models/Resource.js";
import Member from "../models/Member.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes

// Get all active resources with filtering and pagination
router.get("/", async (req, res) => {
  try {
    const { category, fileType, level, search, sortBy, page = 1, limit = 12 } = req.query;
    
    // Build query
    let query = { isActive: true, isVerified: true };
    
    if (category) query.category = category;
    if (fileType) query.fileType = fileType;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const totalCount = await Resource.countDocuments(query);
    
    // Apply sorting and pagination
    const sortOptions = {};
    if (sortBy === 'rating') {
      sortOptions.averageRating = -1;
    } else if (sortBy === 'date') {
      sortOptions.datePublished = -1;
    } else if (sortBy === 'views') {
      sortOptions.views = -1;
    } else {
      sortOptions.datePublished = -1; // Default sort by date
    }

    const resources = await Resource.find(query)
      .populate('uploadedBy', 'name email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      resources,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
      totalCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single resource by ID
router.get("/:id", async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }, // Increment view count
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'name email');

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (!resource.isActive || !resource.isVerified) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like/unlike a resource
router.post("/:id/like", protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const userId = req.user.id;
    const userLiked = resource.likes.some(like => like.toString() === userId);

    if (userLiked) {
      // Unlike
      resource.likes = resource.likes.filter(like => like.toString() !== userId);
      resource.totalLikes -= 1;
    } else {
      // Like
      resource.likes.push(userId);
      resource.totalLikes += 1;
    }

    await resource.save();
    res.json({ 
      message: userLiked ? "Resource unliked" : "Resource liked",
      totalLikes: resource.totalLikes,
      liked: !userLiked
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rate a resource
router.post("/:id/rate", protect, async (req, res) => {
  try {
    const { rating } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const userId = req.user.id;
    
    // In a real implementation, you'd track individual user ratings
    // For simplicity, we'll just update the average
    resource.totalRatings += 1;
    resource.averageRating = ((resource.averageRating * (resource.totalRatings - 1)) + rating) / resource.totalRatings;
    
    await resource.save();
    res.json({ 
      message: "Rating submitted",
      averageRating: resource.averageRating,
      totalRatings: resource.totalRatings
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Download increment
router.post("/:id/download", protect, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json({ message: "Download count incremented", downloads: resource.downloads });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin routes

// Get all resources (admin only)
router.get("/admin/all", protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    
    const totalCount = await Resource.countDocuments({});
    
    const resources = await Resource.find({})
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      resources,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
      totalCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new resource (admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const {
      title, description, url, fileUrl, fileType, category, 
      tags, author, publisher, duration, level, isFeatured
    } = req.body;

    const resource = new Resource({
      title,
      description,
      url,
      fileUrl,
      fileType,
      category,
      tags: tags || [],
      author,
      publisher,
      duration,
      level,
      isFeatured,
      uploadedBy: req.user.id
    });

    const savedResource = await resource.save();
    res.status(201).json(savedResource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update resource (admin only)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json(resource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete resource (admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json({ message: "Resource deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve resource (admin only)
router.put("/:id/approve", protect, adminOnly, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { 
        isVerified: true,
        approvedBy: req.user.id,
        approvedAt: new Date()
      },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json({ message: "Resource approved successfully", resource });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;