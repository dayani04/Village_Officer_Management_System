import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchElections, fetchElectionNotifications, checkVillagerElectionApplication, submitElectionApplication } from "../../../../../api/election";
import { getProfile } from "../../../../../api/villager";
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";
import "./UserElection.css";

const UserElection = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    type: "",
  });
  const [electionTypes, setElectionTypes] = useState([]);
  const [allowedElectionTypes, setAllowedElectionTypes] = useState([]);
  const [appliedElections, setAppliedElections] = useState([]);
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
    const currentDate = new Date();
    const age = currentDate.getFullYear() - dobDate.getFullYear();
    const monthDiff = currentDate.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < dobDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  useEffect(() => {
    console.log("useEffect running to fetch profile, elections, notifications, and applications");
    const loadData = async () => {
      try {
        const profile = await getProfile();
        setFormData((prevData) => ({
          ...prevData,
          email: profile.Email || "",
        }));
        setVillagerId(profile.Villager_ID);

        const age = calculateAge(profile.DOB);
        console.log("Calculated age:", age);
        setUserAge(age);

        const [elections, notifications] = await Promise.all([
          fetchElections(),
          fetchElectionNotifications(),
        ]);
        console.log("Loaded elections:", elections);
        console.log("Loaded election notifications:", notifications);
        setElectionTypes(elections);

        const allowedTypes = notifications.map((notif) => notif.Type);
        console.log("Allowed election types from notifications:", allowedTypes);
        setAllowedElectionTypes(allowedTypes);

        if (profile.Villager_ID) {
          const applicationPromises = elections.map((election) =>
            checkVillagerElectionApplication(profile.Villager_ID, election.Type)
          );
          const applicationsArray = await Promise.all(applicationPromises);
          const appliedTypes = applicationsArray
            .flat()
            .map((app) => app.Type)
            .filter(Boolean);
          console.log("Applied election types:", appliedTypes);
          setAppliedElections(appliedTypes);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.type) {
      Swal.fire({
        title: t("formValidationTitle"),
        text: t("allFieldsRequired"),
        icon: "error",
        confirmButtonText: t("ok"),
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      Swal.fire({
        title: t("formValidationTitle"),
        text: t("invalidEmail"),
        icon: "error",
        confirmButtonText: t("ok"),
      });
      return;
    }

    if (userAge === null || userAge < 17) {
      Swal.fire({
        title: t("formValidationTitle"),
        text: t("ageRestrictionMessage", { age: userAge || "unknown" }),
        icon: "error",
        confirmButtonText: t("ok"),
      });
      return;
    }

    if (!allowedElectionTypes.includes(formData.type)) {
      Swal.fire({
        title: t("formValidationTitle"),
        text: t("electionNotAllowed"),
        icon: "error",
        confirmButtonText: t("ok"),
      });
      return;
    }

    if (appliedElections.includes(formData.type)) {
      Swal.fire({
        title: t("formValidationTitle"),
        text: t("alreadyApplied", { type: t(getTranslationKey(formData.type)) }),
        icon: "error",
        confirmButtonText: t("ok"),
      });
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("electionType", formData.type);

      await submitElectionApplication(formDataToSend);

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

  const getTranslationKey = (apiType) => {
    const translationMap = {
      "Presidential Election": "presidentialElection",
      "Parliament Election": "parliamentElection",
      "Local Election": "localElection",
      "Division Election": "divisionElection",
    };
    const key = translationMap[apiType] || apiType;
    console.log(`Translated ${apiType} to ${key}`);
    return key;
  };

  console.log("Rendering with electionTypes:", electionTypes);
  return (
    <section>
      <NavBar />
      <div>
        <br />
        <br />
        <h1 className="form-title">{t("electionFormTitle")}</h1>
        <br />
        <div className="user-election-container">
          <div className="language-switch">
            <button onClick={() => handleLanguageChange("en")}>English</button>
            <button onClick={() => handleLanguageChange("si")}>සිංහල</button>
          </div>

          <form className="election-form">
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
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">{t("typeLabel")}</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                disabled={loading || !!error || userAge === null || userAge < 17}
              >
                <option value="" disabled>
                  {t("selectType")}
                </option>
                {loading ? (
                  <option disabled>{t("loading") || "Loading..."}</option>
                ) : error ? (
                  <option disabled>{error}</option>
                ) : userAge === null || userAge < 17 ? (
                  <option disabled>{t("ageRestrictionMessage", { age: userAge || "unknown" })}</option>
                ) : electionTypes.length === 0 ? (
                  <option disabled>{t("noElectionsAvailable") || "No elections available"}</option>
                ) : (
                  electionTypes
                    .filter((election) => allowedElectionTypes.includes(election.Type))
                    .map((election) => (
                      <option
                        key={election.ID}
                        value={election.Type}
                        disabled={appliedElections.includes(election.Type)}
                      >
                        {t(getTranslationKey(election.Type))}
                        {appliedElections.includes(election.Type) ? ` (${t("alreadyApplied")})` : ""}
                      </option>
                    ))
                )}
              </select>
              {userAge !== null && userAge < 17 && (
                <p className="age-restriction-note">
                  {t("ageRestrictionMessage", { age: userAge })}
                </p>
              )}
              {appliedElections.length > 0 && (
                <p className="applied-elections-note">
                  {t("alreadyAppliedNoteE", {
                    types: appliedElections.map((type) => t(getTranslationKey(type))).join(", "),
                  })}
                </p>
              )}
            </div>

            <div className="form-group">
              <button
                type="button"
                className="submit-button"
                onClick={handleSubmit}
                disabled={loading || !!error || !formData.email || userAge === null || userAge < 17}
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

export default UserElection;