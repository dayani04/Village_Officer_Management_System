import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchNICs } from "../../../../../api/nic";
import "./UserIDCard.css";

const UserIDCard = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    type: "",
  });
  const [nicTypes, setNicTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch NIC types when component mounts
  useEffect(() => {
    const loadNICs = async () => {
      try {
        const nics = await fetchNICs();
        setNicTypes(nics);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch NIC types:", err);
        setError(t("errorFetchingNICs"));
        setLoading(false);
      }
    };
    loadNICs();
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

    navigate("/UserIDCardBC", { state: { formData } }); // Navigate after success
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  // Map API type to translation key
  const getTranslationKey = (apiType) => {
    switch (apiType) {
      case "postal ID Card":
        return "postalIdCard";
      case "National ID Card":
        return "NationalIdCard";
      default:
        return apiType;
    }
  };

  return (
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
                <option disabled>{t("loading")}</option>
              ) : error ? (
                <option disabled>{error}</option>
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
              disabled={loading || !!error}
            >
              {t("next")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserIDCard;