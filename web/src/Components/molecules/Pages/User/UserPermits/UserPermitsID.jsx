import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { submitPermitApplication } from "../../../../../api/permitApplication";
import "./UserPermitsID.css";
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const UserPermitsID = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const { formData = { email: "", type: "", requiredDate: "" }, policeReport } = location.state || {};

  console.log("Received state:", {
    email: formData.email,
    type: formData.type,
    requiredDate: formData.requiredDate,
    policeReport: policeReport
      ? { name: policeReport.name, type: policeReport.type, size: policeReport.size }
      : "undefined",
  });

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
      if (!allowedTypes.includes(uploadedFile.type)) {
        Swal.fire({
          icon: "error",
          title: "Upload Error",
          text: "Only PDF, PNG, or JPG files are allowed",
          confirmButtonText: "OK",
        });
        return;
      }
      setFile(uploadedFile);
      console.log("Selected ID document:", {
        name: uploadedFile.name,
        type: uploadedFile.type,
        size: uploadedFile.size,
      });
    }
  };

  const handleFileClick = () => {
    document.getElementById("file-upload").click();
  };

  const handleDelete = () => {
    setFile(null);
  };

  const handleBack = () => {
    navigate("/user_permits_pr", { state: { formData } });
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.type || !file || !policeReport || !formData.requiredDate) {
      Swal.fire({
        icon: "error",
        title: "Upload Error",
        text: "All fields are required",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!(file instanceof File) || !(policeReport instanceof File)) {
      Swal.fire({
        icon: "error",
        title: "Upload Error",
        text: "Invalid file object",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("permitType", formData.type);
      formDataToSend.append("requiredDate", formData.requiredDate);
      formDataToSend.append("document", file);
      formDataToSend.append("policeReport", policeReport);

      const formDataEntries = {};
      for (const [key, value] of formDataToSend.entries()) {
        formDataEntries[key] = value instanceof File ? { name: value.name, type: value.type, size: value.size } : value;
      }
      console.log("FormData contents:", formDataEntries);

      const response = await submitPermitApplication(formDataToSend);
      console.log("API response:", response);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Permit application submitted successfully",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/user_dashboard");
      });
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to submit application",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <NavBar />
      <div className="user-permit-id-page">
        <h1 className="permit-id-form-title">Upload ID Document</h1>

        <form className="permit-id-form-content">
          <div className="file-permit-id-upload-section">
            <input
              type="file"
              id="file-upload"
              accept=".pdf,.jpg,.png"
              onChange={handleFileChange}
              className="file-permit-id-input-field"
              style={{ display: "none" }}
            />
            {file && (
              <div className="file-permit-id-info">
                <span className="file-permit-id-name">{file.name}</span>
                <a
                  href={URL.createObjectURL(file)}
                  download={file.name}
                  className="file-permit-id-download-link"
                >
                  Download
                </a>
              </div>
            )}
          </div>

          <div className="form-permit-id-buttons-section">
            <button
              type="button"
              className="upload-permit-id-btn"
              onClick={handleFileClick}
              disabled={loading}
            >
              📎 Upload ID Document
            </button>

            {file && (
              <button
                type="button"
                className="delete-permit-id-btn"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete
              </button>
            )}

            <div className="navigation-permit-id-buttons">
              <button
                type="button"
                className="back-permit-id-btn"
                onClick={handleBack}
                disabled={loading}
              >
                Back
              </button>
              <button
                type="button"
                className="submit-permit-id-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </section>
  );
};

export default UserPermitsID;