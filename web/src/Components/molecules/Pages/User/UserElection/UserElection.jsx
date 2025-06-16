import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchElections } from "../../../../../api/election";
import { getProfile } from "../../../../../api/villager"; // Import getProfile
import "./UserElection.css";
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const UserElection = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "", // Will be set to logged-in user's email
    type: "",
  });
  const [electionTypes, setElectionTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logged-in user's profile and election types on component mount
  useEffect(() => {
    console.log("useEffect running to fetch profile and elections");
    const loadData = async () => {
      try {
        // Fetch logged-in user's profile
        const profile = await getProfile();
        setFormData((prevData) => ({
          ...prevData,
          email: profile.Email || "", // Set email from profile
        }));

        // Fetch election types
        const elections = await fetchElections();
        console.log("Loaded elections:", elections);
        setElectionTypes(elections);
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
    if (!formData.email || !formData.type) {
      Swal.fire({
        title: t("formValidationTitle"),
        text: t("formValidationMessage"),
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

    console.log("Navigating to UserElectionID with formData:", formData);
    navigate("/user_election_id", { state: { formData } });
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
                disabled // Disable the email input
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
                disabled={loading || !!error}
              >
                <option value="" disabled>
                  {t("selectType")}
                </option>
                {loading ? (
                  <option disabled>{t("loading") || "Loading..."}</option>
                ) : error ? (
                  <option disabled>{error}</option>
                ) : electionTypes.length === 0 ? (
                  <option disabled>{t("noElectionsAvailable") || "No elections available"}</option>
                ) : (
                  electionTypes.map((election) => (
                    <option key={election.ID} value={election.Type}>
                      {t(getTranslationKey(election.Type))}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="form-group">
              <button
                type="button"
                className="upload-button"
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

export default UserElection;