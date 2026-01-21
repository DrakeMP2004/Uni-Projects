import "./styles.css";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

export default function App() {
  const [demographics, setDemographics] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: null,
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    maritalStatus: ""
  });

  const [conditions, setConditions] = useState([]);
  const [step, setStep] = useState(1); // Tracks form steps
  const [termsAccepted, setTermsAccepted] = useState(false); // Terms acceptance

  const genderOptions = [
    { value: "man", label: "Man" },
    { value: "woman", label: "Woman" },
    { value: "other", label: "Other" }
  ];

  const maritalStatusOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" }
  ];

  const medicalConditionsOptions = [
    { value: "depression", label: "Depression" },
    { value: "insomnia", label: "Insomnia" },
    { value: "high_blood_pressure", label: "High Blood Pressure" },
    { value: "cardiac_arrest", label: "Cardiac Arrest" },
    { value: "arrhythmia", label: "Arrhythmia" },
    { value: "coronary_heart_disease", label: "Coronary Heart Disease" },
    { value: "ibs", label: "IBS" },
    { value: "crohns_disease", label: "Crohn's Disease" },
    { value: "gallstones", label: "Gallstones" },
    { value: "anxiety", label: "Anxiety" }
  ];

  // Validate demographic fields
  const validateDemographics = () => {
    return (
      demographics.firstName &&
      demographics.lastName &&
      demographics.gender &&
      demographics.dateOfBirth &&
      demographics.email &&
      demographics.phone &&
      demographics.address &&
      demographics.city &&
      demographics.state &&
      demographics.zip &&
      demographics.maritalStatus
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateDemographics()) {
      alert("Please fill out all fields before proceeding.");
    } else {
      setStep(2); // Proceed to Terms and Conditions
    }
  };

  const handleAgree = () => {
    setTermsAccepted(true);
    alert("Thank you for completing the form!");
  };

  return (
    <div className="App">
      {step === 1 && (
        <form onSubmit={handleSubmit}>
          <h1>Patient Information Page</h1>
          <input
            type="text"
            placeholder="First Name"
            value={demographics.firstName}
            onChange={(e) =>
              setDemographics({ ...demographics, firstName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Last Name"
            value={demographics.lastName}
            onChange={(e) =>
              setDemographics({ ...demographics, lastName: e.target.value })
            }
          />
          <Select
            options={genderOptions}
            placeholder="Gender"
            onChange={(selectedOption) =>
              setDemographics({ ...demographics, gender: selectedOption.value })
            }
          />
          <DatePicker
            selected={demographics.dateOfBirth}
            onChange={(date) =>
              setDemographics({ ...demographics, dateOfBirth: date })
            }
            placeholderText="Date of Birth"
          />
          <input
            type="email"
            placeholder="Email"
            value={demographics.email}
            onChange={(e) =>
              setDemographics({ ...demographics, email: e.target.value })
            }
          />
          <input
            type="tel"
            placeholder="Phone"
            value={demographics.phone}
            onChange={(e) =>
              setDemographics({ ...demographics, phone: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Address"
            value={demographics.address}
            onChange={(e) =>
              setDemographics({ ...demographics, address: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="City"
            value={demographics.city}
            onChange={(e) =>
              setDemographics({ ...demographics, city: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="State"
            value={demographics.state}
            onChange={(e) =>
              setDemographics({ ...demographics, state: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="ZIP"
            value={demographics.zip}
            onChange={(e) =>
              setDemographics({ ...demographics, zip: e.target.value })
            }
          />
          <Select
            options={maritalStatusOptions}
            placeholder="Marital Status"
            onChange={(selectedOption) =>
              setDemographics({
                ...demographics,
                maritalStatus: selectedOption.value
              })
            }
          />
          <h2>Conditions</h2>
          <Select
            isMulti
            options={medicalConditionsOptions}
            onChange={(selected) =>
              setConditions(selected.map((item) => item.value))
            }
          />

          <h2>Medical Questions</h2>
          <label>
            <input
              type="checkbox"
              onChange={(e) => console.log("Smoke:", e.target.checked)}
            />
            Do you smoke any tobacco products?
          </label>
          <label>
            <input
              type="checkbox"
              onChange={(e) => console.log("Alcohol:", e.target.checked)}
            />
            Do you drink alcohol?
          </label>
          <label>
            <input
              type="checkbox"
              onChange={(e) => console.log("Drugs:", e.target.checked)}
            />
            Have you regularly used illicit drugs?
          </label>
          <label>
            <input
              type="checkbox"
              onChange={(e) => console.log("Allergies:", e.target.checked)}
            />
            Medication allergies or reactions
          </label>
          <button type="submit">Next</button>
        </form>
      )}

      {step === 2 && !termsAccepted && (
        <div>
          <h1>Terms and Conditions</h1>
          <p>
            By submitting this form, you agree to our terms and conditions.
          </p>
          <button onClick={handleAgree}>Agree</button>
        </div>
      )}
    </div>
  );
}
