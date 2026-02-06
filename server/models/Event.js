import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  image: { type: String }, // optional URL
  registrationLink: { type: String }, // Optional registration link
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who registered
  maxAttendees: { type: Number, default: 0 }, // Max capacity (0 = unlimited)
  isRegistrationOpen: { type: Boolean, default: true },
  category: { type: String, default: 'general' } // event category
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
