import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaArrowLeft } from 'react-icons/fa';
import { fetchPermits, checkVillagerPermitApplication, submitPermitApplication } from "../../../../../api/permit";
import { getProfile } from "../../../../../api/villager";
import "../../../../../index.css";
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const UserPermits = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    type: "",
    requiredDate: "",
  });
  const [permitTypes, setPermitTypes] = useState([]);
  const [activePermits, setActivePermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [villagerId, setVillagerId] = useState(null);

  useEffect(() => {
    console.log("useEffect running to fetch profile and permit types");
    const loadData = async () => {
      try {
        const profile = await getProfile();
        setFormData((prevData) => ({
          ...prevData,
          email: profile.Email || "",
        }));
        setVillagerId(profile.Villager_ID);

        const permits = await fetchPermits();
        console.log("Loaded permit types:", permits);
        setPermitTypes(permits);

        if (profile.Villager_ID) {
          const currentDate = new Date();
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth() + 1;
          const applications = await checkVillagerPermitApplication(profile.Villager_ID, year, month);
          const active = applications.filter((app) => new Date(app.required_date) >= currentDate);
          setActivePermits(active.map((app) => app.Permits_Type));
          console.log("Active permit types:", activePermits);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err.response?.data || err.message);
        setError("Failed to fetch data: " + (err.response?.data?.error || err.message));
        setLoading(false);
      }
    };
    loadData();
  }, []);

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

  const handleSubmit = async () => {
    if (!formData.email || !formData.type || !formData.requiredDate) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all required fields",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Invalid email format",
        confirmButtonText: "OK",
      });
      return;
    }

    const parsedRequiredDate = new Date(formData.requiredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    if (isNaN(parsedRequiredDate) || parsedRequiredDate <= today) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Required date must be a valid future date",
        confirmButtonText: "OK",
      });
      return;
    }

    if (activePermits.includes(formData.type)) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: `You have an active application for ${formData.type}. Please wait until the required date has passed.`,
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("permitType", formData.type);
      formDataToSend.append("requiredDate", formData.requiredDate);

      await submitPermitApplication(formDataToSend);

      Swal.fire({
        title: "Success",
        text: "Permit application submitted successfully",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/user_dashboard");
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.error || "Failed to submit permit application",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/user_dashboard');
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
            <h1 className="village-title">Permit Application</h1>
          </div>
        </div>
      </div>
      <br/>

      <div>
        <div className="user-permits-container">
          <form className="permits-form">
            <div className="form-permits-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                disabled
              />
            </div>

            <div className="form-permits-group">
              <label htmlFor="type">Permit Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                disabled={loading || !!error}
              >
                <option value="" disabled>
                  Select a permit type
                </option>
                {loading ? (
                  <option disabled>Loading...</option>
                ) : error ? (
                  <option disabled>{error}</option>
                ) : permitTypes.length === 0 ? (
                  <option disabled>No permit types available</option>
                ) : (
                  permitTypes.map((permit) => (
                    <option
                      key={permit.Permits_ID}
                      value={permit.Permits_Type}
                      disabled={activePermits.includes(permit.Permits_Type)}
                    >
                      {permit.Permits_Type}
                      {activePermits.includes(permit.Permits_Type) ? " (Active)" : ""}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="form-permits-group">
              <label htmlFor="requiredDate">Required Date</label>
              <input
                type="date"
                id="requiredDate"
                name="requiredDate"
                value={formData.requiredDate}
                onChange={handleInputChange}
                required
                disabled={loading || !!error}
                min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0]} // Prevent past and current dates
              />
            </div>

            <div className="form-permits-group">
              <button
                type="button"
                className="submit-permit-button"
                onClick={handleSubmit}
                disabled={loading || !!error || !formData.email}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default UserPermits;