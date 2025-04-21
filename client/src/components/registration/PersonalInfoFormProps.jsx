import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { stateData } from '../../../../States';

// Reusable Components
function InputField({ label, value, onChange, type = 'text', required = false, warning }) {
  const id = label.toLowerCase().replace(/\s+/g, '');
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-saffron-900">
        {label}
      </label>
      <input
        type={type}
        id={id}
        className="mt-1 block w-full rounded-md border-saffron-300 bg-saffron-50 text-saffron-900 shadow-sm focus:border-saffron-600 focus:ring focus:ring-saffron-600 focus:ring-opacity-50"
        value={value}
        onChange={onChange}
        required={required}
      />
      {warning && (
        <p className="mt-1 text-sm text-saffron-700 bg-saffron-100 p-2 rounded-md">
          {warning}
        </p>
      )}
    </div>
  );
}

function Dropdown({ label, value, options, onChange }) {
  const id = label.toLowerCase().replace(/\s+/g, '');
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-saffron-900">
        {label}
      </label>
      <select
        id={id}
        className="mt-1 block w-full rounded-md border-saffron-300 bg-saffron-50 text-saffron-900 shadow-sm focus:border-saffron-600 focus:ring focus:ring-saffron-600 focus:ring-opacity-50"
        value={value}
        onChange={onChange}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Utility Functions
const isAtLeast18 = (dob) => {
  if (!dob) return true; // No DOB entered, no warning
  const dobDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  const dayDiff = today.getDate() - dobDate.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    return age - 1 >= 18;
  }
  return age >= 18;
};

// Main Component
export function PersonalInfoForm({ onNext }) {
  // Initialize Form State
  const getInitialState = () => {
    try {
      const data = JSON.parse(localStorage.getItem('personalInfoFormData')) || {};
      return {
        fullName: data.fullName || localStorage.getItem("FULL_NAME") || '',
        dob: data.dob || '',
        phone: data.phone || localStorage.getItem("PHONE") || '',
        email: data.email || localStorage.getItem("EMAIL") || '',
        presentAddress: data.presentAddress || localStorage.getItem("PRESENT_ADDRESS") || '',
        permanentAddress: data.permanentAddress || localStorage.getItem("PERMANENT_ADDRESS") || '',
        aadharNo: data.aadharNo || '',
        parentName: data.parentName || '',
        gender: data.gender || '',
        photoPreview: data.photoPreview || localStorage.getItem("PHOTO") || '',
        selectedState: data.selectedState || localStorage.getItem("STATE_ID") || '',
        selectedDistrict: data.selectedDistrict || localStorage.getItem("DISTRICT_ID") || '',
        selectedAssembly: data.selectedAssembly || localStorage.getItem("ASSEMBLY_ID") || '',
      };
    } catch (err) {
      return {
        fullName: localStorage.getItem("FULL_NAME") || '',
        dob: '',
        phone: localStorage.getItem("PHONE") || '',
        email: localStorage.getItem("EMAIL") || '',
        presentAddress: localStorage.getItem("PRESENT_ADDRESS") || '',
        permanentAddress: localStorage.getItem("PERMANENT_ADDRESS") || '',
        aadharNo: '',
        parentName: '',
        gender: '',
        photoPreview: localStorage.getItem("PHOTO") || '',
        selectedState: localStorage.getItem("STATE_ID") || '',
        selectedDistrict: localStorage.getItem("DISTRICT_ID") || '',
        selectedAssembly: localStorage.getItem("ASSEMBLY_ID") || '',
      };
    }
  };

  const [formState, setFormState] = useState(getInitialState());
  const [showAgeWarning, setShowAgeWarning] = useState(false);

  // Save to Local Storage
  useEffect(() => {
    localStorage.setItem('personalInfoFormData', JSON.stringify(formState));
    // Save individual fields for VerificationStep compatibility
    localStorage.setItem("FULL_NAME", formState.fullName);
    localStorage.setItem("PHONE", formState.phone);
    localStorage.setItem("EMAIL", formState.email);
    localStorage.setItem("PRESENT_ADDRESS", formState.presentAddress);
    localStorage.setItem("PERMANENT_ADDRESS", formState.permanentAddress);
    localStorage.setItem("PHOTO", formState.photoPreview);
    localStorage.setItem("STATE_ID", formState.selectedState);
    localStorage.setItem("DISTRICT_ID", formState.selectedDistrict);
    localStorage.setItem("ASSEMBLY_ID", formState.selectedAssembly);
    // Calculate and save age
    if (formState.dob) {
      const dobDate = new Date(formState.dob);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();
      const dayDiff = today.getDate() - dobDate.getDate();
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age -= 1;
      }
      localStorage.setItem("AGE", age.toString());
    }
  }, [formState]);

  // Check DOB for Age Warning
  useEffect(() => {
    setShowAgeWarning(!isAtLeast18(formState.dob));
  }, [formState.dob]);

  // Dropdown Data
  const state = stateData.states.find((s) => s.state_id === formState.selectedState) || stateData.states[0];
  const districts = state?.districts || [];
  const selectedDistrictData = districts.find((d) => d.district_id === formState.selectedDistrict);
  const assemblies = selectedDistrictData?.assemblies || [];

  // Handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prev) => ({
          ...prev,
          photoPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure STATE_ID is saved before calling onNext
    localStorage.setItem("STATE_ID", formState.selectedState);
    onNext(formState);
  };

  // Render
  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-6 bg-saffron-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-saffron-900 mb-6">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Details */}
        <InputField
          label="Full Name"
          value={formState.fullName}
          onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
          required
        />
        <InputField
          label="Date of Birth"
          type="date"
          value={formState.dob}
          onChange={(e) => setFormState({ ...formState, dob: e.target.value })}
          required
          warning={showAgeWarning ? 'Age must be 18 years or older.' : null}
        />
        <Dropdown
          label="Gender"
          value={formState.gender}
          options={[
            { value: 'M', label: 'Male' },
            { value: 'F', label: 'Female' },
            { value: 'N', label: 'Not Specified' },
          ]}
          onChange={(e) => setFormState({ ...formState, gender: e.target.value })}
        />

        {/* Contact Information */}
        <InputField
          label="Phone Number"
          type="tel"
          value={formState.phone}
          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
          required
        />
        <InputField
          label="Email"
          type="email"
          value={formState.email}
          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
          required
        />
        <InputField
          label="Aadhar Number"
          value={formState.aadharNo}
          onChange={(e) => setFormState({ ...formState, aadharNo: e.target.value })}
          required
        />

        {/* Address Information */}
        <InputField
          label="Permanent Address"
          value={formState.permanentAddress}
          onChange={(e) => setFormState({ ...formState, permanentAddress: e.target.value })}
          required
        />
        <InputField
          label="Present Address"
          value={formState.presentAddress}
          onChange={(e) => setFormState({ ...formState, presentAddress: e.target.value })}
          required
        />
        <InputField
          label="Parent/Guardian Name"
          value={formState.parentName}
          onChange={(e) => setFormState({ ...formState, parentName: e.target.value })}
          required
        />

        {/* Location Dropdowns */}
        <Dropdown
          label="State"
          value={formState.selectedState}
          options={stateData.states.map((state) => ({
            value: state.state_id,
            label: state.state_name,
          }))}
          onChange={(e) =>
            setFormState({ ...formState, selectedState: e.target.value, selectedDistrict: '', selectedAssembly: '' })
          }
        />
        <Dropdown
          label="District"
          value={formState.selectedDistrict}
          options={districts.map((district) => ({
            value: district.district_id,
            label: district.district_name,
          }))}
          onChange={(e) => setFormState({ ...formState, selectedDistrict: e.target.value, selectedAssembly: '' })}
        />
        <Dropdown
          label="Assembly"
          value={formState.selectedAssembly}
          options={assemblies.map((assembly) => ({
            value: assembly.assembly_id,
            label: assembly.assembly_name,
          }))}
          onChange={(e) => setFormState({ ...formState, selectedAssembly: e.target.value })}
        />

        {/* Profile Photo */}
        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-saffron-900">
            Profile Photo
          </label>
          <label
            htmlFor="photo"
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-saffron-300 border-dashed rounded-md cursor-pointer hover:border-saffron-600 bg-saffron-100"
          >
            <div className="space-y-1 text-center">
              {formState.photoPreview ? (
                <img src={formState.photoPreview} alt="Preview" className="h-20 w-20 rounded-full mx-auto" />
              ) : (
                <Upload className="mx-auto h-12 w-12 text-saffron-600" />
              )}
              <div className="flex text-sm text-saffron-700">
                <span className="font-medium hover:text-saffron-900">Upload a file</span>
              </div>
              <p className="text-xs text-saffron-600">PNG, JPG up to 10MB</p>
            </div>
            <input
              id="photo"
              name="photo"
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="px-6 py-2 rounded-md text-white font-medium transition-colors bg-saffron-600 hover:bg-saffron-700"
        >
          Next
        </button>
      </div>
    </form>
  );
}