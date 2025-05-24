import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { submitNICApplication } from "../../../../../api/nicApplication";
import "./UserIDCardBC.css";
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const UserIDCardBC = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get form data from UserIDCard
  const { formData } = location.state || { formData: { email: "", type: "" } };

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
    navigate("/UserIDCard");
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
      formDataToSend.append("nicType", formData.type);
      formDataToSend.append("document", file);

      await submitNICApplication(formDataToSend);

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
    <section>
      <NavBar/>
    <div className="user-idcard-bc-page">
      <h1 className="idcard-bc-form-title">{t("FormTitleBC")}</h1>

      <div className="language-idcard-bc-selector">
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

      <form className="idcard-bc-form-content">
        <div className="file-idcard-bc-upload-section">
          <input
            type="file"
            id="file-upload"
            accept=".pdf,.jpg,.png"
            onChange={handleFileChange}
            className="file-idcard-bc-input-field"
            style={{ display: "none" }}
          />
          {file && (
            <div className="file-idcard-bc-info">
              <span className="file-idcard-bc-name">{file.name}</span>
              <a
                href={URL.createObjectURL(file)}
                download={file.name}
                className="file-idcard-bc-download-link"
              >
                <br />
                {t("downloadLink")}
              </a>
            </div>
          )}
        </div>

        <div className="form-idcard-bc-buttons-section">
          <button
            type="button"
            className="upload-idcard-bc-btn"
            onClick={handleFileClick}
            disabled={loading}
          >
            📎 {t("uploadBCButton")}
          </button>

          {file && (
            <button
              type="button"
              className="delete-idcard-bc-btn"
              onClick={handleDelete}
              disabled={loading}
            >
              {t("delete")}
            </button>
          )}

          <div className="navigation-idcard-bc-buttons">
            <button
              type="button"
              className="back-idcard-bc-btn"
              onClick={handleBack}
              disabled={loading}
            >
              {t("back")}
            </button>
            <button
              type="button"
              className="submit-idcard-bc-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? t("submitting") : t("submit")}
            </button>
          </div>
        </div>
      </form>
    </div>
    <Footer/>
    </section>
  );
};

export default UserIDCardBC;