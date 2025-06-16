import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { submitPermitApplication } from "../../../../../api/permitApplication";
import "./UserPermitsID.css";
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const UserPermitsID = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Get form data and police report from UserPermitsPR
  const { formData = { email: "", type: "" }, policeReport } = location.state || {};

  // Detailed logging of received state
  console.log("Received state:", {
    email: formData.email,
    type: formData.type,
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
          title: t("uploadRequiredTitleID"),
          text: t("invalidFileType"),
          confirmButtonText: t("ok"),
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
    if (!formData.email || !formData.type || !file || !policeReport) {
      Swal.fire({
        icon: "error",
        title: t("uploadRequiredTitleID"),
        text: t("allFieldsRequired"),
        confirmButtonText: t("ok"),
      });
      return;
    }

    if (!(file instanceof File) || !(policeReport instanceof File)) {
      Swal.fire({
        icon: "error",
        title: t("uploadRequiredTitleID"),
        text: t("invalidFileObject"),
        confirmButtonText: t("ok"),
      });
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("permitType", formData.type);
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
        title: t("submissionSuccessTitle"),
        text: t("submissionSuccessMessage"),
        confirmButtonText: t("ok"),
      }).then(() => {
        navigate("/user_dashboard");
      });
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: typeof error === "string" ? error : t("submissionFailed"),
        confirmButtonText: t("ok"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <NavBar />
      <div className="user-permit-id-page">
        <h1 className="permit-id-form-title">{t("permitFormTitleID")}</h1>

        <div className="language-permit-id-selector">
          <button onClick={() => changeLanguage("en")} className="language-permit-id-btn">
            English
          </button>
          <button onClick={() => changeLanguage("si")} className="language-permit-id-btn">
            සිංහල
          </button>
        </div>

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
                  <br />
                  {t("downloadLink")}
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
              📎 {t("uploadIDButton")}
            </button>

            {file && (
              <button
                type="button"
                className="delete-permit-id-btn"
                onClick={handleDelete}
                disabled={loading}
              >
                {t("delete")}
              </button>
            )}

            <div className="navigation-permit-id-buttons">
              <button
                type="button"
                className="back-permit-id-btn"
                onClick={handleBack}
                disabled={loading}
              >
                {t("back")}
              </button>
              <button
                type="button"
                className="submit-permit-id-btn"
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

export default UserPermitsID;
