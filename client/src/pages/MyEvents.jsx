import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  Calendar, MapPin, Clock, Users, ExternalLink,
  Eye, ThumbsUp, Share2, Heart, Star, X
} from "lucide-react";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Please login to view your events");
      return;
    }

    fetchMyEvents();
  }, [token]);

  const fetchMyEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events/my-events", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleUnregister = async (eventId) => {
    if (!window.confirm("Are you sure you want to unregister from this event?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/events/${eventId}/unregister`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Successfully unregistered from event!");
      fetchMyEvents(); // Refresh events
    } catch (err) {
      alert(err.response?.data?.message || "Unregistration failed");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'workshop': return 'warning';
      case 'seminar': return 'info';
      case 'conference': return 'primary';
      case 'competition': return 'danger';
      case 'social': return 'success';
      default: return 'secondary';
    }
  };

  const getStatus = (eventDate) => {
    const now = new Date();
    const event = new Date(eventDate);
    if (event < now) return 'past';
    return 'upcoming';
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading Your Events...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">My Events 🎫</h1>
        <p className="lead text-muted">Events you have registered for</p>
      </div>

      {/* Events List */}
      <div className="row g-4">
        <AnimatePresence>
          {events.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-12 text-center py-5"
            >
              <Calendar size={48} className="text-muted mb-3 opacity-25" />
              <p className="text-muted">You haven't registered for any events yet.</p>
            </motion.div>
          ) : (
            events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="col-md-6 col-lg-4"
              >
                <div className="ieee-card h-100">
                  {/* Event Image */}
                  {event.image && (
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="img-fluid rounded-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  
                  <div className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className={`badge bg-${getCategoryColor(event.category)}`}>
                        {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                      </span>
                      <span className={`badge ${getStatus(event.date) === 'past' ? 'bg-secondary' : 'bg-success'}`}>
                        {getStatus(event.date) === 'past' ? 'Completed' : 'Registered'}
                      </span>
                    </div>
                    
                    <h5 className="mb-3">{event.title}</h5>
                    <p className="text-muted small mb-3">{event.description}</p>
                    
                    <div className="d-flex flex-column gap-2 mb-3">
                      <div className="d-flex align-items-center text-muted">
                        <Clock size={16} className="me-2" />
                        <span className="small">{formatDate(event.date)}</span>
                      </div>
                      <div className="d-flex align-items-center text-muted">
                        <MapPin size={16} className="me-2" />
                        <span className="small">{event.location}</span>
                      </div>
                      {event.registrationLink && (
                        <div className="d-flex align-items-center text-muted">
                          <ExternalLink size={16} className="me-2" />
                          <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="small text-decoration-none">
                            External Registration
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="small text-muted">
                        {event.attendees?.length || 0} attending
                      </span>
                      
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleUnregister(event._id)}
                        >
                          <X size={14} className="me-1" />
                          Unregister
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyEvents;
