import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BatchCertificates = () => {
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [certificateType, setCertificateType] = useState("participation");
  const [description, setDescription] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [issuedBy, setIssuedBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return navigate("/login");

    // Fetch all members
    axios.get("http://localhost:5000/api/members", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setMembers(res.data))
      .catch(err => console.error(err));
  }, [token, navigate]);

  const toggleMember = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const selectAll = () => {
    const filteredMemberIds = filteredMembers.map(m => m._id);
    setSelectedMembers(filteredMemberIds);
  };

  const deselectAll = () => {
    setSelectedMembers([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedMembers.length === 0) {
      alert("Please select at least one member");
      return;
    }

    if (!eventName || !eventDate) {
      alert("Please fill in event name and date");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/certificates/batch/event",
        {
          memberIds: selectedMembers,
          eventName,
          eventDate,
          certificateType,
          description,
          backgroundImage,
          issuedBy
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert(
        `✅ ${response.data.message}\n\n` +
        `Success: ${response.data.success}\n` +
        `Failed: ${response.data.failed}\n\n` +
        (response.data.errors ? `Errors:\n${JSON.stringify(response.data.errors, null, 2)}` : '')
      );

      // Reset form
      setSelectedMembers([]);
      setEventName("");
      setEventDate("");
      setDescription("");
      setBackgroundImage("");
      setIssuedBy("");
      setCertificateType("participation");
      setLoading(false);

      navigate("/admin/certificates");
    } catch (err) {
      setLoading(false);
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  // Filter members based on search
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Batch Certificate Issuing 📦</h2>
      <p className="text-muted">Issue certificates to multiple members at once</p>

      <div className="row">
        {/* Left: Member Selection */}
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Select Recipients</h5>
            </div>
            <div className="card-body">
              {/* Search Bar */}
              <input
                type="text"
                className="form-control mb-3"
                placeholder="🔍 Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Select All / Deselect All */}
              <div className="mb-3">
                <button 
                  className="btn btn-sm btn-success me-2"
                  onClick={selectAll}
                  type="button"
                >
                  ✓ Select All ({filteredMembers.length})
                </button>
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={deselectAll}
                  type="button"
                >
                  ✗ Deselect All
                </button>
                <span className="ms-3 badge bg-info">
                  {selectedMembers.length} Selected
                </span>
              </div>

              {/* Members List */}
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {filteredMembers.length === 0 ? (
                  <p className="text-muted">No members found</p>
                ) : (
                  filteredMembers.map(member => (
                    <div key={member._id} className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`member-${member._id}`}
                        checked={selectedMembers.includes(member._id)}
                        onChange={() => toggleMember(member._id)}
                      />
                      <label 
                        className="form-check-label" 
                        htmlFor={`member-${member._id}`}
                        style={{ cursor: "pointer" }}
                      >
                        <strong>{member.name}</strong>
                        <br />
                        <small className="text-muted">{member.email}</small>
                        {" "}
                        <span className={`badge ${member.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                          {member.role}
                        </span>
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Certificate Details */}
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Certificate Details</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Event Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                    placeholder="e.g., AI Workshop 2024"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Event Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Certificate Type *</label>
                  <select
                    className="form-control"
                    value={certificateType}
                    onChange={(e) => setCertificateType(e.target.value)}
                    required
                  >
                    <option value="participation">Participation (+10 points)</option>
                    <option value="achievement">Achievement (+30 points)</option>
                    <option value="winner">Winner (+50 points)</option>
                    <option value="speaker">Speaker (+25 points)</option>
                  </select>
                  <small className="text-muted">
                    Points will be automatically added to member profiles
                  </small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., For active participation in the AI Workshop"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Background Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    value={backgroundImage}
                    onChange={(e) => setBackgroundImage(e.target.value)}
                    placeholder="https://example.com/background.jpg"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Issued By</label>
                  <input
                    type="text"
                    className="form-control"
                    value={issuedBy}
                    onChange={(e) => setIssuedBy(e.target.value)}
                    placeholder="e.g., IEEE SUTECH Chapter"
                  />
                </div>

                <div className="alert alert-info">
                  <strong>📋 Summary:</strong>
                  <br />
                  Recipients: <strong>{selectedMembers.length}</strong> member(s)
                  <br />
                  Type: <strong>{certificateType}</strong>
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={loading || selectedMembers.length === 0}
                >
                  {loading ? "Issuing Certificates..." : `🎓 Issue ${selectedMembers.length} Certificate(s)`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <button 
          className="btn btn-secondary"
          onClick={() => navigate("/admin/certificates")}
        >
          ← Back to Certificates
        </button>
      </div>
    </div>
  );
};

export default BatchCertificates;
