import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchPermits } from "../../../../../api/permit";
import { getProfile } from "../../../../../api/villager"; // Import getProfile
import "./UserPermit.css";
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const UserPermits = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "", // Will be set to logged-in user's email
    type: "",
  });
  const [permitTypes, setPermitTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logged-in user's profile and permit types on component mount
  useEffect(() => {
    console.log("useEffect running to fetch profile and permit types");
    const loadData = async () => {
      try {
        // Fetch logged-in user's profile
        const profile = await getProfile();
        setFormData((prevData) => ({
          ...prevData,
          email: profile.Email || "", // Set email from profile
        }));

        // Fetch permit types
        const permits = await fetchPermits();
        console.log("Loaded permit types:", permits);
        setPermitTypes(permits);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err.response?.data || err.message);
        setError(t("errorFetchingData") + ": " + (err.response?.data?.error || err.message));
        setLoading(false);
      }
    };
    loadData();
  }, [t]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Only allow changes to fields other than email
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

    console.log("Navigating to UserPermitsPR with formData:", formData);
    navigate("/UserPermitsPR", { state: { formData } });
  };

  const handleLanguageChange = (lang) => {
    console.log("Changing language to:", lang);
    changeLanguage(lang);
  };

  // Map API type to translation key
  const getTranslationKey = (apiType) => {
    const translationMap = {
      "Sand Permit": "SandPermit",
      "Tree Cutting Permit": "TreeCuttingPermit",
      "Land Use Permit": "LandUsePermit",
      "Vehicle Travel Permit": "VehicleTravelPermit",
    };
    const key = translationMap[apiType] || apiType;
    console.log(`Translated ${apiType} to ${key}`);
    return key;
  };

  return (
    <section>
      <NavBar />
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
                disabled // Disable the email input
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
                  <option disabled>{t("loading") || "Loading..."}</option>
                ) : error ? (
                  <option disabled>{error}</option>
                ) : permitTypes.length === 0 ? (
                  <option disabled>{t("noPermitsAvailable") || "No permit types available"}</option>
                ) : (
                  permitTypes.map((permit) => (
                    <option key={permit.Permits_ID} value={permit.Permits_Type}>
                      {t(getTranslationKey(permit.Permits_Type))}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="form-permits-group">
              <button
                type="button"
                className="upload-permit-button"
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

export default UserPermits;