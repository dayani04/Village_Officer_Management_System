
import VillageOfficerDashBoard from "../VillageOfficerDashBoard/VillageOfficerDashBoard"; // Adjust path if needed

import React from 'react';
import './AddVillageOfficers.css';

const AddVillagerOfficer = () => {
  return (
    <div className="add-villager-layout">
      <div className="dashboard-left">
        <VillageOfficerDashBoard />
      </div>

      <div className="form-container-right">
        <div className="containerAV">
          <div className="cta-form">
            <h2>Add Village Officer</h2>
          </div>
          <form className="form">
            <div className="form-group">
              <input type="text" placeholder="Name" className="form__input" id="name" />
              <label htmlFor="name" className="form__label">Name</label>
            </div>

            <div className="form-group">
              <input type="number" placeholder="Age" className="form__input" id="age" />
              <label htmlFor="age" className="form__label">Age</label>
            </div>

            <div className="form-group">
              <input type="email" placeholder="Email" className="form__input" id="email" />
              <label htmlFor="email" className="form__label">Email</label>
            </div>

            <div className="form-group">
              <input type="text" placeholder="Address" className="form__input" id="address" />
              <label htmlFor="address" className="form__label">Address</label>
            </div>

            <div className="form-group">
              <input type="text" placeholder="NIC" className="form__input" id="nic" />
              <label htmlFor="nic" className="form__label">NIC</label>
            </div>

            <div className="form-group">
              <input type="text" placeholder="House Number" className="form__input" id="houseNo" />
              <label htmlFor="houseNo" className="form__label">House Number</label>
            </div>

            <div className="form-group">
              <input type="text" placeholder="Election Numbers" className="form__input" id="electionNo" />
              <label htmlFor="electionNo" className="form__label">Election Numbers</label>
            </div>

            <div className="form-group">
              <input type="text" placeholder="Alive Status" className="form__input" id="aliveStatus" />
              <label htmlFor="aliveStatus" className="form__label">Alive Status</label>
            </div>

            <div className="form-group">
              <button type="button" className="btn btn-lg" style={{ backgroundColor: "#921940", borderColor: "#921940", color: "white" }}>
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVillagerOfficer;
