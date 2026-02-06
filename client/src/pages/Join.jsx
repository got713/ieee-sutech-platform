import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Join = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    year: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://localhost:5000/api/joins", form);
      setMessage("✅ Request submitted successfully! We'll review it soon.");
      setForm({ name: "", email: "", department: "", year: "" });
    } catch (err) {
      console.error(err);
      setMessage("❌ Error submitting request: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2>Join IEEE SUTech Student Branch 📝</h2>
      <p className="text-muted">Fill out the form below to request membership</p>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email *</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="your.email@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Department *</label>
          <input
            type="text"
            name="department"
            className="form-control"
            placeholder="e.g., Computer Science"
            value={form.department}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Academic Year *</label>
          <select
            name="year"
            className="form-control"
            value={form.year}
            onChange={handleChange}
            required
          >
            <option value="">Select your year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="Graduate">Graduate</option>
          </select>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </form>

      {message && (
        <div className={`alert ${message.includes("✅") ? "alert-success" : "alert-danger"} mt-3`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Join;
