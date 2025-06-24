import React, { useState } from "react";
import axios from "axios";

function App() {
  const [images, setImages] = useState([]);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [zoomedImage, setZoomedImage] = useState(null);

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const imageFiles = selectedFiles.filter((file) => file.type.startsWith("image/"));
    setImages((prev) => [...prev, ...imageFiles]);
    setStatus("");
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!email) {
      setStatus("⚠️ Please enter your email.");
      return;
    }

    if (images.length === 0) {
      setStatus("⚠️ Please select at least one image.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    images.forEach((img) => formData.append("images", img));

    try {
      setStatus("⏳ Uploading...");
      await axios.post("https://sem89.app.n8n.cloud/webhook-test/upload-claim-form", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("✅ Upload successful!");
      setImages([]);
      setEmail("");
    } catch (err) {
      setStatus("❌ Upload failed.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>📤 Submit Your Claim</h1>

        <div style={styles.section}>
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={styles.input}
          />
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Upload Images</label>
          <input type="file" accept="image/*" multiple onChange={handleChange} style={styles.fileInput} />
        </div>

        {images.length > 0 && (
          <div style={styles.grid}>
            {images.map((file, index) => (
              <div key={index} style={styles.card}>
                <div onClick={() => setZoomedImage(URL.createObjectURL(file))} style={{ cursor: "zoom-in" }}>
                  <img src={URL.createObjectURL(file)} alt={`preview-${index}`} style={styles.image} />
                </div>
                <p style={styles.filename}>{file.name}</p>
                <button onClick={() => handleRemoveImage(index)} style={styles.removeBtn}>
                  ✖
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleUpload}
          style={{
            ...styles.uploadBtn,
            backgroundColor: email && images.length > 0 ? "#3b82f6" : "#cbd5e1",
            cursor: email && images.length > 0 ? "pointer" : "not-allowed",
          }}
          disabled={!email || images.length === 0}
        >
          🚀 Submit Claim
        </button>

        {status && (
          <p
            style={{
              ...styles.status,
              color: status.includes("fail") || status.includes("❌") || status.includes("⚠️") ? "#dc2626" : "#16a34a",
            }}
          >
            {status}
          </p>
        )}
      </div>

      {zoomedImage && (
        <div style={styles.modal} onClick={() => setZoomedImage(null)}>
          <img src={zoomedImage} alt="zoomed" style={styles.modalImage} />
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "4rem 1rem",
    fontFamily: "system-ui, sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "720px",
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: "700",
    marginBottom: "2rem",
    color: "#0f172a",
  },
  section: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
    color: "#334155",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    paddingRight: "1rem", // Ensure right padding
    fontSize: "1rem",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box",
  },
  fileInput: {
    display: "block",
    fontSize: "0.95rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  card: {
    position: "relative",
    backgroundColor: "#f1f5f9",
    borderRadius: "10px",
    padding: "0.5rem",
    border: "1px solid #cbd5e1",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "100px",
    objectFit: "cover",
    borderRadius: "6px",
    marginBottom: "0.5rem",
  },
  filename: {
    fontSize: "0.75rem",
    color: "#475569",
    wordBreak: "break-word",
  },
  removeBtn: {
    position: "absolute",
    top: "6px",
    right: "6px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    cursor: "pointer",
    fontSize: "14px",
    lineHeight: "24px",
    padding: 0,
  },
  uploadBtn: {
    padding: "0.75rem 1.5rem",
    border: "none",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "8px",
    transition: "background-color 0.3s ease",
    width: "100%",
  },
  status: {
    marginTop: "1rem",
    fontSize: "0.95rem",
    fontWeight: "500",
    textAlign: "center",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    cursor: "zoom-out",
  },
  modalImage: {
    maxWidth: "90vw",
    maxHeight: "90vh",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  },
};

export default App;
