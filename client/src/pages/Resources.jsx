import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  BookOpen, FileText, Video, Download, Star, ThumbsUp, Clock, 
  Filter, Search, ChevronDown, ChevronUp, ExternalLink, Eye,
  Book, Code, Zap, Cpu, Satellite, Wrench
} from "lucide-react";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    fileType: "",
    level: "",
    search: ""
  });
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedResource, setExpandedResource] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchResources();
  }, [filters, sortBy, currentPage]);

  const fetchResources = async () => {
    try {
      const params = new URLSearchParams({
        ...filters,
        sortBy,
        page: currentPage,
        limit: 12
      }).toString();

      const res = await axios.get(`http://localhost:5000/api/resources?${params}`);
      setResources(res.data.resources);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'AI': return <Cpu size={16} />;
      case 'Robotics': return <Wrench size={16} />;
      case 'Electronics': return <Zap size={16} />;
      case 'Space Tech': return <Satellite size={16} />;
      default: return <Book size={16} />;
    }
  };

  const getFileTypeIcon = (fileType) => {
    switch(fileType) {
      case 'article': return <FileText size={16} />;
      case 'webinar': return <Video size={16} />;
      case 'pdf': return <FileText size={16} />;
      case 'tutorial': return <BookOpen size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const handleLike = async (resourceId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to like resources");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/resources/${resourceId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setResources(prev => prev.map(res => 
        res._id === resourceId 
          ? { ...res, totalLikes: res.totalLikes + (res.likes.some(l => l === JSON.parse(atob(token.split('.')[1])).id) ? -1 : 1) } 
          : res
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async (resource) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to download resources");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/resources/${resource._id}/download`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (resource.fileUrl) {
        window.open(resource.fileUrl, '_blank');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRate = async (resourceId, rating) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to rate resources");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/resources/${resource._id}/rate`, {
        rating
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setResources(prev => prev.map(res => 
        res._id === resourceId 
          ? { ...res, averageRating: res.averageRating, totalRatings: res.totalRatings + 1 } 
          : res
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ['AI', 'Robotics', 'Electronics', 'Space Tech', 'General'];
  const fileTypes = ['article', 'webinar', 'pdf', 'tutorial'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  if (loading) return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-2">Loading Resources Library...</p>
    </div>
  );

  return (
    <div className="container py-5">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-5"
      >
        <h2 className="display-5 mb-3">
          <BookOpen className="me-3 text-primary" size={48} />
          IEEE SUTECH Knowledge Hub
        </h2>
        <p className="text-muted lead">Discover educational resources, tutorials, and research materials</p>
      </motion.div>

      {/* Filters and Search Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="ieee-card p-3 glass-panel mb-4"
      >
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
          
          <button 
            className="btn btn-outline-ieee d-md-none w-100"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} className="me-2" />
            Filters {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {/* Advanced Filters - Collapsible on mobile */}
        <div className={`${showFilters ? 'd-block' : 'd-none d-md-flex'} mt-3 gap-3 flex-wrap`}>
          <select 
            className="form-select border-0 shadow-none"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select 
            className="form-select border-0 shadow-none"
            value={filters.fileType}
            onChange={(e) => setFilters({...filters, fileType: e.target.value})}
          >
            <option value="">All Types</option>
            {fileTypes.map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>

          <select 
            className="form-select border-0 shadow-none"
            value={filters.level}
            onChange={(e) => setFilters({...filters, level: e.target.value})}
          >
            <option value="">All Levels</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          <select 
            className="form-select border-0 shadow-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Newest First</option>
            <option value="rating">Highest Rated</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>
      </motion.div>

      {/* Featured Resources */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-5"
      >
        <h4 className="mb-4 d-flex align-items-center">
          <Star className="me-2 text-warning" size={24} />
          Featured Resources
        </h4>
        <div className="row g-4">
          {resources
            .filter(r => r.isFeatured)
            .slice(0, 4)
            .map((resource, index) => (
              <motion.div 
                key={resource._id}
                className="col-lg-3 col-md-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="ieee-card h-100 p-4 border-start border-4 border-warning">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-2">
                      {getCategoryIcon(resource.category)}
                      <span className="badge bg-warning text-dark">{resource.category}</span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <ThumbsUp size={14} className="text-muted" />
                      <span className="small text-muted">{resource.totalLikes}</span>
                    </div>
                  </div>
                  
                  <h5 className="mb-2">{resource.title}</h5>
                  <p className="text-muted small mb-3">{resource.description.substring(0, 100)}...</p>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-primary">{resource.level}</span>
                    <div className="d-flex align-items-center gap-1">
                      <Star size={14} className="text-warning" />
                      <span className="small">{resource.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <button 
                    className="btn btn-warning btn-sm w-100 mt-3"
                    onClick={() => {
                      if (resource.fileUrl) {
                        window.open(resource.fileUrl, '_blank');
                      } else if (resource.url) {
                        window.open(resource.url, '_blank');
                      }
                    }}
                  >
                    {resource.fileType === 'pdf' ? <Download size={14} className="me-1" /> : <ExternalLink size={14} className="me-1" />}
                    {resource.fileType === 'pdf' ? 'Download' : 'View'}
                  </button>
                </div>
              </motion.div>
            ))
          }
        </div>
      </motion.div>

      {/* All Resources */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>All Resources</h4>
          <div className="text-muted">
            Showing {resources.length} of {totalPages * 12} resources
          </div>
        </div>

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
                  <div className="d-flex align-items-center gap-2">
                    {getCategoryIcon(resource.category)}
                    <span className="badge bg-primary">{resource.category}</span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <Eye size={14} className="text-muted" />
                    <span className="small text-muted">{resource.views}</span>
                  </div>
                </div>
                
                <div className="d-flex align-items-center gap-2 mb-2">
                  {getFileTypeIcon(resource.fileType)}
                  <span className="badge bg-secondary">{resource.fileType}</span>
                  <span className="badge bg-info">{resource.level}</span>
                </div>
                
                <h5 className="mb-2">{resource.title}</h5>
                <p className="text-muted small mb-3">{resource.description.substring(0, 120)}...</p>
                
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
                
                {resource.duration && (
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <Clock size={14} className="text-muted" />
                    <span className="small text-muted">{resource.duration}</span>
                  </div>
                )}
                
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-ieee btn-sm flex-grow-1"
                    onClick={() => setExpandedResource(expandedResource === resource._id ? null : resource._id)}
                  >
                    {expandedResource === resource._id ? 'Show Less' : 'Details'}
                  </button>
                  {resource.fileType === 'pdf' ? (
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleDownload(resource)}
                    >
                      <Download size={14} />
                    </button>
                  ) : (
                    <button 
                      className="btn btn-success btn-sm"
                      onClick={() => {
                        if (resource.fileUrl) {
                          window.open(resource.fileUrl, '_blank');
                        } else if (resource.url) {
                          window.open(resource.url, '_blank');
                        }
                      }}
                    >
                      <ExternalLink size={14} />
                    </button>
                  )}
                </div>
                
                {expandedResource === resource._id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 pt-3 border-top"
                  >
                    <p className="mb-2"><strong>Author:</strong> {resource.author}</p>
                    <p className="mb-2"><strong>Published:</strong> {new Date(resource.datePublished).toLocaleDateString()}</p>
                    {resource.tags && resource.tags.length > 0 && (
                      <div className="mb-2">
                        <strong>Tags:</strong> {resource.tags.join(', ')}
                      </div>
                    )}
                    <button 
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={() => handleLike(resource._id)}
                    >
                      <ThumbsUp size={14} className="me-1" />
                      Like ({resource.totalLikes})
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <nav className="mt-5">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>Previous</button>
            </li>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(pageNum)}>{pageNum}</button>
                </li>
              );
            })}
            
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}>Next</button>
            </li>
          </ul>
        </nav>
      </motion.div>
    </div>
  );
};

export default Resources;