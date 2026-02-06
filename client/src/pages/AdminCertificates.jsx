import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Award, Search, Filter, Download, Mail, Eye, 
  Trash2, Plus, LayoutGrid, List, FileText,
  Trophy, Medal, Mic, CheckCircle, Clock, Edit
} from "lucide-react";

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [filteredCerts, setFilteredCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid, list
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = () => {
    axios.get("http://localhost:5000/api/certificates", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCertificates(res.data);
        setFilteredCerts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    let filtered = certificates.filter(cert =>
      cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (typeFilter !== "all") {
      filtered = filtered.filter(cert => cert.certificateType === typeFilter);
    }

    setFilteredCerts(filtered);
  }, [searchTerm, typeFilter, certificates]);

  const sendEmail = async (id, email) => {
    if (!window.confirm(`Send certificate to ${email}?`)) return;
    try {
      await axios.post(`http://localhost:5000/api/certificates/email/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Email sent successfully! 📧");
    } catch (err) {
      alert("Error sending email: " + err.message);
    }
  };

  const deleteCertificate = (id) => {
    if (!window.confirm("Are you sure?")) return;
    axios.delete(`http://localhost:5000/api/certificates/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setCertificates(certificates.filter(c => c._id !== id));
    });
  };

  const getCertIcon = (type) => {
    switch(type) {
      case 'winner': return <Trophy size={20} className="text-warning" />;
      case 'achievement': return <Medal size={20} className="text-info" />;
      case 'speaker': return <Mic size={20} className="text-success" />;
      default: return <Award size={20} className="text-primary" />;
    }
  };

  const getBadgeClass = (type) => {
    switch(type) {
      case 'winner': return 'bg-warning text-dark';
      case 'achievement': return 'bg-info text-white';
      case 'speaker': return 'bg-success text-white';
      default: return 'bg-primary text-white';
    }
  };

  if (loading) return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-2">Managing Certificates...</p>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Certificate Gallery 🎓</h2>
          <p className="text-muted">Manage and verify student achievements.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-ieee d-flex align-items-center" onClick={() => navigate("/admin/batch-certificates")}>
            <Plus size={18} className="me-1" /> Batch Issue
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="row mb-5">
        <div className="col-md-5 mb-3 mb-md-0">
          <div className="ieee-card p-2 glass-panel">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-0">
                <Search size={18} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Search by student, event or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3 mb-md-0 d-flex align-items-center">
          <Filter size={18} className="text-muted me-2" />
          <select 
            className="form-select border-0 shadow-sm rounded-pill px-3"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="participation">Participation</option>
            <option value="achievement">Achievement</option>
            <option value="winner">Winner</option>
            <option value="speaker">Speaker</option>
          </select>
        </div>
        <div className="col-md-3 d-flex justify-content-md-end gap-2">
          <button 
            className={`btn rounded-circle p-2 ${viewMode === 'grid' ? 'btn-ieee' : 'btn-light'}`}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid size={20} />
          </button>
          <button 
            className={`btn rounded-circle p-2 ${viewMode === 'list' ? 'btn-ieee' : 'btn-light'}`}
            onClick={() => setViewMode('list')}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="row"
          >
            {filteredCerts.map((cert, index) => (
              <motion.div 
                key={cert._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="col-lg-4 col-md-6 mb-4"
              >
                <div className="ieee-card h-100 position-relative">
                  {/* Visual Preview Placeholder */}
                  <div className="bg-light p-4 text-center border-bottom d-flex align-items-center justify-content-center" style={{ height: "120px" }}>
                    <div className="opacity-25">{getCertIcon(cert.certificateType)}</div>
                    <FileText size={48} className="position-absolute text-muted opacity-10" />
                  </div>
                  
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className={`badge ${getBadgeClass(cert.certificateType)} rounded-pill px-3`}>
                        {cert.certificateType}
                      </span>
                      <small className="text-muted fw-bold">ID: {cert._id.slice(-6)}</small>
                    </div>
                    <h5 className="fw-bold text-truncate mb-1">{cert.studentName}</h5>
                    <p className="text-muted small mb-3">{cert.eventName}</p>
                    
                    <div className="d-flex gap-2 mt-4">
                      <button className="btn btn-light btn-sm rounded-pill flex-grow-1" onClick={() => navigate(`/certificate/${cert._id}`)}>
                        <Eye size={14} className="me-1" /> View
                      </button>
                      <button className="btn btn-outline-primary btn-sm rounded-pill" onClick={() => sendEmail(cert._id, cert.studentEmail)} title="Send via Email">
                        <Mail size={14} />
                      </button>
                      <button className="btn btn-outline-success btn-sm rounded-pill" onClick={() => window.open(`http://localhost:5000/api/certificates/pdf/${cert._id}`, '_blank')} title="Download PDF">
                        <Download size={14} />
                      </button>
                      <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={() => deleteCertificate(cert._id)} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="ieee-card p-0"
          >
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="bg-light text-muted small text-uppercase">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="py-3">Event</th>
                    <th className="py-3">Type</th>
                    <th className="py-3">Date</th>
                    <th className="py-3 text-end px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCerts.map(cert => (
                    <tr key={cert._id}>
                      <td className="px-4 py-3 fw-bold">
                        <div>{cert.studentName}</div>
                        <div className="text-muted small fw-normal">{cert.studentEmail}</div>
                      </td>
                      <td className="py-3">{cert.eventName}</td>
                      <td className="py-3">
                        <span className={`badge ${getBadgeClass(cert.certificateType)} rounded-pill`}>
                          {cert.certificateType}
                        </span>
                      </td>
                      <td className="py-3 small text-muted">
                        {new Date(cert.eventDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-end px-4">
                        <div className="btn-group">
                          <button className="btn btn-sm btn-link text-primary" onClick={() => navigate(`/certificate/${cert._id}`)}><Eye size={18}/></button>
                          <button className="btn btn-sm btn-link text-info" onClick={() => sendEmail(cert._id, cert.studentEmail)}><Mail size={18}/></button>
                          <button className="btn btn-sm btn-link text-success" onClick={() => window.open(`http://localhost:5000/api/certificates/pdf/${cert._id}`, '_blank')}><Download size={18}/></button>
                          <button className="btn btn-sm btn-link text-danger" onClick={() => deleteCertificate(cert._id)}><Trash2 size={18}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredCerts.length === 0 && (
        <div className="text-center py-5">
          <Award size={48} className="text-muted mb-3 opacity-25" />
          <p className="text-muted">No certificates found matching your filters.</p>
        </div>
      )}

      <div className="mt-4">
        <button className="btn btn-secondary rounded-pill px-4" onClick={() => navigate("/admin")}>
          ← Back to Admin Panel
        </button>
      </div>
    </div>
  );
};

export default AdminCertificates;
