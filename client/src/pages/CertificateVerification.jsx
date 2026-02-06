import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  QrCode, Search, ShieldCheck, FileText, Camera, 
  CheckCircle, AlertCircle, ArrowLeft, ScanFace
} from "lucide-react";

const CertificateVerification = () => {
  const navigate = useNavigate();
  const [verificationMode, setVerificationMode] = useState("search"); // search or scan
  const [searchInput, setSearchInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setError("Please enter a certificate ID or hash");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Try to verify the certificate
      const res = await axios.get(`http://localhost:5000/api/certificates/verify/${searchInput}`);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult({
        verified: false,
        message: err.response?.data?.message || "Verification failed"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScan = () => {
    // In a real implementation, this would open camera for QR scanning
    // For now, let's simulate the QR scanning capability
    setVerificationMode("qr-input");
  };

  const handleQrSubmit = (qrData) => {
    setSearchInput(qrData);
    setVerificationMode("search");
    setTimeout(() => {
      document.getElementById("verify-btn")?.click();
    }, 100);
  };

  const resetVerification = () => {
    setVerificationMode("search");
    setSearchInput("");
    setResult(null);
    setError("");
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-5"
      >
        <h2 className="display-5 mb-3">
          <ShieldCheck className="me-3 text-primary" size={48} />
          Certificate Verification
        </h2>
        <p className="text-muted lead">
          Verify the authenticity of IEEE SUTECH certificates using QR codes or certificate IDs
        </p>
      </motion.div>

      {/* Verification Modes */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="row justify-content-center"
      >
        <div className="col-lg-8">
          {/* Mode Selection */}
          <div className="d-flex justify-content-center gap-3 mb-4">
            <button 
              className={`btn ${verificationMode === "search" ? "btn-ieee" : "btn-outline-ieee"}`}
              onClick={() => setVerificationMode("search")}
            >
              <Search size={18} className="me-2" />
              Search by ID
            </button>
            <button 
              className={`btn ${verificationMode === "scan" ? "btn-ieee" : "btn-outline-ieee"}`}
              onClick={handleScan}
            >
              <QrCode size={18} className="me-2" />
              Scan QR Code
            </button>
          </div>

          {/* Search Mode */}
          {verificationMode === "search" && (
            <div className="ieee-card p-4 mb-4">
              <h4 className="mb-3 d-flex align-items-center">
                <Search size={20} className="me-2 text-primary" />
                Verify Certificate by ID
              </h4>
              <p className="text-muted mb-4">
                Enter the certificate ID or verification hash to verify its authenticity
              </p>
              
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <FileText size={20} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter certificate ID or hash..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button 
                  className="btn btn-ieee"
                  onClick={handleSearch}
                  id="verify-btn"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} className="me-2" />
                      Verify
                    </>
                  )}
                </button>
              </div>
              
              {error && (
                <div className="alert alert-danger">
                  <AlertCircle size={18} className="me-2" />
                  {error}
                </div>
              )}
            </div>
          )}

          {/* QR Scan Mode */}
          {verificationMode === "qr-input" && (
            <div className="ieee-card p-4 mb-4">
              <h4 className="mb-3 d-flex align-items-center">
                <QrCode size={20} className="me-2 text-primary" />
                Scan QR Code
              </h4>
              <p className="text-muted mb-4">
                Use your device camera to scan the QR code on the certificate
              </p>
              
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <div className="border rounded-3 p-4 bg-light" style={{ width: '200px', height: '200px' }}>
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <Camera size={64} className="text-muted" />
                    </div>
                  </div>
                  <div className="position-absolute top-0 start-0 w-100 h-100 border border-2 border-success rounded-3" style={{ pointerEvents: 'none', display: 'none' }}>
                  </div>
                </div>
                <p className="mt-3 text-muted">Point your camera at the QR code</p>
              </div>
              
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <QrCode size={20} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Or paste QR code content here..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button 
                  className="btn btn-ieee"
                  onClick={() => searchInput && handleQrSubmit(searchInput)}
                  disabled={!searchInput}
                >
                  <CheckCircle size={18} className="me-2" />
                  Submit
                </button>
              </div>
              
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => setVerificationMode("search")}
              >
                <ArrowLeft size={18} className="me-2" />
                Back to Search
              </button>
            </div>
          )}

          {/* Verification Result */}
          {result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`ieee-card p-4 ${result.verified ? 'border-start border-4 border-success' : 'border-start border-4 border-danger'}`}
            >
              <div className="d-flex align-items-center mb-3">
                {result.verified ? (
                  <CheckCircle size={32} className="text-success me-3" />
                ) : (
                  <AlertCircle size={32} className="text-danger me-3" />
                )}
                <h4 className="mb-0">
                  {result.verified ? "Certificate Verified" : "Verification Failed"}
                </h4>
              </div>

              {result.verified ? (
                <div>
                  <div className="alert alert-success">
                    <strong>Authentic Certificate!</strong> This certificate has been verified and is genuine.
                  </div>

                  <h5 className="mt-4 mb-3">Certificate Details:</h5>
                  
                  <div className="row mb-3">
                    <div className="col-md-4"><strong>Student Name:</strong></div>
                    <div className="col-md-8">{result.certificate.studentName}</div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4"><strong>Event Name:</strong></div>
                    <div className="col-md-8">
                      <span className="badge bg-primary">{result.certificate.eventName}</span>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4"><strong>Event Date:</strong></div>
                    <div className="col-md-8">
                      {new Date(result.certificate.eventDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4"><strong>Certificate Type:</strong></div>
                    <div className="col-md-8">
                      <span className={`badge ${
                        result.certificate.certificateType === 'winner' ? 'bg-warning text-dark' :
                        result.certificate.certificateType === 'achievement' ? 'bg-success' :
                        result.certificate.certificateType === 'speaker' ? 'bg-info' :
                        'bg-primary'
                      }`}>
                        {result.certificate.certificateType.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4"><strong>Issued On:</strong></div>
                    <div className="col-md-8">
                      {new Date(result.certificate.issuedOn).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4"><strong>Certificate ID:</strong></div>
                    <div className="col-md-8">
                      <code>{result.certificate.certificateId}</code>
                    </div>
                  </div>

                  <div className="mt-4 d-flex gap-3">
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate(`/certificate/${result.certificate.certificateId}`)}
                    >
                      View Full Certificate
                    </button>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={resetVerification}
                    >
                      Verify Another
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="alert alert-danger">
                    <strong>Invalid Certificate!</strong> This certificate could not be verified.
                  </div>

                  <p className="mb-3">
                    <strong>Reason:</strong> {result.message}
                  </p>

                  <p className="text-muted">
                    This could mean:
                  </p>
                  <ul className="text-muted">
                    <li>The QR code or verification link is invalid</li>
                    <li>The certificate does not exist in our system</li>
                    <li>The certificate may have been revoked</li>
                  </ul>

                  <div className="mt-4">
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={resetVerification}
                    >
                      Try Another Verification
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Trust Indicators */}
          {!result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="ieee-card p-4 mt-4"
            >
              <h5 className="mb-4 text-center">Why Verify Certificates?</h5>
              <div className="row text-center">
                <div className="col-md-4 mb-3">
                  <div className="bg-light rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <ShieldCheck size={24} className="text-primary" />
                  </div>
                  <h6>Authenticity</h6>
                  <p className="text-muted small mb-0">Ensure certificates are genuine and issued by IEEE SUTECH</p>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="bg-light rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <ScanFace size={24} className="text-success" />
                  </div>
                  <h6>Quick Verification</h6>
                  <p className="text-muted small mb-0">Instant verification using QR codes or certificate IDs</p>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="bg-light rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <CheckCircle size={24} className="text-warning" />
                  </div>
                  <h6>Trust & Credibility</h6>
                  <p className="text-muted small mb-0">Build confidence in certificate authenticity</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CertificateVerification;