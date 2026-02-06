import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  Award, Calendar, Mail, User, Shield, Star, 
  ArrowLeft, Download, Eye, ExternalLink, Trophy, Medal, Mic,
  Briefcase, GraduationCap, Link, Github, Linkedin, Globe, 
  Code, BookOpen, Users as UsersIcon, MessageCircle,
  Clock, MapPin, Building
} from "lucide-react";

const MemberProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Get current user info
        let currentUserId = null;
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            currentUserId = payload.id;
          } catch (e) {
            console.error("Error decoding token:", e);
          }
        }
        
        const res = await axios.get(`http://localhost:5000/api/members/profile/${id}`);
        setData(res.data);
        
        // Check if current user is following this member
        if (currentUserId && res.data.member.followers) {
          setIsFollowing(res.data.member.followers.includes(currentUserId));
        }
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load member profile");
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [id]);

  const getCertIcon = (type) => {
    switch(type) {
      case 'winner': return <Trophy size={20} className="text-warning" />;
      case 'achievement': return <Medal size={20} className="text-info" />;
      case 'speaker': return <Mic size={20} className="text-success" />;
      case 'participation': return <Star size={20} className="text-secondary" />;
      default: return <Award size={20} className="text-primary" />;
    }
  };

  const getCertGradient = (type) => {
    const gradients = {
      winner: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
      achievement: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
      speaker: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
      participation: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)"
    };
    return gradients[type] || gradients.participation;
  };

  const getRankBadge = (points) => {
    if (points >= 500) return { name: "🏆 Platinum Scholar", color: "bg-gradient-to-r from-purple-500 to-pink-500" };
    if (points >= 300) return { name: "🥇 Gold Scholar", color: "bg-gradient-to-r from-yellow-500 to-orange-500" };
    if (points >= 200) return { name: "🥈 Silver Scholar", color: "bg-gradient-to-r from-gray-400 to-gray-600" };
    if (points >= 100) return { name: "🥉 Bronze Scholar", color: "bg-gradient-to-r from-amber-600 to-amber-800" };
    return { name: "⭐ Rising Star", color: "bg-gradient-to-r from-blue-500 to-cyan-500" };
  };

  const getTopAchievements = (certificates) => {
    const sortedCerts = [...certificates].sort((a, b) => {
      if (a.certificateType === 'winner' && b.certificateType !== 'winner') return -1;
      if (b.certificateType === 'winner' && a.certificateType !== 'winner') return 1;
      if (a.certificateType === 'achievement' && b.certificateType !== 'achievement') return -1;
      if (b.certificateType === 'achievement' && a.certificateType !== 'achievement') return 1;
      return new Date(b.eventDate) - new Date(a.eventDate);
    });
    return sortedCerts.slice(0, 3);
  };

  if (loading) return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-2">Loading Member Profile...</p>
    </div>
  );

  if (error || !data) return (
    <div className="container mt-5 text-center">
      <div className="alert alert-danger">{error || "Profile not found"}</div>
      <button className="btn btn-ieee rounded-pill px-4" onClick={() => navigate("/members")}>
        Back to Directory
      </button>
    </div>
  );

  const { member, certificates, stats } = data;
  const maxPoints = 1000; // Example cap for progress bar
  const progressPercent = Math.min((member.points / maxPoints) * 100, 100);
  
  const handleFollowToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to follow members");
      return;
    }
    
    try {
      if (isFollowing) {
        await axios.delete(`http://localhost:5000/api/members/${id}/unfollow`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:5000/api/members/${id}/follow`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsFollowing(!isFollowing);
      // Reload data to update follower count
      axios.get(`http://localhost:5000/api/members/profile/${id}`)
        .then(res => setData(res.data));
    } catch (err) {
      console.error(err);
      alert("Failed to update follow status");
    }
  };
  
  const handleSendMessage = async () => {
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to send messages");
      return;
    }
    
    try {
      await axios.post(`http://localhost:5000/api/members/${id}/message`, {
        message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Message sent successfully!");
      setMessage("");
      setShowSendMessage(false);
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  };

  return (
    <div className="container py-5">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="row mb-5"
      >
        <div className="col-12 mb-4">
          <button className="btn btn-link text-muted d-flex align-items-center p-0 mb-3 text-decoration-none" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} className="me-1" /> Back
          </button>
        </div>

        <div className="col-md-4">
          <div className="ieee-card p-4 text-center h-100">
            <div className="mb-4">
              {member.avatar ? (
                <img 
                  src={member.avatar} 
                  alt={member.name}
                  className="rounded-circle border border-5 border-light shadow-sm"
                  style={{ width: "180px", height: "180px", objectFit: "cover" }}
                />
              ) : (
                <div 
                  className="rounded-circle bg-ieee-gradient d-flex align-items-center justify-content-center mx-auto shadow-sm"
                  style={{ width: "180px", height: "180px" }}
                >
                  <h1 className="text-white display-3 mb-0">{member.name.charAt(0).toUpperCase()}</h1>
                </div>
              )}
            </div>
            <h3 className="mb-1">{member.name}</h3>
            <p className="text-muted mb-3 d-flex align-items-center justify-content-center">
              <Mail size={14} className="me-2" /> {member.email}
            </p>
            <div className="mb-3">
              <span className={`badge ${member.role === 'admin' ? 'bg-danger' : 'bg-primary'} rounded-pill px-4 py-2`}>
                {member.role === 'admin' ? '👑 Senior Admin' : 'Active Member'}
              </span>
            </div>
            
            {/* Social Links */}
            <div className="mb-3">
              <div className="d-flex justify-content-center gap-2">
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm rounded-circle p-2">
                    <Linkedin size={16} />
                  </a>
                )}
                {member.github && (
                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm rounded-circle p-2">
                    <Github size={16} />
                  </a>
                )}
                {member.website && (
                  <a href={member.website} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm rounded-circle p-2">
                    <Globe size={16} />
                  </a>
                )}
              </div>
            </div>
            
            {/* Follow and Message Actions */}
            <div className="d-flex gap-2 mb-3">
              <button 
                className={`btn ${isFollowing ? 'btn-danger' : 'btn-outline-primary'} btn-sm flex-grow-1 rounded-pill`}
                onClick={handleFollowToggle}
              >
                {isFollowing ? ' unfollow' : ' follow'}
              </button>
              <button 
                className="btn btn-outline-info btn-sm rounded-circle"
                onClick={() => setShowSendMessage(true)}
              >
                <MessageCircle size={16} />
              </button>
            </div>
            
            {/* Send Message Modal */}
            {showSendMessage && (
              <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Send Message to {member.name}</h5>
                      <button type="button" className="btn-close" onClick={() => setShowSendMessage(false)}></button>
                    </div>
                    <div className="modal-body">
                      <textarea 
                        className="form-control"
                        rows="4"
                        placeholder="Write your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setShowSendMessage(false)}>Cancel</button>
                      <button type="button" className="btn btn-primary" onClick={handleSendMessage}>Send Message</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <hr />
            <div className="text-start mt-4">
              <h6 className="text-uppercase small fw-bold text-muted mb-3">Community Influence</h6>
              <div className="mb-2">
                <span className={`badge ${getRankBadge(member.points).color} text-white rounded-pill px-3 py-2 w-100`}>
                  {getRankBadge(member.points).name}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-1 small fw-bold">
                <span>Progress</span>
                <span>{member.points} / {maxPoints} XP</span>
              </div>
              <div className="progress-points">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="progress-points-fill"
                ></motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8 mt-4 mt-md-0">
          <div className="row h-100">
            {/* Quick Stats Grid */}
            <div className="col-6 col-sm-3 mb-4">
              <div className="ieee-card p-3 text-center h-100 d-flex flex-column justify-content-center">
                <h2 className="mb-0 text-primary">{member.points || 0}</h2>
                <small className="text-muted text-uppercase fw-bold mt-1">XP Points</small>
              </div>
            </div>
            <div className="col-6 col-sm-3 mb-4">
              <div className="ieee-card p-3 text-center h-100 d-flex flex-column justify-content-center">
                <h2 className="mb-0 text-success">{stats.totalCertificates}</h2>
                <small className="text-muted text-uppercase fw-bold mt-1">Certs</small>
              </div>
            </div>
            <div className="col-6 col-sm-3 mb-4">
              <div className="ieee-card p-3 text-center h-100 d-flex flex-column justify-content-center">
                <h2 className="mb-0 text-warning">{stats.winnerCerts}</h2>
                <small className="text-muted text-uppercase fw-bold mt-1">Awards</small>
              </div>
            </div>
            <div className="col-6 col-sm-3 mb-4">
              <div className="ieee-card p-3 text-center h-100 d-flex flex-column justify-content-center">
                <h2 className="mb-0 text-info">{stats.achievementCerts}</h2>
                <small className="text-muted text-uppercase fw-bold mt-1">Elite</small>
              </div>
            </div>
            
            {/* Top Achievements */}
            <div className="col-12">
              <div className="ieee-card p-4">
                <h5 className="mb-4 d-flex align-items-center">
                  <Trophy size={20} className="me-2 text-warning" /> Top Achievements
                </h5>
                <div className="row">
                  {getTopAchievements(certificates).length > 0 ? (
                    getTopAchievements(certificates).map((cert, index) => (
                      <div key={cert._id} className="col-md-4 mb-3">
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            {getCertIcon(cert.certificateType)}
                          </div>
                          <div className="flex-grow-1">
                            <div className="fw-bold">{cert.eventName}</div>
                            <small className="text-muted">{cert.certificateType}</small>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted p-4">
                      <Award size={48} className="opacity-25 mb-2" />
                      <p>No achievements yet. Participate in events to earn rewards!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Personal Achievements Timeline */}
            <div className="col-12">
              <div className="ieee-card p-4">
                <h5 className="mb-4 d-flex align-items-center">
                  <Clock size={20} className="me-2 text-info" /> Personal Achievements Timeline
                </h5>
                <div className="timeline-container ps-4">
                  {[...certificates, ...(member.projects || []), ...(member.publications || [])]
                    .sort((a, b) => new Date(b.date || b.eventDate) - new Date(a.date || a.eventDate))
                    .slice(0, 5) // Show top 5 recent items
                    .map((item, index) => (
                      <motion.div 
                        key={item._id} 
                        className="timeline-item mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="ieee-card p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-0">{item.eventName || item.title}</h6>
                            <span className="text-muted small fw-bold">
                              {item.eventDate ? new Date(item.eventDate).toLocaleDateString() : 
                               item.date ? new Date(item.date).toLocaleDateString() : 
                               new Date(item.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-muted mb-2 small">{item.description || item.eventName}</p>
                          <div className="d-flex gap-2">
                            {item.certificateType && (
                              <span className="badge bg-warning text-dark">
                                Certificate: {item.certificateType}
                              </span>
                            )}
                            {item.status && (
                              <span className="badge bg-info">
                                {item.status}
                              </span>
                            )}
                            {item.points && (
                              <span className="badge bg-success">
                                +{item.points} XP
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  }
                </div>
              </div>
            </div>

            {/* Biography / Info */}
            <div className="col-12">
              <div className="ieee-card p-4 h-100">
                <h5 className="mb-4 d-flex align-items-center">
                  <User size={20} className="me-2 text-primary" /> About Member
                </h5>
                <div className="row">
                  <div className="col-sm-6 mb-3">
                    <p className="text-muted small mb-1">Affiliation</p>
                    <p className="fw-bold"><Briefcase size={16} className="me-2 text-primary" /> SUTECH Student Branch</p>
                  </div>
                  <div className="col-sm-6 mb-3">
                    <p className="text-muted small mb-1">Joined Date</p>
                    <p className="fw-bold"><Calendar size={16} className="me-2 text-primary" /> {new Date(member.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="col-sm-6 mb-3">
                    <p className="text-muted small mb-1">Status</p>
                    <p className="fw-bold"><Shield size={16} className="me-2 text-primary" /> Verified Profile</p>
                  </div>
                  <div className="col-sm-6 mb-3">
                    <p className="text-muted small mb-1">Academic Year</p>
                    <p className="fw-bold"><GraduationCap size={16} className="me-2 text-primary" /> {member.academicYear || '2023 / 2024'}</p>
                  </div>
                  <div className="col-12 mb-3">
                    <p className="text-muted small mb-1">Bio</p>
                    <p className="fw-bold">{member.bio || 'No bio available'}</p>
                  </div>
                  <div className="col-sm-6 mb-3">
                    <p className="text-muted small mb-1">Department</p>
                    <p className="fw-bold"><Building size={16} className="me-2 text-primary" /> {member.department || 'Engineering'}</p>
                  </div>
                  <div className="col-sm-6 mb-3">
                    <p className="text-muted small mb-1">Followers</p>
                    <p className="fw-bold"><UsersIcon size={16} className="me-2 text-primary" /> {(member.followers || []).length}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Publications Section */}
            {member.publications && member.publications.length > 0 && (
              <div className="col-12">
                <div className="ieee-card p-4">
                  <h5 className="mb-4 d-flex align-items-center">
                    <BookOpen size={20} className="me-2 text-success" /> Publications
                  </h5>
                  <div className="row">
                    {member.publications.map((pub, index) => (
                      <div key={index} className="col-md-6 mb-3">
                        <div className="border rounded p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-0">{pub.title}</h6>
                            {pub.date && (
                              <span className="text-muted small">{new Date(pub.date).toLocaleDateString()}</span>
                            )}
                          </div>
                          <p className="text-muted small mb-2">{pub.description}</p>
                          {pub.link && (
                            <a href={pub.link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                              <ExternalLink size={12} className="me-1" /> View Publication
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Projects Section */}
            {member.projects && member.projects.length > 0 && (
              <div className="col-12">
                <div className="ieee-card p-4">
                  <h5 className="mb-4 d-flex align-items-center">
                    <Code size={20} className="me-2 text-info" /> Projects
                  </h5>
                  <div className="row">
                    {member.projects.map((project, index) => (
                      <div key={index} className="col-md-6 mb-3">
                        <div className="border rounded p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-0">{project.title}</h6>
                            <span className={`badge ${project.status === 'completed' ? 'bg-success' : project.status === 'ongoing' ? 'bg-primary' : 'bg-warning'}`}>
                              {project.status}
                            </span>
                          </div>
                          <p className="text-muted small mb-2">{project.description}</p>
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="mb-2">
                              <small className="text-muted">Technologies: {project.technologies.join(', ')}</small>
                            </div>
                          )}
                          {(project.startDate || project.endDate) && (
                            <div className="mb-2">
                              <small className="text-muted">
                                {project.startDate && `Start: ${new Date(project.startDate).toLocaleDateString()}`}
                                {project.endDate && ` | End: ${new Date(project.endDate).toLocaleDateString()}`}
                              </small>
                            </div>
                          )}
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-info">
                              <ExternalLink size={12} className="me-1" /> View Project
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Research Work Section */}
            {member.research && member.research.length > 0 && (
              <div className="col-12">
                <div className="ieee-card p-4">
                  <h5 className="mb-4 d-flex align-items-center">
                    <BookOpen size={20} className="me-2 text-warning" /> Research Work
                  </h5>
                  <div className="row">
                    {member.research.map((research, index) => (
                      <div key={index} className="col-md-6 mb-3">
                        <div className="border rounded p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-0">{research.title}</h6>
                            {research.status && (
                              <span className="badge bg-warning text-dark">{research.status}</span>
                            )}
                          </div>
                          <p className="text-muted small mb-2">{research.description}</p>
                          {research.collaborators && research.collaborators.length > 0 && (
                            <div className="mb-2">
                              <small className="text-muted">Collaborators: {research.collaborators.join(', ')}</small>
                            </div>
                          )}
                          {research.date && (
                            <div className="mb-2">
                              <small className="text-muted">Date: {new Date(research.date).toLocaleDateString()}</small>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Certificates Timeline */}
      <div className="row">
        <div className="col-md-12">
          <h4 className="mb-4 d-flex align-items-center">
            <Award size={24} className="me-2 text-primary" /> Achievement Roadmap
          </h4>
          
          {certificates.length === 0 ? (
            <div className="ieee-card p-5 text-center">
              <Award size={48} className="text-muted mb-3 opacity-25" />
              <p className="text-muted">No certificates found. Participation in events will unlock rewards!</p>
            </div>
          ) : (
            <div className="timeline-container ps-4">
              {certificates.map((cert, index) => (
                <motion.div 
                  key={cert._id} 
                  className="timeline-item mb-5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="ieee-card overflow-hidden">
                    <div className="row g-0">
                      <div className="col-md-3 p-4 d-flex align-items-center justify-content-center border-end" style={{ background: getCertGradient(cert.certificateType) }}>
                        <div className="text-center text-white">
                          {getCertIcon(cert.certificateType)}
                          <div className="text-uppercase fw-bold small mt-2">{cert.certificateType}</div>
                        </div>
                      </div>
                      <div className="col-md-9 p-4">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="mb-0">{cert.eventName}</h5>
                          <span className="text-muted small fw-bold">{new Date(cert.eventDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                        </div>
                        <p className="text-muted mb-3">{cert.description || "Official recognition for valuable contributions and active participation in IEEE activities."}</p>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-outline-ieee btn-sm rounded-pill d-flex align-items-center"
                            onClick={() => navigate(`/certificate/${cert._id}`)}
                          >
                            <Eye size={14} className="me-1" /> View Full
                          </button>
                          <button 
                            className="btn btn-light btn-sm rounded-pill d-flex align-items-center"
                            onClick={() => window.open(`http://localhost:5000/api/certificates/pdf/${cert._id}`, '_blank')}
                          >
                            <Download size={14} className="me-1" /> PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
