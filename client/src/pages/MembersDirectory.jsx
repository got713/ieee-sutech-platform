import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, User, Star, ArrowRight, Filter, Trophy, Award, Medal } from "lucide-react";
import MemberSpotlight from "../components/MemberSpotlight";

const MembersDirectory = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [sortBy, setSortBy] = useState("points");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/members/public")
      .then(res => {
        setMembers(res.data);
        setFilteredMembers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = members;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.department && member.department.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply role filter
    if (filterRole) {
      filtered = filtered.filter(member => member.role === filterRole);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "points") return (b.points || 0) - (a.points || 0);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "date") return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });
    
    setFilteredMembers(filtered);
  }, [searchTerm, filterRole, sortBy, members]);

  if (loading) return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-2">Loading Members Directory...</p>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="display-5 mb-2"
        >
          IEEE SUTECH Members 👥
        </motion.h2>
        <p className="text-muted lead">Meet the bright minds driving our student branch forward.</p>
      </div>

      {/* Advanced Search & Filter Bar */}
      <div className="row mb-5 justify-content-center">
        <div className="col-xl-10">
          <div className="ieee-card p-3 glass-panel">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-0">
                    <Search size={20} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 shadow-none"
                    placeholder="Search by name, email or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button 
                      className="btn btn-link text-muted" 
                      onClick={() => setSearchTerm("")}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <div className="col-md-3">
                <select 
                  className="form-select border-0 shadow-none"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </select>
              </div>
              <div className="col-md-3">
                <select 
                  className="form-select border-0 shadow-none"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="points">Sort by Points</option>
                  <option value="name">Sort by Name</option>
                  <option value="date">Sort by Join Date</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Member Spotlight Section */}
      <MemberSpotlight members={members} />
      
      {/* All Members Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">
            All Members 
            <span className="badge bg-ieee-gradient ms-2">{filteredMembers.length}</span>
          </h4>
          <div className="text-muted">
            Showing {filteredMembers.length} of {members.length} members
          </div>
        </div>
        
        {filteredMembers.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No members found matching your search.</p>
          </div>
        ) : (
          <div className="row">
            {filteredMembers.map((member, index) => (
              <motion.div 
                key={member._id} 
                className="col-lg-3 col-md-4 col-sm-6 mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="ieee-card h-100 text-center p-4 pt-5">
                  {/* Points Badge */}
                  <div className="position-absolute top-0 end-0 p-3">
                    <span className="badge bg-accent-gradient text-white rounded-pill px-3 py-2 d-flex align-items-center">
                      <Star size={14} className="me-1 fill-white" /> {member.points || 0}
                    </span>
                  </div>

                  {/* Avatar */}
                  <div className="mb-3 position-relative d-inline-block">
                    {member.avatar ? (
                      <img 
                        src={member.avatar} 
                        className="rounded-circle border border-4 border-white shadow-sm" 
                        alt={member.name}
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />
                    ) : (
                      <div 
                        className="rounded-circle bg-ieee-gradient d-flex align-items-center justify-content-center mx-auto shadow-sm"
                        style={{ width: "100px", height: "100px" }}
                      >
                        <h2 className="text-white mb-0">{member.name.charAt(0).toUpperCase()}</h2>
                      </div>
                    )}
                  </div>

                  <div className="card-body p-0">
                    <h5 className="card-title text-truncate mb-1">{member.name}</h5>
                    <p className="text-muted small mb-3 text-truncate">{member.email}</p>
                    
                    <div className="mb-3">
                      <span className={`badge ${member.role === 'admin' ? 'bg-danger' : 'bg-primary'} px-3`}>
                        {member.role === 'admin' ? '👑 Admin' : 'Member'}
                      </span>
                      {member.department && (
                        <div className="small text-muted mt-1">
                          {member.department}
                        </div>
                      )}
                    </div>

                    <button 
                      className="btn btn-outline-ieee btn-sm w-100 rounded-pill mt-2 d-flex align-items-center justify-content-center"
                      onClick={() => navigate(`/member/${member._id}`)}
                    >
                      View Profile <ArrowRight size={14} className="ms-2" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <div className="text-center mt-5">
        <button className="btn btn-secondary rounded-pill px-4" onClick={() => navigate("/")}>
          ← Return Home
        </button>
      </div>
    </div>
  );
};

export default MembersDirectory;
