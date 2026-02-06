import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminJoins = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return navigate("/login");

    axios.get("http://localhost:5000/api/joins", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setRequests(res.data);
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

  const updateStatus = (id, status) => {
    axios.put(`http://localhost:5000/api/joins/${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setRequests(requests.map(r => r._id === id ? res.data : r));
        alert(`Request ${status} successfully!`);
      })
      .catch(err => {
        console.error(err);
        alert("Failed to update status: " + (err.response?.data?.message || err.message));
      });
  };

  const deleteRequest = (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;

    axios.delete(`http://localhost:5000/api/joins/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setRequests(requests.filter(r => r._id !== id));
        alert("Request deleted successfully!");
      })
      .catch(err => {
        console.error(err);
        alert("Failed to delete request: " + (err.response?.data?.message || err.message));
      });
  };

  const getStatusBadge = (status) => {
    const badgeClass = {
      pending: "bg-warning",
      approved: "bg-success",
      rejected: "bg-danger"
    };
    return <span className={`badge ${badgeClass[status]}`}>{status}</span>;
  };

  const filteredRequests = requests.filter(r => {
    // Apply status filter
    const statusMatch = filter === "all" || r.status === filter;
    
    // Apply search filter
    const searchMatch = searchTerm === "" || 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  if (loading) {
    return <div className="container mt-5"><p>Loading join requests...</p></div>;
  }

  return (
    <div className="container mt-4">
      <h2>Admin Join Requests 🛡️</h2>
      
      {/* Search Bar */}
      <div className="row mb-3">
        <div className="col-md-10">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button 
            className="btn btn-secondary w-100"
            onClick={() => setSearchTerm("")}
          >
            Clear
          </button>
        </div>
      </div>
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("/admin")}>
            Back to Admin Dashboard
          </button>
        </div>
        <div className="btn-group" role="group">
          <button 
            className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setFilter("all")}
          >
            All ({requests.length})
          </button>
          <button 
            className={`btn btn-sm ${filter === "pending" ? "btn-warning" : "btn-outline-warning"}`}
            onClick={() => setFilter("pending")}
          >
            Pending ({requests.filter(r => r.status === "pending").length})
          </button>
          <button 
            className={`btn btn-sm ${filter === "approved" ? "btn-success" : "btn-outline-success"}`}
            onClick={() => setFilter("approved")}
          >
            Approved ({requests.filter(r => r.status === "approved").length})
          </button>
          <button 
            className={`btn btn-sm ${filter === "rejected" ? "btn-danger" : "btn-outline-danger"}`}
            onClick={() => setFilter("rejected")}
          >
            Rejected ({requests.filter(r => r.status === "rejected").length})
          </button>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <p className="text-muted">No join requests found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Year</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(r => (
                <tr key={r._id}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.department}</td>
                  <td>{r.year}</td>
                  <td>{getStatusBadge(r.status)}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="btn-group btn-group-sm" role="group">
                      {r.status !== "approved" && (
                        <button 
                          className="btn btn-success" 
                          onClick={() => updateStatus(r._id, "approved")}
                          title="Approve"
                        >
                          ✓
                        </button>
                      )}
                      {r.status !== "rejected" && (
                        <button 
                          className="btn btn-warning" 
                          onClick={() => updateStatus(r._id, "rejected")}
                          title="Reject"
                        >
                          ✗
                        </button>
                      )}
                      <button 
                        className="btn btn-danger" 
                        onClick={() => deleteRequest(r._id)}
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminJoins;
