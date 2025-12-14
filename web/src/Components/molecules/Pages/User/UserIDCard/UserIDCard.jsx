import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaArrowLeft } from 'react-icons/fa';
import { fetchNICs, submitNICApplication } from "../../../../../api/nic";
import { getProfile } from "../../../../../api/villager";
import "./UserIDCard.css";
import "../../../../../index.css";
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

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
  const [userAge, setUserAge] = useState(null);

  const calculateAge = (dob) => {
    if (!dob) {
      console.log("No DOB provided, returning null");
      return null;
    }
    const dobDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - dobDate.getFullYear();
    const monthDiff = currentDate.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < dobDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  useEffect(() => {
    console.log("useEffect running to fetch profile and NIC types");
    const loadData = async () => {
      try {
        const profile = await getProfile();
        console.log("Profile fetched:", profile);
        setFormData((prevData) => ({
          ...prevData,
          email: profile.Email || "",
        }));

        const age = calculateAge(profile.DOB);
        console.log("Calculated age:", age);
        setUserAge(age);

        const nics = await fetchNICs();
        console.log("Raw NIC types fetched:", nics);

        let filteredNics = nics;
        if (age !== null) {
          if (age <= 15) {
            filteredNics = nics.filter((nic) => nic.NIC_Type === "postal ID Card");
            console.log("Filtered NICs (age <= 15):", filteredNics);
          } else if (age >= 16) {
            filteredNics = nics.filter((nic) => nic.NIC_Type === "National ID Card");
            console.log("Filtered NICs (age >= 16):", filteredNics);
          }
        } else {
          console.warn("No DOB available, showing no NIC types");
          filteredNics = [];
        }

        if (filteredNics.length === 0 && age !== null) {
          console.warn("No NIC types available after filtering");
        }

        setNicTypes(filteredNics);
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
    console.log(`Input changed: ${name} = ${value}`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    if (userAge !== null) {
      if (userAge <= 15 && formData.type !== "postal ID Card") {
        Swal.fire({
          icon: "error",
          title: t("formValidationTitle"),
          text: t("ineligibleForNationalID"),
          confirmButtonText: t("ok"),
        });
        return;
      }
      if (userAge >= 16 && formData.type !== "National ID Card") {
        Swal.fire({
          icon: "error",
          title: t("formValidationTitle"),
          text: t("ineligibleForPostalID"),
          confirmButtonText: t("ok"),
        });
        return;
      }
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("nicType", formData.type);

      await submitNICApplication(formDataToSend);

      Swal.fire({
        title: t("submissionSuccessTitle"),
        text: t("submissionSuccessMessage"),
        icon: "success",
        confirmButtonText: t("ok"),
      }).then(() => {
        navigate("/user_dashboard");
      });
    } catch (error) {
      Swal.fire({
        title: t("error"),
        text: error.error || t("submissionFailed"),
        icon: "error",
        confirmButtonText: t("ok"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lang) => {
    console.log("Changing language to:", lang);
    changeLanguage(lang);
  };

  const handleBack = () => {
    navigate('/user_dashboard');
  };

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
      <br/>
      <div className="profile-hero">
        <button className="back-button" onClick={handleBack} title="Back to Dashboard">
          <FaArrowLeft />
        </button>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="village-title">{t("idcardFormTitle")}</h1>
          </div>
        </div>
      </div>
      <br/>

      <div>
        <div className="user-idcard-container">


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
                disabled
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
                disabled={loading || !!error || userAge === null}
              >
                <option value="" disabled>
                  {t("selectIDCardType")}
                </option>
                {loading ? (
                  <option disabled>{t("loading") || "Loading..."}</option>
                ) : error ? (
                  <option disabled>{error}</option>
                ) : userAge === null ? (
                  <option disabled>{t("noDOBAvailable") || "Date of birth not available"}</option>
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
              {formData.type && (
                <p className="selected-idcard">
                  {t("selectedIDCard")}: {t(getTranslationKey(formData.type))}
                </p>
              )}
              {userAge !== null && (
                <p className="age-restriction-note">
                  {userAge <= 15
                    ? t("postalIDRestriction", { age: userAge })
                    : t("nationalIDRestriction", { age: userAge })}
                </p>
              )}
            </div>

            <div className="form-idcard-group">
              <button
                type="button"
                className="submit-idcard-button"
                onClick={handleSubmit}
                disabled={loading || !!error || !formData.email || userAge === null}
              >
                {loading ? t("submitting") || "Submitting..." : t("submit") || "Submit"}
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