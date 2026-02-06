import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

const ViewCertificate = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/certificates/${id}`)
      .then(res => {
        setCertificate(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Failed to load certificate");
        setLoading(false);
      });
  }, [id]);

  const downloadPDF = async () => {
    try {
      setDownloading(true);
      const response = await axios.get(
        `http://localhost:5000/api/certificates/pdf/${id}`,
        { responseType: 'blob' }
      );
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate_${certificate.studentName.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setDownloading(false);
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF");
      setDownloading(false);
    }
  };

  if (loading) {
    return <div className="container mt-5"><p>Loading certificate...</p></div>;
  }

  if (!certificate) {
    return <div className="container mt-5"><p>Certificate not found</p></div>;
  }

  return (
    <div className="container mt-5">
      <div 
        className="certificate-view card p-5" 
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundImage: certificate.backgroundImage ? `url(${certificate.backgroundImage})` : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          textAlign: "center",
          minHeight: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <h1 className="display-4 mb-4" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
          Certificate of {certificate.certificateType.charAt(0).toUpperCase() + certificate.certificateType.slice(1)}
        </h1>
        
        <h3 className="mb-3" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
          This is to certify that
        </h3>
        
        <h2 className="display-5 mb-4" style={{ 
          fontWeight: "bold", 
          textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          borderBottom: "2px solid #fff",
          display: "inline-block",
          padding: "10px 40px"
        }}>
          {certificate.studentName}
        </h2>
        
        <h4 className="mb-4" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
          has successfully {certificate.certificateType === "participation" ? "participated in" : "achieved recognition in"}
        </h4>
        
        <h3 className="mb-4" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
          <strong>{certificate.eventName}</strong>
        </h3>
        
        {certificate.description && (
          <p className="mb-4" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
            {certificate.description}
          </p>
        )}
        
        <div className="mt-4" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
          <p className="mb-2">
            <strong>Event Date:</strong> {new Date(certificate.eventDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p>
            <strong>Issued By:</strong> {certificate.issuedBy}
          </p>
        </div>

        {/* QR Code for Verification */}
        {certificate.verificationHash && (
          <div className="mt-4 d-flex justify-content-center align-items-center flex-column">
            <div className="bg-white p-3 rounded" style={{ display: 'inline-block' }}>
              <QRCodeSVG 
                value={`${window.location.origin}/verify/${certificate.verificationHash}`}
                size={120}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="mt-2 mb-0" style={{ fontSize: '12px', textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
              Scan to verify authenticity
            </p>
          </div>
        )}
      </div>

      <div className="text-center mt-4">
        <button 
          className="btn btn-success me-2" 
          onClick={downloadPDF}
          disabled={downloading}
        >
          {downloading ? "🔄 Generating PDF..." : "💾 Download PDF"}
        </button>
        <button 
          className="btn btn-primary me-2" 
          onClick={() => window.print()}
        >
          🖨️ Print Certificate
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={() => window.history.back()}
        >
          Back
        </button>
      </div>

      <style>{`
        @media print {
          .btn, button {
            display: none !important;
          }
          .certificate-view {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewCertificate;
