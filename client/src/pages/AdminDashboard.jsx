import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from "recharts";
import { 
  Users, Calendar, Award, ClipboardList, PlusCircle, 
  CheckCircle, ArrowRight, Activity, Zap, Bell, BookOpen, Trophy
} from "lucide-react";
import { motion } from "framer-motion";
import MemberSpotlight from "../components/MemberSpotlight";

// Initialize Cloudinary (replace with your actual Cloudinary config)
const initializeCloudinary = () => {
  if (window.cloudinary) {
    // Cloudinary is already loaded via script in index.html
    return true;
  }
  return false;
};

// Cloudinary Upload Widget Configuration
const openCloudinaryWidget = (onUpload, options = {}) => {
  if (!initializeCloudinary()) {
    alert('Cloudinary widget not loaded. Please check your internet connection.');
    return;
  }

  const widget = window.cloudinary.createUploadWidget(
    {
      cloudName: "YOUR_CLOUD_NAME", // Replace with your Cloudinary cloud name
      uploadPreset: "YOUR_UPLOAD_PRESET", // Replace with your upload preset
      sources: ["local", "url", "camera"],
      multiple: false,
      maxFileSize: 5000000, // 5MB
      clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
      cropping: true,
      croppingAspectRatio: 16 / 9,
      ...options
    },
    (error, result) => {
      if (error) {
        console.error("Upload Error:", error);
        alert("Upload failed: " + error.message);
        return;
      }

      if (result.event === "success") {
        const imageUrl = result.info.secure_url;
        onUpload(imageUrl);
      }
    }
  );

  widget.open();
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const fetchData = async () => {
      try {
        const userRes = await fetch("http://localhost:5000/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userRes.ok) throw new Error("Not authorized");
        const userData = await userRes.json();
        setData(userData);

        const statsRes = await axios.get("http://localhost:5000/api/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(statsRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        navigate("/dashboard");
      }
    };
    
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/members/public", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMembers(res.data);
      } catch (err) {
        console.error("Error fetching members:", err);
      }
    };

    fetchData();
    fetchMembers();
  }, [navigate]);

  if (loading || !data) return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Loading Admin Insights...</p>
    </div>
  );

  // Prepare data for charts
  const certData = [
    { name: "Participation", value: stats.certificates.participation, color: "#003366" },
    { name: "Achievement", value: stats.certificates.achievement, color: "#006699" },
    { name: "Winner", value: stats.certificates.winner, color: "#F7941D" },
    { name: "Speaker", value: stats.certificates.speaker, color: "#43e97b" },
  ];

  const StatCard = ({ title, value, icon: Icon, colorClass, onClick, delay }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`col-md-3 mb-4`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className={`ieee-card p-4 h-100 position-relative border-start border-4 ${colorClass}`}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="text-muted mb-1 text-uppercase fw-bold small">{title}</p>
            <h2 className="mb-0">{value}</h2>
          </div>
          <div className={`p-3 rounded-circle bg-light`}>
            <Icon size={24} className="text-dark" />
          </div>
        </div>
        <div className="mt-3 small text-muted d-flex align-items-center">
          <span className="text-success me-1"><Activity size={12} /></span>
          Click to manage
          <ArrowRight size={12} className="ms-auto" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="container-fluid py-4 px-md-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">IEEE SUTECH Admin Insights 👑</h2>
          <p className="text-muted">Welcome back, {data.user.name}</p>
        </div>
        <button className="btn btn-outline-danger btn-sm" onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}>
          Logout
        </button>
      </div>

      {/* Quick Actions Bar */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="row mb-4"
      >
        <div className="col-12">
          <div className="ieee-card p-3 glass-panel d-flex align-items-center flex-wrap gap-3">
            <span className="fw-bold me-2"><Zap size={18} className="text-warning me-1" /> Quick Actions:</span>
            <button className="btn btn-ieee btn-sm d-flex align-items-center" onClick={() => navigate("/admin/add-event")}>
              <PlusCircle size={16} className="me-1" /> Add Event
            </button>
            <button className="btn btn-accent btn-sm d-flex align-items-center text-white" onClick={() => navigate("/admin/add-certificate")}>
              <Award size={16} className="me-1" /> Issue Certificate
            </button>
            <button className="btn btn-info btn-sm text-white d-flex align-items-center" onClick={() => navigate("/admin/batch-certificates")}>
              <ClipboardList size={16} className="me-1" /> Batch Create
            </button>
            <button className="btn btn-secondary btn-sm d-flex align-items-center" onClick={() => navigate("/admin/joins")}>
              <Users size={16} className="me-1" /> {stats.joinRequests.pending} Pending Joins
            </button>
            <button className="btn btn-success btn-sm d-flex align-items-center text-white" onClick={() => navigate("/admin/announcements")}>
              <Bell size={16} className="me-1" /> Manage News
            </button>
            <button className="btn btn-purple btn-sm d-flex align-items-center text-white" onClick={() => navigate("/admin/resources")}>
              <BookOpen size={16} className="me-1" /> Manage Resources
            </button>
            <button className="btn btn-info btn-sm d-flex align-items-center text-white" onClick={() => navigate("/my-events")}>
              <Calendar size={16} className="me-1" /> My Events
            </button>
          </div>
        </div>
      </motion.div>

      {/* Overview Cards */}
      <div className="row">
        <StatCard 
          title="Total Members" 
          value={stats.overview.totalMembers} 
          icon={Users} 
          colorClass="border-primary"
          onClick={() => navigate("/admin/members")}
          delay={0.1}
        />
        <StatCard 
          title="Total Events" 
          value={stats.overview.totalEvents} 
          icon={Calendar} 
          colorClass="border-success"
          onClick={() => navigate("/admin/events")}
          delay={0.2}
        />
        <StatCard 
          title="Issued Certificates" 
          value={stats.overview.totalCertificates} 
          icon={Award} 
          colorClass="border-warning"
          onClick={() => navigate("/admin/certificates")}
          delay={0.3}
        />
        <StatCard 
          title="Upcoming Events" 
          value={stats.overview.upcomingEvents} 
          icon={Activity} 
          colorClass="border-info"
          onClick={() => navigate("/admin/events")}
          delay={0.4}
        />
      </div>

      {/* Charts Section */}
      <div className="row">
        <div className="col-md-8 mb-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ieee-card p-4 h-100"
          >
            <h5 className="mb-4">Recent Activity (7 Days)</h5>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={[
                  { name: 'New Members', count: stats.recentActivity.newMembers },
                  { name: 'Join Requests', count: stats.recentActivity.newJoinRequests },
                  { name: 'Certificates', count: stats.recentActivity.newCertificates },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{fill: '#f0f4f8'}} />
                  <Bar dataKey="count" fill="#003366" radius={[5, 5, 0, 0]} barSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
        <div className="col-md-4 mb-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ieee-card p-4 h-100"
          >
            <h5 className="mb-4">Certificates Distribution</h5>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={certData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {certData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Member Spotlight Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="row mb-4"
      >
        <div className="col-12">
          <div className="ieee-card p-4">
            <MemberSpotlight 
              members={members} 
              title="Community Leaders" 
              subtitle="Top contributors driving our community forward" 
            />
          </div>
        </div>
      </motion.div>

      {/* Detailed Status Row */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="ieee-card p-4">
            <h5>Join Requests Overview</h5>
            <div className="mt-3">
              <div className="d-flex justify-content-between mb-2">
                <span>Approved</span>
                <span className="fw-bold text-success">{stats.joinRequests.approved}</span>
              </div>
              <div className="progress mb-3" style={{ height: 8 }}>
                <div className="progress-bar bg-success" style={{ width: `${(stats.joinRequests.approved / stats.overview.totalJoinRequests) * 100}%` }}></div>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Pending Review</span>
                <span className="fw-bold text-warning">{stats.joinRequests.pending}</span>
              </div>
              <div className="progress mb-3" style={{ height: 8 }}>
                <div className="progress-bar bg-warning" style={{ width: `${(stats.joinRequests.pending / stats.overview.totalJoinRequests) * 100}%` }}></div>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Rejected</span>
                <span className="fw-bold text-danger">{stats.joinRequests.rejected}</span>
              </div>
              <div className="progress mb-3" style={{ height: 8 }}>
                <div className="progress-bar bg-danger" style={{ width: `${(stats.joinRequests.rejected / stats.overview.totalJoinRequests) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="ieee-card p-4 bg-ieee-gradient text-white">
            <h5 className="text-white">Quick System Status</h5>
            <div className="mt-4 d-flex align-items-center">
              <div className="p-3 bg-white bg-opacity-25 rounded-3 me-3">
                <CheckCircle size={32} />
              </div>
              <div>
                <h4 className="mb-0 text-white">All Systems Operational</h4>
                <p className="mb-0 text-white text-opacity-75 small">Last sync: Just now</p>
              </div>
            </div>
            <hr className="bg-white" />
            <div className="row text-center mt-3">
              <div className="col-4">
                <h4 className="text-white mb-0">{stats.overview.totalPoints}</h4>
                <small className="text-white text-opacity-75">Points</small>
              </div>
              <div className="col-4 border-start border-white border-opacity-25">
                <h4 className="text-white mb-0">{stats.members.admins}</h4>
                <small className="text-white text-opacity-75">Admins</small>
              </div>
              <div className="col-4 border-start border-white border-opacity-25">
                <h4 className="text-white mb-0">{stats.members.members}</h4>
                <small className="text-white text-opacity-75">Members</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
