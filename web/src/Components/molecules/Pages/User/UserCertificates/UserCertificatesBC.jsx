import React, { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { submitCertificateApplication, fetchVillagerDetails } from "../../../../../api/certificateApplication";
import "./UserCertificatesBC.css";
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const UserCertificatesBC = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const [reason, setReason] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Get form data from UserCertificates
  const { formData } = location.state || { formData: { email: "" } };

  // Fetch email if not provided in location.state
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        // Replace with your actual API call to get the logged-in user's details
        console.log("Fetching user email");
        const userDetails = await fetchVillagerDetails("current"); // Adjust to your auth API
        if (userDetails && userDetails.email) {
          setEmail(userDetails.email);
          console.log("Fetched user email:", userDetails.email);
        } else {
          console.error("No email found in user details");
          navigate("/user_certificates", { state: { error: t("emailNotFound") } });
        }
      } catch (error) {
        console.error("Error fetching user email:", error);
        Swal.fire({
          icon: "error",
          title: t("error"),
          text: t("failedToFetchEmail"),
          confirmButtonText: t("ok"),
        });
        navigate("/user_certificates");
      }
    };

    if (!formData.email) {
      fetchUserEmail();
    } else {
      setEmail(formData.email);
    }
  }, [formData.email, navigate, t]);

  const handleBack = () => {
    navigate("/user_certificates");
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      Swal.fire({
        icon: "error",
        title: t("emailRequiredTitle"),
        text: t("emailRequiredMessage"),
        confirmButtonText: t("ok"),
      });
      return;
    }

    if (!reason.trim()) {
      Swal.fire({
        icon: "error",
        title: t("reasonRequiredTitle"),
        text: t("reasonRequiredMessage"),
        confirmButtonText: t("ok"),
      });
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", email);
      formDataToSend.append("reason", reason);

      // Log FormData contents for debugging
      console.log("Submitting formData:", {
        email,
        reason,
      });

      await submitCertificateApplication(formDataToSend);

      Swal.fire({
        icon: "success",
        title: t("submissionSuccessTitle"),
        text: t("submissionSuccessMessage"),
        confirmButtonText: t("ok"),
      }).then(() => {
        navigate("/user_dashboard");
      });
    } catch (error) {
      console.error("Error during submission:", error);
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: error || t("submissionFailed"),
        confirmButtonText: t("ok"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <NavBar />
      <div className="user-certificates-bc-page">
        <h1 className="certificates-bc-form-title">{t("FormTitleBC")}</h1>

        <div className="language-certificates-bc-selector">
          <button
            onClick={() => changeLanguage("en")}
            className="language-certificates-bc-btn"
          >
            English
          </button>
          <button
            onClick={() => changeLanguage("si")}
            className="language-certificates-bc-btn"
          >
            සිංහල
          </button>
        </div>

        <form className="certificates-bc-form-content">
          <div className="email-certificates-bc-section">
            <label htmlFor="email" className="email-certificates-bc-label">
              {t("emailLabel")}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-certificates-bc-input"
              placeholder={t("emailPlaceholder")}
              disabled={loading}
            />
          </div>

          <div className="reason-certificates-bc-section">
            <label htmlFor="reason" className="reason-certificates-bc-label">
              {t("reasonLabel")}
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="reason-certificates-bc-textarea"
              placeholder={t("reasonPlaceholder")}
              disabled={loading}
            />
          </div>

          <div className="form-certificates-bc-buttons-section">
            <div className="navigation-certificates-bc-buttons">
              <button
                type="button"
                className="back-certificates-bc-btn"
                onClick={handleBack}
                disabled={loading}
              >
                {t("back")}
              </button>
              <button
                type="button"
                className="submit-certificates-bc-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? t("submitting") : t("submit")}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </section>
  );
};

export default UserCertificatesBC;