import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String }, // URL for online resources
  fileUrl: { type: String }, // URL for downloadable files
  fileType: { type: String, enum: ['article', 'webinar', 'pdf', 'tutorial'], default: 'article' },
  category: { 
    type: String, 
    enum: ['AI', 'Robotics', 'Electronics', 'Space Tech', 'General'], 
    default: 'General' 
  },
  tags: [{ type: String }], // Additional tags for search
  author: { type: String, default: 'IEEE SUTECH' }, // Author name
  publisher: { type: String, default: 'IEEE SUTECH' }, // Publishing organization
  datePublished: { type: Date, default: Date.now },
  duration: { type: String }, // Duration for webinars/tutorials
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  
  // Rating and likes system
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
  totalLikes: { type: Number, default: 0 },
  
  // Views and downloads tracking
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  
  // Status and moderation
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: true }, // Verified by admin
  
  // Creator and metadata
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  approvedAt: { type: Date },
  
}, { timestamps: true });

export default mongoose.model("Resource", resourceSchema);