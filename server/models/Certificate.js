import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  certificateType: { 
    type: String, 
    enum: ["participation", "achievement", "winner", "speaker"], 
    default: "participation" 
  },
  description: { type: String, default: "" },
  backgroundImage: { type: String, default: "" }, // URL for certificate background
  issuedBy: { type: String, default: "IEEE SUTech Student Branch" },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: "Member" }, // Optional link to member
  verificationHash: { type: String, unique: true, sparse: true }, // For QR code verification
}, { timestamps: true });

export default mongoose.model("Certificate", certificateSchema);
