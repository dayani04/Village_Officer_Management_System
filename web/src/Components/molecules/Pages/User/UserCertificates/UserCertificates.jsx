import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./UserCertificates.css";
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const UserCertificates = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUploadClick = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.email) {
      Swal.fire({
        icon: "error",
        title: t("formValidationTitle"),
        text: t("formValidationMessage"),
        confirmButtonText: t("ok"),
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      Swal.fire({
        icon: "error",
        title: t("validationErrorTitle"),
        text: t("invalidEmail"),
        confirmButtonText: t("ok"),
      });
      return;
    }

    // Navigate to next page with form data
    navigate("/UserCertificatesBC", { state: { formData } });
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  return (
    <section>
      <NavBar/>
    <div>
      <br />
      <br />
      <h1 className="form-title">{t("certificatesFormTitle")}</h1>
      <br />
      <div className="user-certificates-container">
        <div className="language-certificates-switch">
          <button onClick={() => handleLanguageChange("en")}>English</button>
          <button onClick={() => handleLanguageChange("si")}>සිංහල</button>
        </div>

        <form className="certificates-form">
          <div className="form-certificates-group">
            <label htmlFor="email">{t("emailLabel")}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t("emailPlaceholder")}
              required
            />
          </div>

          <div className="form-certificates-group">
            <button
              type="button"
              className="upload-certificates-button"
              onClick={handleUploadClick}
            >
              {t("next")}
            </button>
          </div>
        </form>
      </div>
    </div>
    <Footer/>
    </section>
  );
};

export default UserCertificates;