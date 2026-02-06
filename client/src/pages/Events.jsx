import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, MapPin, Search, ChevronRight, 
  ArrowLeft, Clock, Filter, ExternalLink, Users
} from "lucide-react";
import EventCalendar from "../components/EventCalendar";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming"); // upcoming, past
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // list or calendar
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const categories = ["all", "general", "workshop", "seminar", "conference", "competition", "social"];

  useEffect(() => {
    axios.get("http://localhost:5000/api/events")
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const now = new Date();
    let filtered = events.filter((event) => {
      const eventDate = new Date(event.date);
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;
      
      if (activeTab === "upcoming") {
        return eventDate >= now && matchesSearch && matchesCategory;
      } else {
        return eventDate < now && matchesSearch && matchesCategory;
      }
    });
    setFilteredEvents(filtered);
  }, [searchTerm, events, activeTab, categoryFilter]);

  const handleRegister = async (eventId) => {
    if (!token) {
      alert("Please login to register for events");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/events/${eventId}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Successfully registered for event!");
      // Refresh events
      axios.get("http://localhost:5000/api/events")
        .then((res) => {
          setEvents(res.data);
        });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
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

  if (loading) return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-2">Loading IEEE Events...</p>
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
          IEEE SUTECH Events 📅
        </motion.h2>
        <p className="text-muted lead">Join our workshops, competitions, and technical sessions.</p>
      </div>

      {/* Search & Filters */}
      <div className="row mb-5">
        <div className="col-md-8 mx-auto">
          <div className="ieee-card p-2 glass-panel mb-4">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-0">
                <Search size={20} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Search events by title or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex justify-content-center gap-2 mb-4">
            <button 
              className={`btn rounded-pill px-4 ${activeTab === "upcoming" ? "btn-ieee" : "btn-light"}`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming Events
            </button>
            <button 
              className={`btn rounded-pill px-4 ${activeTab === "past" ? "btn-ieee" : "btn-light"}`}
              onClick={() => setActiveTab("past")}
            >
              Past Activities
            </button>
          </div>

          <div className="d-flex justify-content-center gap-2">
            <div className="d-flex align-items-center">
              <Filter size={18} className="text-muted me-2" />
              <select 
                className="form-select border-0 shadow-sm rounded-pill px-3"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex align-items-center">
              <button 
                className={`btn rounded-pill px-3 ${viewMode === 'list' ? 'btn-ieee' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
              <button 
                className={`btn rounded-pill px-3 ms-1 ${viewMode === 'calendar' ? 'btn-ieee' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('calendar')}
              >
                Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="mb-5">
          <EventCalendar 
            events={filteredEvents}
            selectedDate={null}
            onEventSelect={() => {}}
          />
        </div>
      )}

      {/* Events Grid */}
      {viewMode === 'list' && (
        <div className="row">
          <AnimatePresence mode="wait">
            {filteredEvents.length === 0 ? (
              <motion.div 
                key="no-events"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-12 text-center py-5"
              >
                <Calendar size={48} className="text-muted mb-3 opacity-25" />
                <p className="text-muted">No {activeTab} events found matching your search.</p>
              </motion.div>
            ) : (
              filteredEvents.map((event, index) => (
                <motion.div 
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="col-lg-4 col-md-6 mb-4"
                >
                  <div className="ieee-card h-100 d-flex flex-column">
                    {/* Event Image */}
                    <div className="position-relative overflow-hidden" style={{ height: "200px" }}>
                      <img 
                        src={event.image || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`} 
                        className="w-100 h-100 object-fit-cover transition-transform"
                        alt={event.title}
                        style={{ transition: "0.5s" }}
                      />
                      <div className="position-absolute top-0 end-0 p-3">
                        <span className={`badge ${activeTab === 'upcoming' ? 'bg-accent-gradient' : 'bg-secondary'} text-white rounded-pill px-3 py-2 shadow-sm`}>
                          {activeTab === 'upcoming' ? 'Coming Soon' : 'Finished'}
                        </span>
                      </div>
                    </div>

                    <div className="card-body p-4 flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className={`badge bg-${getCategoryColor(event.category)}`}>
                          {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                        </span>
                        {event.isRegistrationOpen && (
                          <span className="badge bg-success">Registration Open</span>
                        )}
                      </div>
                      
                      <h5 className="card-title fw-bold mb-3">{event.title}</h5>
                      
                      <div className="d-flex align-items-center text-muted mb-2 small">
                        <Clock size={14} className="me-2 text-primary" />
                        {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      
                      <div className="d-flex align-items-center text-muted mb-3 small">
                        <MapPin size={14} className="me-2 text-primary" />
                        {event.location}
                      </div>

                      <p className="card-text text-muted small line-clamp-3">
                        {event.description}
                      </p>

                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <span className="small text-muted">
                          {event.attendees?.length || 0} attending
                        </span>
                        
                        <div className="d-flex gap-2">
                          {event.isRegistrationOpen && (
                            <button 
                              className="btn btn-ieee btn-sm"
                              onClick={() => handleRegister(event._id)}
                              disabled={!token}
                              title={!token ? "Login to register" : "Register for event"}
                            >
                              Register
                            </button>
                          )}
                          {event.registrationLink && (
                            <a 
                              href={event.registrationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-primary btn-sm"
                            >
                              External
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="text-center mt-5">
        <button className="btn btn-secondary rounded-pill px-4 d-flex align-items-center mx-auto" onClick={() => navigate("/")}>
          <ArrowLeft size={16} className="me-2" /> Return to Home
        </button>
      </div>
    </div>
  );
};

export default Events;
