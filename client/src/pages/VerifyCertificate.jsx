import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyCertificate = () => {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify certificate
    axios.get(`http://localhost:5000/api/certificates/verify/${hash}`)
      .then(res => {
        setResult(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setResult({
          verified: false,
          message: err.response?.data?.message || "Verification failed"
        });
        setLoading(false);
      });
  }, [hash]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Verifying...</span>
        </div>
        <p className="mt-3">Verifying certificate...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {result.verified ? (
            <div className="card border-success">
              <div className="card-header bg-success text-white text-center">
                <h3 className="mb-0">✅ Certificate Verified</h3>
              </div>
              <div className="card-body">
                <div className="alert alert-success">
                  <strong>Authentic Certificate!</strong> This certificate has been verified and is genuine.
                </div>

                <h4 className="mt-4 mb-3">Certificate Details:</h4>
                
                <div className="row mb-3">
                  <div className="col-md-4"><strong>Student Name:</strong></div>
                  <div className="col-md-8">{result.certificate.studentName}</div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4"><strong>Student Email:</strong></div>
                  <div className="col-md-8">{result.certificate.studentEmail}</div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4"><strong>Event Name:</strong></div>
                  <div className="col-md-8"><span className="badge bg-primary">{result.certificate.eventName}</span></div>
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
                  <div className="col-md-4"><strong>Issued By:</strong></div>
                  <div className="col-md-8">{result.certificate.issuedBy}</div>
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

                <div className="mt-4 text-center">
                  <button 
                    className="btn btn-primary me-2"
                    onClick={() => navigate(`/certificate/${result.certificate.certificateId}`)}
                  >
                    View Full Certificate
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => navigate('/')}
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card border-danger">
              <div className="card-header bg-danger text-white text-center">
                <h3 className="mb-0">❌ Verification Failed</h3>
              </div>
              <div className="card-body">
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

                <div className="mt-4 text-center">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => navigate('/')}
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
