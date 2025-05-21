import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { submitCertificateApplication } from "../../../../../api/certificateApplication";
import "./UserCertificatesBC.css";

const UserCertificatesBC = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Get form data from UserCertificates
  const { formData } = location.state || { formData: { email: "" } };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
      if (!allowedTypes.includes(uploadedFile.type)) {
        Swal.fire({
          icon: "error",
          title: t("uploadRequiredTitleBC"),
          text: t("invalidFileType"),
          confirmButtonText: t("ok"),
        });
        return;
      }
      setFile(uploadedFile);
    }
  };

  const handleFileClick = () => {
    document.getElementById("file-upload").click();
  };

  const handleDelete = () => {
    setFile(null);
  };

  const handleBack = () => {
    navigate("/UserCertificates");
  };

  const handleSubmit = async () => {
    if (!file) {
      Swal.fire({
        icon: "error",
        title: t("uploadRequiredTitleBC"),
        text: t("uploadRequiredMessageBC"),
        confirmButtonText: t("ok"),
      });
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("document", file);

      await submitCertificateApplication(formDataToSend);

      Swal.fire({
        icon: "success",
        title: t("submissionSuccessTitle"),
        text: t("submissionSuccessMessage"),
        confirmButtonText: t("ok"),
      }).then(() => {
        navigate("/UserDashboard"); // Redirect to dashboard after success
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: error.error || t("submissionFailed"),
        confirmButtonText: t("ok"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-certificates-bc-page">
      <h1 className="certificates-bc-form-title">{t("FormTitleBC")}</h1>

      <div className="language-certificates-bc-selector">
        <button
          onClick={() => changeLanguage("en")}
          className="language-certificates-bc-btn"
        >
          English
        </button>
        <button
          onClick={() => changeLanguage("si")}
          className="language-certificates-bc-btn"
        >
          සිංහල
        </button>
      </div>

      <form className="certificates-bc-form-content">
        <div className="file-certificates-bc-upload-section">
          <input
            type="file"
            id="file-upload"
            accept=".pdf,.jpg,.png"
            onChange={handleFileChange}
            className="file-certificates-bc-input-field"
            style={{ display: "none" }}
          />
          {file && (
            <div className="file-certificates-bc-info">
              <span className="file-certificates-bc-name">{file.name}</span>
              <a
                href={URL.createObjectURL(file)}
                download={file.name}
                className="file-certificates-bc-download-link"
              >
                <br />
                {t("downloadLink")}
              </a>
            </div>
          )}
        </div>

        <div className="form-certificates-bc-buttons-section">
          <button
            type="button"
            className="upload-certificates-bc-btn"
            onClick={handleFileClick}
            disabled={loading}
          >
            📎 {t("uploadBCButton")}
          </button>

          {file && (
            <button
              type="button"
              className="delete-certificates-bc-btn"
              onClick={handleDelete}
              disabled={loading}
            >
              {t("delete")}
            </button>
          )}

          <div className="navigation-certificates-bc-buttons">
            <button
              type="button"
              className="back-certificates-bc-btn"
              onClick={handleBack}
              disabled={loading}
            >
              {t("back")}
            </button>
            <button
              type="button"
              className="submit-certificates-bc-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? t("submitting") : t("submit")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserCertificatesBC;