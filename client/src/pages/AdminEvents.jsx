import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return navigate("/login");

    axios.get("http://localhost:5000/api/events", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => { setEvents(res.data); setFilteredEvents(res.data); setLoading(false); })
    .catch(err => { 
      console.error(err); 
      setLoading(false);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    });
  }, [token, navigate]);

  // Search effect
  useEffect(() => {
    if (searchTerm) {
      const filtered = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  }, [searchTerm, events]);

  const deleteEvent = (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    axios.delete(`http://localhost:5000/api/events/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setEvents(events.filter(e => e._id !== id));
      alert("Event deleted successfully!");
    })
    .catch(err => {
      console.error(err);
      alert("Failed to delete event: " + (err.response?.data?.message || err.message));
    });
  };

  if (loading) return <div className="container mt-5"><p>Loading events...</p></div>;

  return (
    <div className="container mt-4">
      <h2>Admin Events Panel 🛠️</h2>
      
      {/* Search Bar */}
      <div className="row mb-3">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search events by title, description, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <button 
            className="btn btn-secondary w-100"
            onClick={() => setSearchTerm("")}
          >
            Clear Search
          </button>
        </div>
      </div>

      <button className="btn btn-primary mb-3" onClick={() => navigate("/admin/add-event")}>
        + Add Event
      </button>
      <button className="btn btn-secondary mb-3 ms-2" onClick={() => navigate("/admin")}>
        Back to Admin Dashboard
      </button>
      
      {filteredEvents.length === 0 ? (
        <p className="text-muted">
          {events.length === 0 
            ? "No events found. Create your first event!"
            : "No events match your search."}
        </p>
      ) : (
        <div className="row">
          {filteredEvents.map(event => (
            <div key={event._id} className="col-md-4 mb-3">
              <div className="card h-100">
                {event.image && (
                  <img 
                    src={event.image} 
                    className="card-img-top" 
                    alt={event.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{event.title}</h5>
                  <p className="card-text">{event.description}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      📅 {new Date(event.date).toLocaleDateString()}
                    </small>
                  </p>
                  <p className="card-text">
                    <small className="text-muted">📍 {event.location}</small>
                  </p>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => deleteEvent(event._id)}
                    >
                      Delete
                    </button>
                    <button 
                      className="btn btn-warning btn-sm" 
                      onClick={() => navigate(`/admin/edit-event/${event._id}`)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
