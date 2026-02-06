import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";

const EditEvent = () => {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return navigate("/login");

    // Fetch existing event data
    axios.get(`http://localhost:5000/api/events/${id}`)
      .then(res => {
        const event = res.data;
        // Convert date to datetime-local format
        const dateLocal = new Date(event.date).toISOString().slice(0, 16);
        setForm({
          title: event.title,
          description: event.description,
          date: dateLocal,
          location: event.location,
          image: event.image || ""
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Failed to load event data");
        navigate("/admin/events");
      });
  }, [id, token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.put(`http://localhost:5000/api/events/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Event updated successfully!");
      navigate("/admin/events");
    } catch (err) {
      console.error(err);
      alert("Failed to update event: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <p>Loading event data...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2>Edit Event ✏️</h2>
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
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Updating..." : "Update Event"}
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

export default EditEvent;
