import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Plus, Edit, Trash2, Eye, EyeOff,
  Calendar, AlertCircle, Info, TrendingUp, Save, X
} from "lucide-react";
import ImageUpload from "../components/ImageUpload";

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState({
    title: "",
    content: "",
    category: "news",
    priority: "normal",
    image: "",
    isPublished: true,
    tags: []
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/announcements/admin/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncements(res.data);
      setFilteredAnnouncements(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = announcements;

    if (searchTerm) {
      filtered = filtered.filter(ann =>
        ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ann.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(ann => ann.category === categoryFilter);
    }

    setFilteredAnnouncements(filtered);
  }, [searchTerm, categoryFilter, announcements]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(
          `http://localhost:5000/api/announcements/${currentAnnouncement._id}`,
          currentAnnouncement,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Announcement updated successfully!");
      } else {
        await axios.post(
          "http://localhost:5000/api/announcements",
          currentAnnouncement,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Announcement created successfully!");
      }
      setShowModal(false);
      resetForm();
      fetchAnnouncements();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/announcements/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Announcement deleted successfully!");
      fetchAnnouncements();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleEdit = (announcement) => {
    setCurrentAnnouncement(announcement);
    setEditMode(true);
    setShowModal(true);
  };

  const togglePublish = async (announcement) => {
    try {
      await axios.put(
        `http://localhost:5000/api/announcements/${announcement._id}`,
        { ...announcement, isPublished: !announcement.isPublished },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAnnouncements();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const resetForm = () => {
    setCurrentAnnouncement({
      title: "",
      content: "",
      category: "news",
      priority: "normal",
      image: "",
      isPublished: true,
      tags: []
    });
    setEditMode(false);
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'event': return 'primary';
      case 'news': return 'info';
      case 'update': return 'success';
      default: return 'secondary';
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'urgent': return <span className="badge bg-danger">Urgent</span>;
      case 'important': return <span className="badge bg-warning text-dark">Important</span>;
      default: return <span className="badge bg-secondary">Normal</span>;
    }
  };

  if (loading) return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-2">Loading Announcements...</p>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Manage Announcements 📰</h2>
          <p className="text-muted">Create and manage news, events, and updates</p>
        </div>
        <button 
          className="btn btn-ieee d-flex align-items-center"
          onClick={() => { resetForm(); setShowModal(true); }}
        >
          <Plus size={18} className="me-1" /> New Announcement
        </button>
      </div>

      {/* Search & Filters */}
      <div className="row mb-4">
        <div className="col-md-7 mb-3 mb-md-0">
          <div className="ieee-card p-2 glass-panel">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-0">
                <Search size={18} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="d-flex align-items-center">
            <Filter size={18} className="text-muted me-2" />
            <select 
              className="form-select border-0 shadow-sm rounded-pill px-3"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="event">Events</option>
              <option value="news">News</option>
              <option value="update">Updates</option>
            </select>
          </div>
        </div>
      </div>

      {/* Announcements Table */}
      <div className="ieee-card p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="bg-light text-muted small text-uppercase">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="py-3">Category</th>
                <th className="py-3">Priority</th>
                <th className="py-3">Status</th>
                <th className="py-3">Views</th>
                <th className="py-3">Date</th>
                <th className="py-3 text-end px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnnouncements.map(ann => (
                <tr key={ann._id}>
                  <td className="px-4 py-3">
                    <div className="fw-bold">{ann.title}</div>
                    <div className="text-muted small text-truncate" style={{ maxWidth: '300px' }}>
                      {ann.content}
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`badge bg-${getCategoryColor(ann.category)} rounded-pill`}>
                      {ann.category}
                    </span>
                  </td>
                  <td className="py-3">{getPriorityBadge(ann.priority)}</td>
                  <td className="py-3">
                    {ann.isPublished ? (
                      <span className="badge bg-success rounded-pill">Published</span>
                    ) : (
                      <span className="badge bg-secondary rounded-pill">Draft</span>
                    )}
                  </td>
                  <td className="py-3">{ann.viewCount}</td>
                  <td className="py-3 small text-muted">
                    {new Date(ann.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-end px-4">
                    <div className="btn-group btn-group-sm">
                      <button 
                        className="btn btn-link text-info"
                        onClick={() => navigate(`/announcements/${ann._id}`)}
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        className="btn btn-link text-primary"
                        onClick={() => handleEdit(ann)}
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="btn btn-link text-warning"
                        onClick={() => togglePublish(ann)}
                        title={ann.isPublished ? "Unpublish" : "Publish"}
                      >
                        {ann.isPublished ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button 
                        className="btn btn-link text-danger"
                        onClick={() => handleDelete(ann._id)}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="text-center py-5">
          <Info size={48} className="text-muted mb-3 opacity-25" />
          <p className="text-muted">No announcements found.</p>
        </div>
      )}

      <div className="mt-4">
        <button className="btn btn-secondary rounded-pill px-4" onClick={() => navigate("/admin")}>
          ← Back to Admin Panel
        </button>
      </div>

      {/* Modal for Create/Edit */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="modal-dialog modal-lg modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content ieee-card">
                <div className="modal-header border-0">
                  <h5 className="modal-title">{editMode ? "Edit Announcement" : "Create New Announcement"}</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={currentAnnouncement.title}
                        onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, title: e.target.value})}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold">Content *</label>
                      <textarea
                        className="form-control"
                        rows="6"
                        value={currentAnnouncement.content}
                        onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, content: e.target.value})}
                        required
                      ></textarea>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label fw-bold">Category *</label>
                        <select
                          className="form-select"
                          value={currentAnnouncement.category}
                          onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, category: e.target.value})}
                        >
                          <option value="news">News</option>
                          <option value="event">Event</option>
                          <option value="update">Update</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-bold">Priority *</label>
                        <select
                          className="form-select"
                          value={currentAnnouncement.priority}
                          onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, priority: e.target.value})}
                        >
                          <option value="normal">Normal</option>
                          <option value="important">Important</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-bold">Status *</label>
                        <select
                          className="form-select"
                          value={currentAnnouncement.isPublished}
                          onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, isPublished: e.target.value === 'true'})}
                        >
                          <option value="true">Published</option>
                          <option value="false">Draft</option>
                        </select>
                      </div>
                    </div>

                    <ImageUpload
                      label="Announcement Image (Optional)"
                      currentImage={currentAnnouncement.image}
                      onUpload={(url) => setCurrentAnnouncement({...currentAnnouncement, image: url})}
                    />

                    <div className="mb-3">
                      <label className="form-label fw-bold">Tags (comma-separated, optional)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., workshop, AI, technology"
                        value={currentAnnouncement.tags?.join(", ") || ""}
                        onChange={(e) => setCurrentAnnouncement({
                          ...currentAnnouncement, 
                          tags: e.target.value.split(",").map(t => t.trim()).filter(t => t)
                        })}
                      />
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={() => setShowModal(false)}>
                      <X size={18} className="me-1" /> Cancel
                    </button>
                    <button type="submit" className="btn btn-ieee rounded-pill px-4 d-flex align-items-center">
                      <Save size={18} className="me-1" /> {editMode ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAnnouncements;
