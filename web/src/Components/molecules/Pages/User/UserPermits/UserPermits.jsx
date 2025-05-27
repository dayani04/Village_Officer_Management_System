import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchPermits } from "../../../../../api/permit";
import "./UserPermit.css";
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const UserPermits = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    type: "",
  });
  const [permitTypes, setPermitTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPermits = async () => {
      try {
        const permits = await fetchPermits();
        setPermitTypes(permits);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch permit types:", err);
        setError(t("errorFetchingPermits"));
        setLoading(false);
      }
    };
    loadPermits();
  }, [t]);

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

  const handleUploadClick = () => {
    if (!formData.email || !formData.type) {
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
        title: t("formValidationTitle"),
        text: t("invalidEmail"),
        confirmButtonText: t("ok"),
      });
      return;
    }

    navigate("/UserPermitsPR", { state: { formData } });
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  const getTranslationKey = (apiType) => {
    switch (apiType) {
      case "Sand Permit":
        return "SandPermit";
      case "Tree Cutting Permit":
        return "TreeCuttingPermit";
      case "Land Use Permit":
        return "LandUsePermit";
      case "Vehicle Travel Permit":
        return "VehicleTravelPermit";
      default:
        return apiType;
    }
  };

  return (
    <section>
      <NavBar/>
    <div>
      <br />
      <br />
      <h1 className="form-permits-title">{t("permitsFormTitle")}</h1>
      <br />
      <div className="user-permits-container">
        <div className="language-permits-switch">
          <button onClick={() => handleLanguageChange("en")}>English</button>
          <button onClick={() => handleLanguageChange("si")}>සිංහල</button>
        </div>

        <form className="permits-form">
          <div className="form-permits-group">
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

          <div className="form-permits-group">
            <label htmlFor="type">{t("permittypeLabel")}</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              disabled={loading || !!error}
            >
              <option value="" disabled>
                {t("selectPermitType")}
              </option>
              {loading ? (
                <option disabled>{t("loading")}</option>
              ) : error ? (
                <option disabled>{error}</option>
              ) : (
                permitTypes.map((permit) => (
                  <option key={permit.Permits_ID} value={permit.Permits_Type}>
                    {t(getTranslationKey(permit.Permits_Type))}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="form-permit-group">
            <button
              type="button"
              className="upload-permit-button"
              onClick={handleUploadClick}
              disabled={loading || !!error}
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

export default UserPermits;