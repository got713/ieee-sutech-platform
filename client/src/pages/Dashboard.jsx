import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Add CSS styles for locked buttons and dashboard
const styles = `
.locked-btn {
  position: relative;
  filter: blur(0.5px);
  opacity: 0.7;
}

.locked-btn:disabled {
  cursor: not-allowed;
}

.locked-btn::after {
  content: "🔒 Login Required";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 12px;
  font-weight: bold;
  border-radius: 0.375rem;
}

.dashboard-card {
  padding: 20px;
  border-radius: 16px;
  transition: 0.3s ease;
  background: white;
  border-left: 4px solid #00629b; /* IEEE Navy */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dashboard-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.bg-ieee-gradient {
  background: linear-gradient(135deg, #00629b 0%, #ff9900 100%); /* IEEE Navy to Orange */
}

.text-ieee-navy {
  color: #00629b !important;
}

.text-ieee-orange {
  color: #ff9900 !important;
}

.border-ieee-navy {
  border-color: #00629b !important;
}

.btn-ieee {
  background-color: #00629b;
  border-color: #00629b;
  color: white;
}

.btn-ieee:hover {
  background-color: #004c7a;
  border-color: #004c7a;
}

.btn-ieee-outline {
  background-color: transparent;
  border-color: #00629b;
  color: #00629b;
}

.btn-ieee-outline:hover {
  background-color: #00629b;
  color: white;
}

/* Navbar Styles */
.bg-ieee-gradient {
  background: linear-gradient(135deg, #00629b 0%, #ff9900 100%) !important;
}

.text-ieee-orange {
  color: #ff9900 !important;
}

.dropdown-menu {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95);
}

.navbar-brand {
  font-family: 'Arial', sans-serif;
}
`;

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Detect user login status
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        // Also store user in localStorage for easy access
        localStorage.setItem("user", JSON.stringify(data));
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Public dashboard for unauthenticated users
  if (!isLoggedIn) {
    return (
      <>
        <style>{styles}</style>
        <div className="container mt-4">
          <motion.h2 
            className="mb-4 text-ieee-navy"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            📊 IEEE SUTECH Dashboard
          </motion.h2>
          
          {/* Public Dashboard Banner */}
          <motion.div 
            className="alert alert-info text-center mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <strong>🔓 You're viewing a public dashboard.</strong> Login for full access to personalized features.
            <button 
              className="btn btn-ieee ms-3"
              onClick={() => navigate("/login")}
            >
              Login for full access
            </button>
          </motion.div>
          
          {/* Statistics Cards */}
          <motion.div 
            className="row g-4 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="col-md-3">
              <motion.div
                className="card dashboard-card shadow-sm"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h6 className="text-muted">Total Members</h6>
                <h2 className="text-ieee-navy">150+</h2>
              </motion.div>
            </div>
            
            <div className="col-md-3">
              <motion.div
                className="card dashboard-card shadow-sm"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
              >
                <h6 className="text-muted">Events</h6>
                <h2 className="text-ieee-navy">25+</h2>
              </motion.div>
            </div>
            
            <div className="col-md-3">
              <motion.div
                className="card dashboard-card shadow-sm"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
              >
                <h6 className="text-muted">Certificates</h6>
                <h2 className="text-ieee-navy">50+</h2>
              </motion.div>
            </div>
            
            <div className="col-md-3">
              <motion.div
                className="card dashboard-card shadow-sm"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
              >
                <h6 className="text-muted">Join Requests</h6>
                <h2 className="text-ieee-navy">7</h2>
              </motion.div>
            </div>
          </motion.div>
          
          <div className="row">
            {/* Activities Preview */}
            <div className="col-lg-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title text-ieee-navy">🎉 Recent Activities</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <small className="text-muted">Jan 15, 2024</small>
                      <p className="mb-1">AI Workshop Series</p>
                      <span className="badge bg-info">Workshop</span>
                    </li>
                    <li className="list-group-item">
                      <small className="text-muted">Dec 20, 2023</small>
                      <p className="mb-1">Robotics Competition</p>
                      <span className="badge bg-success">Competition</span>
                    </li>
                    <li className="list-group-item">
                      <small className="text-muted">Nov 10, 2023</small>
                      <p className="mb-1">Tech Conference</p>
                      <span className="badge bg-primary">Conference</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Design Preview */}
            <div className="col-lg-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title text-ieee-navy">🎨 Platform Features</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span>Event Registration</span>
                      <span className="badge bg-success">Public</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span>Certificate Verification</span>
                      <span className="badge bg-success">Public</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span>Member Directory</span>
                      <span className="badge bg-success">Public</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center text-muted">
                      <span>Personalized Dashboard</span>
                      <span className="badge bg-warning">Login Required</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center text-muted">
                      <span>Event Management</span>
                      <span className="badge bg-warning">Login Required</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Locked Features Preview */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card border-ieee-navy">
                <div className="card-body">
                  <h5 className="card-title text-ieee-navy">🔐 Locked Features (Login Required)</h5>
                  <p className="card-text">The following features require authentication:</p>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      disabled
                      className="btn btn-success disabled locked-btn"
                      title="Login required"
                    >
                      📅 My Events
                    </button>
                    <button
                      disabled
                      className="btn btn-warning disabled locked-btn"
                      title="Login required"
                    >
                      👑 Admin Panel
                    </button>
                    <button
                      disabled
                      className="btn btn-danger disabled locked-btn"
                      title="Login required"
                    >
                      ➕ Add Event
                    </button>
                    <button
                      disabled
                      className="btn btn-dark disabled locked-btn"
                      title="Login required"
                    >
                      🏆 Issue Certificate
                    </button>
                    <button
                      disabled
                      className="btn btn-info disabled locked-btn"
                      title="Login required"
                    >
                      👥 Manage Members
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Login Prompt */}
          <div className="row mt-4 justify-content-center">
            <div className="col-md-6">
              <div className="card border-ieee-navy">
                <div className="card-body text-center">
                  <h5 className="card-title text-ieee-navy">Ready for Full Access?</h5>
                  <p className="card-text">Sign in to access your personalized dashboard with full features</p>
                  <button
                    className="btn btn-ieee me-2"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                  <button
                    className="btn btn-ieee-outline"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Use storedUser if available and user is not loaded from API yet
  const displayUser = user || storedUser;

  // Authenticated user dashboard
  return (
    <>
      <style>{styles}</style>
      <div className="container mt-4">
        <motion.h2 
          className="mb-4 text-ieee-navy"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Welcome, {displayUser.name} 👋
        </motion.h2>
        
        {/* Statistics Cards for authenticated users */}
        <motion.div 
          className="row g-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="col-md-3">
            <motion.div
              className="card dashboard-card shadow-sm"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h6 className="text-muted">Your Points</h6>
              <h2 className="text-ieee-navy">{displayUser.points || 0}</h2>
            </motion.div>
          </div>
          
          <div className="col-md-3">
            <motion.div
              className="card dashboard-card shadow-sm"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
            >
              <h6 className="text-muted">Events Attended</h6>
              <h2 className="text-ieee-navy">{Math.floor((displayUser.points || 0) / 10) || 0}</h2>
            </motion.div>
          </div>
          
          <div className="col-md-3">
            <motion.div
              className="card dashboard-card shadow-sm"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            >
              <h6 className="text-muted">Certificates Earned</h6>
              <h2 className="text-ieee-navy">{Math.floor((displayUser.points || 0) / 20) || 0}</h2>
            </motion.div>
          </div>
          
          <div className="col-md-3">
            <motion.div
              className="card dashboard-card shadow-sm"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
            >
              <h6 className="text-muted">Role</h6>
              <h2 className="text-ieee-navy text-capitalize">{displayUser.role}</h2>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Admin Tools for authenticated users */}
        <motion.div 
          className="mb-4 p-3 bg-light rounded"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h5 className="mb-3 text-ieee-navy">🛠️ Available Actions</h5>
          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-ieee"
              onClick={() => navigate("/events")}
            >
              🎉 Browse Events
            </button>
            <button
              className="btn btn-success"
              onClick={() => navigate("/my-events")}
            >
              📅 My Events
            </button>
            <button
              className="btn btn-info"
              onClick={() => navigate("/join")}
            >
              🔖 Join IEEE
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/members")}
            >
              👥 Members Directory
            </button>
            
            {/* Conditionally show admin tools based on user role */}
            {displayUser?.role === "admin" && (
              <>
                <button
                  className="btn btn-warning"
                  onClick={() => navigate("/admin")}
                >
                  👑 Admin Panel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => navigate("/admin/add-event")}
                >
                  ➕ Add Event
                </button>
                <button
                  className="btn btn-dark"
                  onClick={() => navigate("/admin/certificates")}
                >
                  🏆 Issue Certificate
                </button>
                <button
                  className="btn btn-info"
                  onClick={() => navigate("/admin/members")}
                >
                  👥 Manage Members
                </button>
              </>
            )}
          </div>
        </motion.div>
        
        <motion.div 
          className="card mt-4" 
          style={{ maxWidth: "500px" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="card-body">
            <h5 className="card-title text-ieee-navy">Profile Information</h5>
            <p className="card-text"><strong>Email:</strong> {displayUser.email}</p>
            <p className="card-text"><strong>Role:</strong> {displayUser.role}</p>
            <p className="card-text"><strong>Points:</strong> {displayUser.points || 0}</p>
          </div>
        </motion.div>

        <motion.div 
          className="mt-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <button
            className="btn btn-danger mt-3"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </motion.div>
      </div>
    </>
  );
};

export default Dashboard;
