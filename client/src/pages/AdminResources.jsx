import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  BookOpen, FileText, Video, Download, Plus, Edit, Trash2, CheckCircle, 
  Search, Filter, Eye, Clock, Star, ThumbsUp
} from "lucide-react";

const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    fileType: "",
    status: "", // active, inactive, pending
    search: ""
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    fileUrl: "",
    fileType: "article",
    category: "General",
    tags: "",
    author: "",
    publisher: "",
    duration: "",
    level: "Beginner",
    isFeatured: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchResources();
  }, [filters]);

  const fetchResources = async () => {
    try {
      const params = new URLSearchParams({
        ...filters,
        page: 1,
        limit: 50
      }).toString();

      const res = await axios.get(`http://localhost:5000/api/resources/admin/all?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setResources(res.data.resources);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const resourceData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (editingResource) {
        await axios.put(`http://localhost:5000/api/resources/${editingResource._id}`, resourceData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      } else {
        await axios.post("http://localhost:5000/api/resources", resourceData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      }

      setFormData({
        title: "",
        description: "",
        url: "",
        fileUrl: "",
        fileType: "article",
        category: "General",
        tags: "",
        author: "",
        publisher: "",
        duration: "",
        level: "Beginner",
        isFeatured: false
      });
      setShowAddForm(false);
      setEditingResource(null);
      fetchResources();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/resources/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchResources();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/resources/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchResources();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description,
      url: resource.url,
      fileUrl: resource.fileUrl,
      fileType: resource.fileType,
      category: resource.category,
      tags: resource.tags.join(', '),
      author: resource.author,
      publisher: resource.publisher,
      duration: resource.duration,
      level: resource.level,
      isFeatured: resource.isFeatured
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      url: "",
      fileUrl: "",
      fileType: "article",
      category: "General",
      tags: "",
      author: "",
      publisher: "",
      duration: "",
      level: "Beginner",
      isFeatured: false
    });
    setEditingResource(null);
    setShowAddForm(false);
  };

  if (loading) return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-2">Loading Resources Management...</p>
    </div>
  );

  return (
    <div className="container-fluid py-4 px-md-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Resources Management</h2>
          <p className="text-muted">Manage educational content for IEEE SUTECH members</p>
        </div>
        <button 
          className="btn btn-ieee d-flex align-items-center"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={18} className="me-2" /> Add Resource
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="ieee-card p-4 mb-4"
        >
          <h4>{editingResource ? 'Edit Resource' : 'Add New Resource'}</h4>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">File Type</label>
                <select
                  className="form-select"
                  value={formData.fileType}
                  onChange={(e) => setFormData({...formData, fileType: e.target.value})}
                >
                  <option value="article">Article</option>
                  <option value="webinar">Webinar</option>
                  <option value="pdf">PDF</option>
                  <option value="tutorial">Tutorial</option>
                </select>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="General">General</option>
                  <option value="AI">AI</option>
                  <option value="Robotics">Robotics</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Space Tech">Space Tech</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Level</label>
                <select
                  className="form-select"
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Description *</label>
              <textarea
                className="form-control"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              ></textarea>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">File URL (for downloads)</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                />
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Author</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Publisher</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.publisher}
                  onChange={(e) => setFormData({...formData, publisher: e.target.value})}
                />
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., 30 minutes, 2 hours"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., machine learning, neural networks"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                />
              </div>
            </div>
            
            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
              />
              <label className="form-check-label">Mark as Featured</label>
            </div>
            
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingResource ? 'Update' : 'Create'} Resource
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Filters */}
      <div className="ieee-card p-3 glass-panel mb-4">
        <div className="d-flex flex-column flex-md-row gap-3 align-items-start align-items-md-center">
          <div className="input-group flex-grow-1">
            <span className="input-group-text bg-transparent border-0">
              <Search size={20} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-0 shadow-none"
              placeholder="Search resources..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          
          <select 
            className="form-select border-0 shadow-none"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="">All Categories</option>
            <option value="General">General</option>
            <option value="AI">AI</option>
            <option value="Robotics">Robotics</option>
            <option value="Electronics">Electronics</option>
            <option value="Space Tech">Space Tech</option>
          </select>

          <select 
            className="form-select border-0 shadow-none"
            value={filters.fileType}
            onChange={(e) => setFilters({...filters, fileType: e.target.value})}
          >
            <option value="">All Types</option>
            <option value="article">Article</option>
            <option value="webinar">Webinar</option>
            <option value="pdf">PDF</option>
            <option value="tutorial">Tutorial</option>
          </select>

          <select 
            className="form-select border-0 shadow-none"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Resources List */}
      <div className="row g-4">
        {resources.map((resource, index) => (
          <motion.div 
            key={resource._id}
            className="col-lg-4 col-md-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="ieee-card h-100 p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <span className={`badge ${resource.isVerified ? 'bg-success' : 'bg-warning'}`}>
                    {resource.isVerified ? '✓ Approved' : 'Pending'}
                  </span>
                  {resource.isFeatured && (
                    <span className="badge bg-warning ms-2">⭐ Featured</span>
                  )}
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleEdit(resource)}
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(resource._id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-primary">{resource.category}</span>
                <span className="badge bg-secondary">{resource.fileType}</span>
                <span className="badge bg-info">{resource.level}</span>
              </div>
              
              <h5 className="mb-2">{resource.title}</h5>
              <p className="text-muted small mb-3">{resource.description.substring(0, 100)}...</p>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <Star size={14} className="text-warning" />
                  <span className="small">{resource.averageRating.toFixed(1)}</span>
                  <span className="small text-muted">({resource.totalRatings})</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <ThumbsUp size={14} className="text-muted" />
                  <span className="small text-muted">{resource.totalLikes}</span>
                </div>
              </div>
              
              <div className="d-flex align-items-center gap-2 mb-3">
                <Eye size={14} className="text-muted" />
                <span className="small text-muted">{resource.views} views</span>
                <Clock size={14} className="text-muted ms-2" />
                <span className="small text-muted">{resource.duration || 'N/A'}</span>
              </div>
              
              <div className="d-flex gap-2">
                {!resource.isVerified && (
                  <button 
                    className="btn btn-success btn-sm flex-grow-1"
                    onClick={() => handleApprove(resource._id)}
                  >
                    <CheckCircle size={14} className="me-1" /> Approve
                  </button>
                )}
                <button 
                  className="btn btn-outline-info btn-sm flex-grow-1"
                  onClick={() => navigate(`/resources/${resource._id}`)}
                >
                  <Eye size={14} className="me-1" /> View
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminResources;