import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { submitAllowanceApplication } from "../../../../../api/allowanceApplication";
import "./UserAllowancesBC.css";
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const UserAllowancesBC = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get form data from UserAllowances
  const { formData = { email: "", type: "" } } = location.state || {};

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
      if (!allowedTypes.includes(uploadedFile.type)) {
        Swal.fire({
          title: t("uploadRequiredTitleBC"),
          text: t("uploadRequiredMessageBC"),
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
    navigate("/user_allowances", { state: { formData } });
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.type || !file) {
      Swal.fire({
        title: t("uploadRequiredTitleBC"),
        text: t("allFieldsRequired"),
        icon: "error",
        confirmButtonText: t("ok"),
      });
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("allowanceType", formData.type);
      formDataToSend.append("document", file);

      await submitAllowanceApplication(formDataToSend);

      Swal.fire({
        title: t("submissionSuccessTitle"),
        text: t("submissionSuccessMessage"),
        icon: "success",
        confirmButtonText: t("ok"),
      }).then(() => {
        navigate("/user_dashboard");
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
    <section>
      <NavBar />
      <div className="user-allowances-bc-page">
        <h1 className="allowances-bc-form-title">{t("FormTitleBC")}</h1>

        <div className="language-allowances-bc-selector">
          <button
            onClick={() => changeLanguage("en")}
            className="language-allowances-bc-btn"
          >
            English
          </button>
          <button
            onClick={() => changeLanguage("si")}
            className="language-allowances-bc-btn"
          >
            සිංහල
          </button>
        </div>

        <form className="allowances-bc-form-content">
          <div className="file-allowances-bc-upload-section">
            <input
              type="file"
              id="file-upload"
              accept=".pdf,.jpg,.png"
              onChange={handleFileChange}
              className="file-allowances-bc-input-field"
              style={{ display: "none" }}
            />
            {file && (
              <div className="file-allowances-bc-info">
                <span className="file-allowances-bc-name">{file.name}</span>
                <a
                  href={URL.createObjectURL(file)}
                  download={file.name}
                  className="file-allowances-bc-download-link"
                >
                  <br />
                  {t("downloadLink")}
                </a>
              </div>
            )}
          </div>

          <div className="form-allowances-bc-buttons-section">
            <button
              type="button"
              className="upload-allowances-bc-btn"
              onClick={handleFileClick}
              disabled={loading}
            >
              📎 {t("uploadBCButton")}
            </button>

            {file && (
              <button
                type="button"
                className="delete-allowances-bc-btn"
                onClick={handleDelete}
                disabled={loading}
              >
                {t("delete")}
              </button>
            )}

            <div className="navigation-allowances-bc-buttons">
              <button
                type="button"
                className="back-allowances-bc-btn"
                onClick={handleBack}
                disabled={loading}
              >
                {t("back")}
              </button>
              <button
                type="button"
                className="submit-allowances-bc-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? t("submitting") : t("submit")}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </section>
  );
};

export default UserAllowancesBC;