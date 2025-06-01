import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getProfile } from "../../../../../api/villager"; // Import getProfile
import "./UserCertificates.css";
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const UserCertificates = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "", // Will be set to logged-in user's email
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logged-in user's profile on component mount
  useEffect(() => {
    console.log("useEffect running to fetch profile");
    const loadData = async () => {
      try {
        // Fetch logged-in user's profile
        const profile = await getProfile();
        setFormData((prevData) => ({
          ...prevData,
          email: profile.Email || "", // Set email from profile
        }));
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch profile:", err.response?.data || err.message);
        setError(t("errorFetchingData") + ": " + (err.response?.data?.error || err.message));
        setLoading(false);
      }
    };
    loadData();
  }, [t]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Only allow changes to fields other than email (none in this case, but kept for consistency)
    if (name !== "email") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
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

    console.log("Navigating to UserCertificatesBC with formData:", formData);
    navigate("/user_certificates_bc", { state: { formData } });
  };

  const handleLanguageChange = (lang) => {
    console.log("Changing language to:", lang);
    changeLanguage(lang);
  };

  return (
    <section>
      <NavBar />
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
                disabled // Disable the email input
              />
            </div>

            <div className="form-certificates-group">
              <button
                type="button"
                className="upload-certificates-button"
                onClick={handleUploadClick}
                disabled={loading || !!error || !formData.email}
              >
                {t("next")}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default UserCertificates;