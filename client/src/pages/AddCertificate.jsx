import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";

const AddCertificate = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    studentName: "",
    studentEmail: "",
    eventName: "",
    eventDate: "",
    certificateType: "participation",
    description: "",
    backgroundImage: "",
    issuedBy: "IEEE SUTech Student Branch"
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/certificates", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Certificate issued successfully!");
      navigate("/admin/certificates");
    } catch (err) {
      console.error(err);
      alert("Failed to issue certificate: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <h2>Issue New Certificate 🎓</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Student Name *</label>
            <input
              type="text"
              name="studentName"
              className="form-control"
              value={form.studentName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Student Email *</label>
            <input
              type="email"
              name="studentEmail"
              className="form-control"
              value={form.studentEmail}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Event Name *</label>
          <input
            type="text"
            name="eventName"
            className="form-control"
            placeholder="e.g., AI Workshop 2026"
            value={form.eventName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Event Date *</label>
            <input
              type="date"
              name="eventDate"
              className="form-control"
              value={form.eventDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Certificate Type *</label>
            <select
              name="certificateType"
              className="form-control"
              value={form.certificateType}
              onChange={handleChange}
              required
            >
              <option value="participation">Participation</option>
              <option value="achievement">Achievement</option>
              <option value="winner">Winner</option>
              <option value="speaker">Speaker</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Description (optional)</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            placeholder="Additional notes or achievements..."
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <ImageUpload
            label="Certificate Background Image (Optional)"
            currentImage={form.backgroundImage}
            onUpload={(url) => setForm({...form, backgroundImage: url})}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Issued By</label>
          <input
            type="text"
            name="issuedBy"
            className="form-control"
            value={form.issuedBy}
            onChange={handleChange}
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Issuing..." : "Issue Certificate"}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate("/admin/certificates")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCertificate;
