import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Calendar, Eye, ArrowRight, 
  AlertCircle, Info, Zap, TrendingUp, Clock, User
} from "lucide-react";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/announcements");
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

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(ann =>
        ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ann.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(ann => ann.category === categoryFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(ann => ann.priority === priorityFilter);
    }

    setFilteredAnnouncements(filtered);
  }, [searchTerm, categoryFilter, priorityFilter, announcements]);

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'event': return <Calendar size={18} />;
      case 'news': return <Info size={18} />;
      case 'update': return <TrendingUp size={18} />;
      default: return <Info size={18} />;
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
        return <span className="badge bg-danger rounded-pill px-3 d-flex align-items-center gap-1"><Zap size={14} /> Urgent</span>;
      case 'important':
        return <span className="badge bg-warning text-dark rounded-pill px-3 d-flex align-items-center gap-1"><AlertCircle size={14} /> Important</span>;
      default:
        return null;
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
      <div className="text-center mb-5">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="display-5 mb-2 fw-bold"
        >
          📰 News & Announcements
        </motion.h2>
        <p className="text-muted lead">Stay updated with the latest from IEEE SUTECH</p>
      </div>

      {/* Search & Filters */}
      <div className="row mb-5">
        <div className="col-md-5 mb-3 mb-md-0">
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
        <div className="col-md-3 mb-3 mb-md-0">
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
        <div className="col-md-3">
          <select 
            className="form-select border-0 shadow-sm rounded-pill px-3"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="important">Important</option>
            <option value="normal">Normal</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      <AnimatePresence mode="wait">
        {filteredAnnouncements.length === 0 ? (
          <motion.div 
            key="no-announcements"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-5"
          >
            <Info size={48} className="text-muted mb-3 opacity-25" />
            <p className="text-muted">No announcements found matching your filters.</p>
          </motion.div>
        ) : (
          <div className="row">
            {filteredAnnouncements.map((announcement, index) => (
              <motion.div 
                key={announcement._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="col-lg-6 mb-4"
              >
                <div className="ieee-card h-100 overflow-hidden" style={{ cursor: "pointer" }} onClick={() => navigate(`/announcements/${announcement._id}`)}>
                  {announcement.image && (
                    <div className="position-relative" style={{ height: "200px", overflow: "hidden" }}>
                      <img 
                        src={announcement.image} 
                        className="w-100 h-100 object-fit-cover"
                        alt={announcement.title}
                      />
                      {announcement.priority !== 'normal' && (
                        <div className="position-absolute top-0 end-0 p-3">
                          {getPriorityBadge(announcement.priority)}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className={`badge bg-${getCategoryColor(announcement.category)} rounded-pill px-3 py-2 d-flex align-items-center gap-2`}>
                        {getCategoryIcon(announcement.category)}
                        {announcement.category}
                      </span>
                      {!announcement.image && announcement.priority !== 'normal' && getPriorityBadge(announcement.priority)}
                    </div>
                    
                    <h5 className="fw-bold mb-3">{announcement.title}</h5>
                    
                    <p className="text-muted small mb-3" style={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {announcement.content}
                    </p>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="small text-muted d-flex align-items-center gap-3">
                        <span className="d-flex align-items-center gap-1">
                          <Clock size={14} />
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </span>
                        <span className="d-flex align-items-center gap-1">
                          <Eye size={14} />
                          {announcement.viewCount} views
                        </span>
                        {announcement.author && (
                          <span className="d-flex align-items-center gap-1">
                            <User size={14} />
                            {announcement.author.name}
                          </span>
                        )}
                      </div>
                      <button className="btn btn-link text-primary p-0 d-flex align-items-center gap-1">
                        Read More <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Announcements;
