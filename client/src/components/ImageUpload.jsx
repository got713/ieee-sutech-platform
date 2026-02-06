import { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

const ImageUpload = ({ onUpload, currentImage, label = "Upload Image" }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || "");

  // Cloudinary Upload Widget
  const openUploadWidget = () => {
    setUploading(true);

    // Create Cloudinary upload widget
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
      },
      (error, result) => {
        setUploading(false);
        if (error) {
          console.error("Upload Error:", error);
          alert("Upload failed: " + error.message);
          return;
        }

        if (result.event === "success") {
          const imageUrl = result.info.secure_url;
          setPreview(imageUrl);
          onUpload(imageUrl);
        }
      }
    );

    widget.open();
  };

  const removeImage = () => {
    setPreview("");
    onUpload("");
  };

  return (
    <div className="mb-3">
      <label className="form-label fw-bold">{label}</label>

      {preview ? (
        <div className="position-relative" style={{ maxWidth: "300px" }}>
          <img
            src={preview}
            alt="Preview"
            className="img-fluid rounded shadow-sm"
            style={{ width: "100%", height: "auto" }}
          />
          <button
            type="button"
            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
            onClick={removeImage}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className="border border-2 border-dashed rounded p-4 text-center"
          style={{ cursor: "pointer", minHeight: "150px" }}
          onClick={openUploadWidget}
        >
          {uploading ? (
            <div>
              <div className="spinner-border text-primary mb-2" role="status">
                <span className="visually-hidden">Uploading...</span>
              </div>
              <p className="text-muted">Uploading image...</p>
            </div>
          ) : (
            <div>
              <ImageIcon size={48} className="text-muted mb-2 opacity-50" />
              <p className="text-muted mb-0">
                <Upload size={16} className="me-1" />
                Click to upload image
              </p>
              <small className="text-muted">PNG, JPG, GIF up to 5MB</small>
            </div>
          )}
        </div>
      )}

      <small className="form-text text-muted">
        Recommended size: 1200x675px (16:9 ratio)
      </small>
    </div>
  );
};

export default ImageUpload;
