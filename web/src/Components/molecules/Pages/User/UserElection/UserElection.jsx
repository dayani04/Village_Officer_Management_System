import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchElections } from "../../../../../api/election";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadElections = async () => {
      try {
        const elections = await fetchElections();
        setElectionTypes(elections);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch election types:", err);
        setError(t("errorFetchingElections"));
        setLoading(false);
      }
    };
    loadElections();
  }, [t]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUploadClick = () => {
    if (!formData.email || !formData.type) {
      Swal.fire({
        title: t("formValidationTitle"),
        text: t("formValidationMessage"),
        icon: "error",
        confirmButtonText: t("ok"),
      });
    } else {
      // Pass form data to UserElectionID
      navigate("/UserElectionID", { state: { formData } });
    }
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  const getTranslationKey = (apiType) => {
    switch (apiType) {
      case "Presidential Election":
        return "presidentialElection";
      case "Parliament Election":
        return "parliamentElection";
      case "Local Election":
        return "localElection";
      case "Division Election":
        return "divisionElection";
      default:
        return apiType;
    }
  };

  return (
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
                <option disabled>{t("loading")}</option>
              ) : error ? (
                <option disabled>{error}</option>
              ) : (
                electionTypes.map((election) => (
                  <option key={election.ID} value={election.type}>
                    {t(getTranslationKey(election.type))}
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

export default UserElection;