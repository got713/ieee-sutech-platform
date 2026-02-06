import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Calendar, Eye, User, Clock, 
  AlertCircle, Info, Zap, TrendingUp, Tag
} from "lucide-react";

const AnnouncementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnnouncement();
  }, [id]);

  const fetchAnnouncement = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/announcements/${id}`);
      setAnnouncement(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load announcement");
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'event': return <Calendar size={20} />;
      case 'news': return <Info size={20} />;
      case 'update': return <TrendingUp size={20} />;
      default: return <Info size={20} />;
    }
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
      case 'urgent':
        return <span className="badge bg-danger rounded-pill px-3 py-2 d-flex align-items-center gap-2"><Zap size={16} /> Urgent</span>;
      case 'important':
        return <span className="badge bg-warning text-dark rounded-pill px-3 py-2 d-flex align-items-center gap-2"><AlertCircle size={16} /> Important</span>;
      default:
        return <span className="badge bg-secondary rounded-pill px-3 py-2">Normal</span>;
    }
  };

  if (loading) return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-2">Loading Announcement...</p>
    </div>
  );

  if (error || !announcement) return (
    <div className="container mt-5 text-center">
      <div className="alert alert-danger">{error || "Announcement not found"}</div>
      <button className="btn btn-ieee rounded-pill px-4" onClick={() => navigate("/announcements")}>
        Back to Announcements
      </button>
    </div>
  );

  return (
    <div className="container py-5">
      <button 
        className="btn btn-link text-muted d-flex align-items-center p-0 mb-4 text-decoration-none" 
        onClick={() => navigate("/announcements")}
      >
        <ArrowLeft size={18} className="me-1" /> Back to Announcements
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="row"
      >
        <div className="col-lg-8 mx-auto">
          <div className="ieee-card p-0 overflow-hidden">
            {/* Header Image */}
            {announcement.image && (
              <div className="position-relative" style={{ height: "400px", overflow: "hidden" }}>
                <img 
                  src={announcement.image} 
                  className="w-100 h-100 object-fit-cover"
                  alt={announcement.title}
                />
                <div className="position-absolute top-0 end-0 p-4">
                  {getPriorityBadge(announcement.priority)}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-5">
              {/* Meta Info */}
              <div className="d-flex flex-wrap gap-3 mb-4">
                <span className={`badge bg-${getCategoryColor(announcement.category)} rounded-pill px-3 py-2 d-flex align-items-center gap-2`}>
                  {getCategoryIcon(announcement.category)}
                  {announcement.category}
                </span>
                {!announcement.image && getPriorityBadge(announcement.priority)}
              </div>

              {/* Title */}
              <h1 className="display-5 fw-bold mb-4">{announcement.title}</h1>

              {/* Author & Date */}
              <div className="d-flex flex-wrap gap-4 mb-4 pb-4 border-bottom">
                {announcement.author && (
                  <div className="d-flex align-items-center gap-2 text-muted">
                    <User size={18} />
                    <span className="fw-bold">{announcement.author.name}</span>
                  </div>
                )}
                <div className="d-flex align-items-center gap-2 text-muted">
                  <Clock size={18} />
                  <span>{new Date(announcement.createdAt).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted">
                  <Eye size={18} />
                  <span>{announcement.viewCount} views</span>
                </div>
              </div>

              {/* Content */}
              <div className="announcement-content" style={{ lineHeight: '1.8' }}>
                <p className="fs-5 text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                  {announcement.content}
                </p>
              </div>

              {/* Tags */}
              {announcement.tags && announcement.tags.length > 0 && (
                <div className="mt-5 pt-4 border-top">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <Tag size={18} className="text-muted" />
                    <span className="fw-bold text-muted">Tags:</span>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {announcement.tags.map((tag, index) => (
                      <span key={index} className="badge bg-light text-dark px-3 py-2">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Actions */}
          <div className="mt-4 d-flex gap-3">
            <button 
              className="btn btn-ieee rounded-pill px-4"
              onClick={() => navigate("/announcements")}
            >
              View All Announcements
            </button>
            {announcement.category === 'event' && (
              <button 
                className="btn btn-accent rounded-pill px-4 text-white"
                onClick={() => navigate("/events")}
              >
                Browse Events
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnnouncementDetail;
