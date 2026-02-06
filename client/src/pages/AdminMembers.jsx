import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminMembers = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return navigate("/login");

    axios.get("http://localhost:5000/api/members", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setMembers(res.data);
        setFilteredMembers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert("Access denied. Admin only.");
          navigate("/dashboard");
        }
      });
  }, [token, navigate]);

  // Search and filter effect
  useEffect(() => {
    let filtered = members;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(member => member.role === roleFilter);
    }

    setFilteredMembers(filtered);
  }, [searchTerm, roleFilter, members]);

  const deleteMember = (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    axios.delete(`http://localhost:5000/api/members/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setMembers(members.filter(m => m._id !== id));
        alert("Member deleted successfully!");
      })
      .catch(err => {
        console.error(err);
        alert("Failed to delete member: " + (err.response?.data?.message || err.message));
      });
  };

  if (loading) {
    return <div className="container mt-5"><p>Loading members...</p></div>;
  }

  return (
    <div className="container mt-4">
      <h2>Admin Members Panel 🛡️</h2>
      
      {/* Search and Filter Bar */}
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-control"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>
        </div>
        <div className="col-md-3">
          <button 
            className="btn btn-secondary w-100"
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("all");
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <button 
        className="btn btn-primary mb-3" 
        onClick={() => navigate("/admin/add-member")}
      >
        + Add Member
      </button>
      <button 
        className="btn btn-secondary mb-3 ms-2" 
        onClick={() => navigate("/admin")}
      >
        Back to Admin Dashboard
      </button>

      {filteredMembers.length === 0 ? (
        <p className="text-muted">
          {members.length === 0 
            ? "No members found. Add your first member!"
            : "No members match your search criteria."}
        </p>
      ) : (
        <div className="row">
          {filteredMembers.map(member => (
            <div key={member._id} className="col-md-4 mb-3">
              <div className="card h-100">
                {member.avatar && (
                  <img 
                    src={member.avatar} 
                    className="card-img-top" 
                    alt={member.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{member.name}</h5>
                  <p className="card-text">
                    <strong>Email:</strong> {member.email}
                  </p>
                  <p className="card-text">
                    <strong>Role:</strong> <span className={`badge ${member.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                      {member.role}
                    </span>
                  </p>
                  <p className="card-text">
                    <strong>Points:</strong> {member.points}
                  </p>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-info btn-sm" 
                      onClick={() => navigate(`/member/${member._id}`)}
                    >
                      👁️ Profile
                    </button>
                    <button 
                      className="btn btn-warning btn-sm" 
                      onClick={() => navigate(`/admin/edit-member/${member._id}`)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => deleteMember(member._id)}
                    >
                      Delete
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

export default AdminMembers;
