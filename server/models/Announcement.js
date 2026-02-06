import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["event", "news", "update"],
    default: "news"
  },
  priority: {
    type: String,
    enum: ["normal", "important", "urgent"],
    default: "normal"
  },
  image: {
    type: String,
    default: ""
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }]
}, { 
  timestamps: true 
});

// Index for better search performance
announcementSchema.index({ title: "text", content: "text", tags: "text" });

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
