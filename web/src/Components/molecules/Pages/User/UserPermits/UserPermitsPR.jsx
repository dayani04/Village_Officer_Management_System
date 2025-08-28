import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "./UserPremitsPR.css";
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const UserPermitsPR = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { formData = { email: "", type: "", requiredDate: "" } } = location.state || {};

  console.log("Received state in UserPermitsPR:", {
    email: formData.email,
    type: formData.type,
    requiredDate: formData.requiredDate,
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
      console.log("Selected police report:", {
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
    navigate("/user_permits");
  };

  const handleNext = () => {
    if (!file) {
      Swal.fire({
        icon: "error",
        title: "Upload Error",
        text: "Please upload a police report",
        confirmButtonText: "OK",
      });
      return;
    }

    console.log("Navigating to UserPermitsID with:", {
      email: formData.email,
      type: formData.type,
      requiredDate: formData.requiredDate,
      policeReport: { name: file.name, type: file.type, size: file.size },
    });
    navigate("/user_permits_id", { state: { formData, policeReport: file } });
  };

  return (
    <section>
      <NavBar />
      <div className="user-permit-pr-page">
        <h1 className="permit-pr-form-title">Upload Police Report</h1>

        <form className="permit-pr-form-content">
          <div className="file-permit-pr-upload-section">
            <input
              type="file"
              id="file-upload"
              accept=".pdf,.jpg,.png"
              onChange={handleFileChange}
              className="file-permit-pr-input-field"
              style={{ display: "none" }}
            />
            {file && (
              <div className="file-permit-pr-info">
                <span className="file-permit-pr-name">{file.name}</span>
                <a
                  href={URL.createObjectURL(file)}
                  download={file.name}
                  className="file-permit-pr-download-link"
                >
                  Download
                </a>
              </div>
            )}
          </div>

          <div className="form-permit-pr-buttons-section">
            <button
              type="button"
              className="upload-permit-pr-btn"
              onClick={handleFileClick}
            >
              📎 Upload Police Report
            </button>

            {file && (
              <button
                type="button"
                className="delete-permit-pr-btn"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}

            <div className="navigation-permit-pr-buttons">
              <button
                type="button"
                className="back-permit-pr-btn"
                onClick={handleBack}
              >
                Back
              </button>

              <button
                type="button"
                className="next-permit-pr-btn"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </section>
  );
};

export default UserPermitsPR;