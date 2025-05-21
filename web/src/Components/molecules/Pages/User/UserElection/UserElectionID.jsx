import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { submitElectionApplication } from "../../../../../api/electionApplication";
import "./UserElectionID.css";

const UserElectionID = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get form data from UserElection
  const { formData } = location.state || { formData: { email: "", type: "" } };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
      if (!allowedTypes.includes(uploadedFile.type)) {
        Swal.fire({
          title: t("uploadRequiredTitleID"),
          text: t("uploadRequiredMessageID"),
          icon: "error",
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
    navigate("/UserElection");
  };

  const handleSubmit = async () => {
    if (!file) {
      Swal.fire({
        title: t("uploadRequiredTitleID"),
        text: t("uploadRequiredMessageID"),
        icon: "error",
        confirmButtonText: t("ok"),
      });
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("electionType", formData.type);
      formDataToSend.append("document", file);

      await submitElectionApplication(formDataToSend);

      Swal.fire({
        title: t("submissionSuccessTitle"),
        text: t("submissionSuccessMessage"),
        icon: "success",
        confirmButtonText: t("ok"),
      }).then(() => {
        navigate("/UserDashboard"); // Redirect to dashboard after success
      });
    } catch (error) {
      Swal.fire({
        title: t("error"),
        text: error.error || t("submissionFailed"),
        icon: "error",
        confirmButtonText: t("ok"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-election-id-page">
      <h1 className="election-id-form-title">{t("electionFormTitleID")}</h1>

      <div className="language-election-id-selector">
        <button
          onClick={() => changeLanguage("en")}
          className="language-election-id-btn"
        >
          English
        </button>
        <button
          onClick={() => changeLanguage("si")}
          className="language-election-id-btn"
        >
          සිංහල
        </button>
      </div>
      <p className="red-election-id-text">{t("idLicensePassportText")}</p>
      <form className="election-id-form-content">
        <div className="file-election-id-upload-section">
          <input
            type="file"
            id="file-upload"
            accept=".pdf,.jpg,.png"
            onChange={handleFileChange}
            className="file-election-id-input-field"
          />
          {file && (
            <div className="file-election-id-info">
              <span className="file-election-id-name">{file.name}</span>
              <a
                href={URL.createObjectURL(file)}
                download={file.name}
                className="file-election-id-download-link"
              >
                <br />
                {t("downloadLink")}
              </a>
            </div>
          )}
        </div>

        <div className="form-election-id-buttons-section">
          <button
            type="button"
            className="upload-election-id-btn"
            onClick={handleFileClick}
            disabled={loading}
          >
            📎 {t("uploadIDButton")}
          </button>

          {file && (
            <button
              type="button"
              className="delete-election-id-btn"
              onClick={handleDelete}
              disabled={loading}
            >
              {t("delete")}
            </button>
          )}

          <div className="navigation-election-id-buttons">
            <button
              type="button"
              className="back-election-id-btn"
              onClick={handleBack}
              disabled={loading}
            >
              {t("back")}
            </button>
            <button
              type="button"
              className="submit-election-id-btn"
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

export default UserElectionID;