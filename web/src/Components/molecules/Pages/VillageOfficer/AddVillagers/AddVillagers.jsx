import React from 'react';
import './AddVillagers.css'; 


const AddVillagers = () => {
  return (
    <div>
      <div className="containerAV">
        <div className="cta-form">
          <h2>Add Villagers</h2>
          
        </div>
        <form className="form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              className="form__input"
              id="name"
            />
            <label htmlFor="name" className="form__label">
              Name
            </label>
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              className="form__input"
              id="email"
            />
            <label htmlFor="email" className="form__label">
              Age
            </label>
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Subject"
              className="form__input"
              id="subject"
            />
            <label htmlFor="subject" className="form__label">
            Email
            </label>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Subject"
              className="form__input"
              id="subject"
            />
            <label htmlFor="subject" className="form__label">
            Address
            </label>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Subject"
              className="form__input"
              id="subject"
            />
            <label htmlFor="subject" className="form__label">
            NIC
            </label>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Subject"
              className="form__input"
              id="subject"
            />
            <label htmlFor="subject" className="form__label">
            House Number
            </label>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Subject"
              className="form__input"
              id="subject"
            />
            <label htmlFor="subject" className="form__label">
            Election Numbers
            </label>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Subject"
              className="form__input"
              id="subject"
            />
            <label htmlFor="subject" className="form__label">
            Alive Status
            </label>
            
          </div>

          <div className="form-group">
  <button type="button" className="btn btn-lg" style={{ backgroundColor: "#921940", borderColor: "#921940" , color: "white"}}>
    Add
  </button>
</div>

        </form>
      </div>
      
    </div>
  );
};

export default AddVillagers;