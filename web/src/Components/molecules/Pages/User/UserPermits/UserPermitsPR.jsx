import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "./UserPremitsPR.css";
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const UserPermitsPR = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get form data from UserPermits
  const { formData = { email: "", type: "" } } = location.state || {};

  // Detailed logging of received state
  console.log("Received state in UserPermitsPR:", {
    email: formData.email,
    type: formData.type,
  });

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
      if (!allowedTypes.includes(uploadedFile.type)) {
        Swal.fire({
          icon: "error",
          title: t("uploadRequiredTitlePR"),
          text: t("invalidFileType"),
          confirmButtonText: t("ok"),
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
    navigate("/UserPermits");
  };

  const handleNext = () => {
    if (!file) {
      Swal.fire({
        icon: "error",
        title: t("uploadRequiredTitlePR"),
        text: t("uploadRequiredMessagePR"),
        confirmButtonText: t("ok"),
      });
      return;
    }

    console.log("Navigating to UserPermitsID with:", {
      email: formData.email,
      type: formData.type,
      policeReport: { name: file.name, type: file.type, size: file.size },
    });
    navigate("/UserPermitsID", { state: { formData, policeReport: file } });
  };

  return (
    <section>
      <NavBar/>
    <div className="user-permit-pr-page">
      <h1 className="permit-pr-form-title">{t("permitFormTitlePR")}</h1>

      <div className="language-permit-pr-selector">
        <button
          onClick={() => changeLanguage("en")}
          className="language-permit-pr-btn"
        >
          English
        </button>
        <button
          onClick={() => changeLanguage("si")}
          className="language-permit-pr-btn"
        >
          සිංහල
        </button>
      </div>

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
                {t("downloadLink")}
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
            📎 {t("uploadPRButton")}
          </button>

          {file && (
            <button
              type="button"
              className="delete-permit-pr-btn"
              onClick={handleDelete}
            >
              {t("delete")}
            </button>
          )}

          <div className="navigation-permit-pr-buttons">
            <button
              type="button"
              className="back-permit-pr-btn"
              onClick={handleBack}
            >
              {t("back")}
            </button>

            <button
              type="button"
              className="next-permit-pr-btn"
              onClick={handleNext}
            >
              {t("next")}
            </button>
          </div>
        </div>
      </form>
    </div>
    <Footer/>
    </section>
  );
};

export default UserPermitsPR;