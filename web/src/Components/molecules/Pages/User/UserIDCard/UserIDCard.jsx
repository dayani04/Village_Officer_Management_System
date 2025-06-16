import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchNICs } from "../../../../../api/nic";
import { getProfile } from "../../../../../api/villager"; // Import getProfile
import "./UserIDCard.css";
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const UserIDCard = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "", // Will be set to logged-in user's email
    type: "",
  });
  const [nicTypes, setNicTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logged-in user's profile and NIC types on component mount
  useEffect(() => {
    console.log("useEffect running to fetch profile and NIC types");
    const loadData = async () => {
      try {
        // Fetch logged-in user's profile
        const profile = await getProfile();
        setFormData((prevData) => ({
          ...prevData,
          email: profile.Email || "", // Set email from profile
        }));

        // Fetch NIC types
        const nics = await fetchNICs();
        console.log("Loaded NIC types:", nics);
        setNicTypes(nics);
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

  const handleUploadClick = (e) => {
    e.preventDefault();

    // Validation
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

    console.log("Navigating to UserIDCardBC with formData:", formData);
    navigate("/user_id_card_bc", { state: { formData } });
  };

  const handleLanguageChange = (lang) => {
    console.log("Changing language to:", lang);
    changeLanguage(lang);
  };

  // Map API type to translation key
  const getTranslationKey = (apiType) => {
    const translationMap = {
      "postal ID Card": "postalIdCard",
      "National ID Card": "NationalIdCard",
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
        <h1 className="form-idcard-title">{t("idcardFormTitle")}</h1>
        <br />
        <div className="user-idcard-container">
          <div className="language-idcard-switch">
            <button onClick={() => handleLanguageChange("en")}>English</button>
            <button onClick={() => handleLanguageChange("si")}>සිංහල</button>
          </div>

          <form className="election-idcard-form">
            <div className="form-idcard-group">
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

            <div className="form-idcard-group">
              <label htmlFor="type">{t("typeIDcardLabel")}</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                disabled={loading || !!error}
              >
                <option value="" disabled>
                  {t("selectIDCardType")}
                </option>
                {loading ? (
                  <option disabled>{t("loading") || "Loading..."}</option>
                ) : error ? (
                  <option disabled>{error}</option>
                ) : nicTypes.length === 0 ? (
                  <option disabled>{t("noNICsAvailable") || "No NIC types available"}</option>
                ) : (
                  nicTypes.map((nic) => (
                    <option key={nic.NIC_ID} value={nic.NIC_Type}>
                      {t(getTranslationKey(nic.NIC_Type))}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="form-idcard-group">
              <button
                type="button"
                className="upload-idcard-button"
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

export default UserIDCard;