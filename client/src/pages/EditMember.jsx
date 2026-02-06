import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";

const EditMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "member",
    points: 0,
    avatar: ""
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return navigate("/login");

    // Fetch existing member data
    axios.get(`http://localhost:5000/api/members/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const member = res.data;
        setForm({
          name: member.name,
          email: member.email,
          role: member.role,
          points: member.points,
          avatar: member.avatar || ""
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Failed to load member data");
        navigate("/admin/members");
      });
  }, [id, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "points" ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.put(`http://localhost:5000/api/members/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Member updated successfully!");
      navigate("/admin/members");
    } catch (err) {
      console.error(err);
      alert("Failed to update member: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <p>Loading member data...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2>Edit Member ✏️</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Name *</label>
          <input
            type="text"
            name="name"
            className="form-control"
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
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Role *</label>
          <select
            name="role"
            className="form-control"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Points</label>
          <input
            type="number"
            name="points"
            className="form-control"
            value={form.points}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="mb-3">
          <ImageUpload
            label="Member Avatar (Optional)"
            currentImage={form.avatar}
            onUpload={(url) => setForm({...form, avatar: url})}
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Updating..." : "Update Member"}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate("/admin/members")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMember;
