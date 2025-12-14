import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaArrowLeft } from 'react-icons/fa';
import { fetchAllowances, checkVillagerAllowanceApplication, submitAllowanceApplication } from "../../../../../api/allowance";
import { getProfile } from "../../../../../api/villager";
import "../../../../../index.css";
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
  const [appliedAllowances, setAppliedAllowances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAge, setUserAge] = useState(null);
  const [villagerId, setVillagerId] = useState(null);

  const calculateAge = (dob) => {
    if (!dob) {
      console.log("No DOB provided, returning null");
      return null;
    }
    const dobDate = new Date(dob);
    const currentDate = new Date("2025-06-19");
    const age = currentDate.getFullYear() - dobDate.getFullYear();
    const monthDiff = currentDate.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < dobDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  useEffect(() => {
    console.log("useEffect: Fetching profile, allowances, and applications");
    const loadData = async () => {
      try {
        const profile = await getProfile();
        console.log("Profile fetched:", profile);
        setFormData((prevData) => ({
          ...prevData,
          email: profile.Email || "",
        }));
        setVillagerId(profile.Villager_ID);

        const age = calculateAge(profile.DOB);
        console.log("Calculated age:", age);
        setUserAge(age);

        const allowances = await fetchAllowances();
        console.log("Raw allowance types fetched:", allowances);

        let filteredAllowances = allowances;
        if (age === null || age < 70) {
          filteredAllowances = allowances.filter(
            (allowance) => allowance.Allowances_Type !== "Adult Allowances"
          );
          console.log("Filtered allowances (age < 70 or no DOB):", filteredAllowances);
        } else {
          console.log("No filtering needed (age >= 70):", filteredAllowances);
        }

        if (filteredAllowances.length === 0) {
          console.warn("No allowance types available after filtering");
        }

        setAllowanceTypes(filteredAllowances);

        if (profile.Villager_ID) {
          const applications = await checkVillagerAllowanceApplication(profile.Villager_ID);
          const appliedTypes = applications.map((app) => app.Allowances_Type).filter(Boolean);
          console.log("Applied allowance types:", appliedTypes);
          setAppliedAllowances(appliedTypes);
        }

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

  const handleSubmit = async () => {
    if (!formData.email || !formData.type) {
      Swal.fire({
        icon: "error",
        title: t("formValidationTitle"),
        text: t("allFieldsRequired"),
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

    if (formData.type === "Adult Allowances" && (userAge === null || userAge < 70)) {
      Swal.fire({
        icon: "error",
        title: t("formValidationTitle"),
        text: t("ineligibleForAdultAllowance"),
        confirmButtonText: t("ok"),
      });
      return;
    }

    if (appliedAllowances.includes(formData.type)) {
      Swal.fire({
        icon: "error",
        title: t("formValidationTitle"),
        text: t("alreadyAppliedOnce", { type: t(getTranslationKey(formData.type)) }),
        confirmButtonText: t("ok"),
      });
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("allowanceType", formData.type);

      await submitAllowanceApplication(formDataToSend);

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
      "Adult Allowances": "adultAllowances",
      "Disabled Allowances": "disabledAllowances",
      "Widow Allowances": "widowAllowances",
      "Nutritional And Food Allowance": "nutritionalAndFoodAllowance",
      "Agriculture And Farming Subsidies Allowances": "agricultureAndFarmingSubsidiesAllowances",
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
            <h1 className="village-title">{t("allowancesFormTitle")}</h1>
          </div>
        </div>
      </div>
      <br/>

      <div>
        <div className="user-allowances-container">

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
                disabled={loading || !!error || userAge === null}
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
                    <option
                      key={allowance.Allowances_ID}
                      value={allowance.Allowances_Type}
                      disabled={appliedAllowances.includes(allowance.Allowances_Type)}
                    >
                      {t(getTranslationKey(allowance.Allowances_Type))}
                      {appliedAllowances.includes(allowance.Allowances_Type) ? ` (${t("alreadyApplied")})` : ""}
                    </option>
                  ))
                )}
              </select>
              {formData.type && (
                <p className="selected-allowance">
                  {t("selectedAllowance")}: {t(getTranslationKey(formData.type))}
                </p>
              )}
              {userAge !== null && userAge < 70 && (
                <p className="age-restriction-note">
                  {t("adultAllowanceRestriction", { age: userAge })}
                </p>
              )}
              {appliedAllowances.length > 0 && (
                <p className="applied-allowances-note">
                  {t("alreadyAppliedNoteA", {
                    types: appliedAllowances.map((type) => t(getTranslationKey(type))).join(", "),
                  })}
                </p>
              )}
            </div>

            <div className="form-allowances-group">
              <button
                type="button"
                className="submit-allowance-button"
                onClick={handleSubmit}
                disabled={loading || !!error || !formData.email || userAge === null}
              >
                {loading ? t("submitting") : t("submit")}
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