import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchAllowances } from "../../../../../api/allowance";
import { getProfile } from "../../../../../api/villager"; // Import getProfile to fetch user data
import "./UserAllowances.css";
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const UserAllowances = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "", // Will be set to logged-in user's email
    type: "",
  });
  const [allowanceTypes, setAllowanceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logged-in user's profile and allowance types on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch logged-in user's profile
        const profile = await getProfile();
        setFormData((prevData) => ({
          ...prevData,
          email: profile.Email || "", // Set email from profile
        }));

        // Fetch allowance types
        const allowances = await fetchAllowances();
        setAllowanceTypes(allowances);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(t("errorFetchingData"));
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

    navigate("/UserAllowancesBC", { state: { formData } }); // Navigate after validation
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  // Map API type to translation key
  const getTranslationKey = (apiType) => {
    switch (apiType) {
      case "Adult Allowances":
        return "adultAllowances";
      case "Disabled Allowances":
        return "disabledAllowances";
      case "Widow Allowances":
        return "WidowAllowances";
      case "Nutritional And Food Allowance":
        return "NutritionalAndFoodAllowance";
      case "Agriculture And Farming Subsidies Allowances":
        return "AgricultureandFarmingSubsidiesAllowances";
      default:
        return apiType;
    }
  };

  return (
    <section>
      <NavBar />
      <div>
        <br />
        <br />
        <h1 className="form-allowances-title">{t("allowancesFormTitle")}</h1>
        <br />
        <div className="user-allowances-container">
          <div className="language-allowances-switch">
            <button onClick={() => handleLanguageChange("en")}>English</button>
            <button onClick={() => handleLanguageChange("si")}>සිංහල</button>
          </div>

          <form className="allowances-form">
            {/* Email Input (Disabled) */}
            <div className="form-group">
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

            {/* Allowance Type Selection */}
            <div className="form-allowances-group">
              <label htmlFor="type">{t("allowancesLabel")}</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                disabled={loading || !!error}
              >
                <option value="" disabled>
                  {t("selectAllowancesType")}
                </option>
                {loading ? (
                  <option disabled>{t("loading")}</option>
                ) : error ? (
                  <option disabled>{error}</option>
                ) : (
                  allowanceTypes.map((allowance) => (
                    <option key={allowance.Allowances_ID} value={allowance.Allowances_Type}>
                      {t(getTranslationKey(allowance.Allowances_Type))}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Next Button */}
            <div className="form-allowances-group">
              <button
                type="button"
                className="upload-allowances-button"
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

export default UserAllowances;