import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchAllowances } from "../../../../../api/allowance";
import { getProfile } from "../../../../../api/villager";
import "./UserAllowances.css";
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const UserAllowances = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    type: "",
  });
  const [allowanceTypes, setAllowanceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logged-in user's profile and allowance types on component mount
  useEffect(() => {
    console.log("useEffect running to fetch profile and allowance types");
    const loadData = async () => {
      try {
        // Fetch logged-in user's profile
        const profile = await getProfile();
        setFormData((prevData) => ({
          ...prevData,
          email: profile.Email || "",
        }));

        // Fetch allowance types
        const allowances = await fetchAllowances();
        console.log("Loaded allowance types:", allowances);
        setAllowanceTypes(allowances);
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

    console.log("Navigating to UserAllowancesBC with formData:", formData);
    navigate("/user_allowances_bc", { state: { formData } });
  };

  const handleLanguageChange = (lang) => {
    console.log("Changing language to:", lang);
    changeLanguage(lang);
  };

  // Map API type to translation key
  const getTranslationKey = (apiType) => {
    const translationMap = {
      "Adult Allowances": "adultAllowances",
      "Disabled Allowances": "disabledAllowances",
      "Widow Allowances": "WidowAllowances",
      "Nutritional And Food Allowance": "NutritionalAndFoodAllowance",
      "Agriculture And Farming Subsidies Allowances": "AgricultureandFarmingSubsidiesAllowances",
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
        <h1 className="form-allowances-title">{t("allowancesFormTitle")}</h1>
        <br />
        <div className="user-allowances-container">
          <div className="language-allowances-switch">
            <button onClick={() => handleLanguageChange("en")}>English</button>
            <button onClick={() => handleLanguageChange("si")}>සිංහල</button>
          </div>

          <form className="allowances-form">
            <div className="form-allowances-group">
              <label htmlFor="email">{t("emailLabel")}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t("emailPlaceholder")}
                required
                disabled
              />
            </div>

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
                  <option disabled>{t("loading") || "Loading..."}</option>
                ) : error ? (
                  <option disabled>{error}</option>
                ) : allowanceTypes.length === 0 ? (
                  <option disabled>{t("noAllowancesAvailable") || "No allowance types available"}</option>
                ) : (
                  allowanceTypes.map((allowance) => (
                    <option key={allowance.Allowances_ID} value={allowance.Allowances_Type}>
                      {t(getTranslationKey(allowance.Allowances_Type))}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="form-allowances-group">
              <button
                type="button"
                className="upload-allowance-button"
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