import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";

const AddEvent = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    image: "",
    registrationLink: "",
    maxAttendees: 0,
    isRegistrationOpen: true,
    category: "general"
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/events", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Event created successfully!");
      navigate("/admin/events");
    } catch (err) {
      console.error(err);
      alert("Failed to create event: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2>Add New Event ➕</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Event Title *</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description *</label>
          <textarea
            name="description"
            className="form-control"
            rows="4"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Date *</label>
          <input
            type="datetime-local"
            name="date"
            className="form-control"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Location *</label>
          <input
            type="text"
            name="location"
            className="form-control"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <ImageUpload
            label="Event Banner Image (Optional)"
            currentImage={form.image}
            onUpload={(url) => setForm({...form, image: url})}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Registration Link (Optional)</label>
          <input
            type="url"
            name="registrationLink"
            className="form-control"
            placeholder="https://example.com/register"
            value={form.registrationLink}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Max Attendees (0 for unlimited)</label>
          <input
            type="number"
            name="maxAttendees"
            className="form-control"
            value={form.maxAttendees}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            name="category"
            className="form-control"
            value={form.category}
            onChange={handleChange}
          >
            <option value="general">General</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
            <option value="conference">Conference</option>
            <option value="competition">Competition</option>
            <option value="social">Social Event</option>
          </select>
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            name="isRegistrationOpen"
            className="form-check-input"
            checked={form.isRegistrationOpen}
            onChange={(e) => setForm({...form, isRegistrationOpen: e.target.checked})}
          />
          <label className="form-check-label">Registration Open</label>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate("/admin/events")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;
