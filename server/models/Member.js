import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["member", "admin"], default: "member" },
  points: { type: Number, default: 0 },
  avatar: { type: String, default: "" },
  
  // Professional profile fields
  bio: { type: String, default: "" },
  department: { type: String, default: "" },
  academicYear: { type: String, default: "" },
  
  // External links
  linkedin: { type: String, default: "" },
  github: { type: String, default: "" },
  website: { type: String, default: "" },
  
  // Publications and projects
  publications: [{
    title: String,
    description: String,
    link: String,
    date: Date
  }],
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    link: String,
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ["ongoing", "completed", "paused"], default: "ongoing" }
  }],
  research: [{
    title: String,
    description: String,
    collaborators: [String],
    status: String,
    date: Date
  }],
  
  // Following system
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  
  // Notification settings
  notificationsEnabled: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Member", memberSchema);
