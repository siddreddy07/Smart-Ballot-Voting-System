import React, { useState } from "react";
import { stateData } from "../../../States"; // Adjust the path accordingly
import { useBoothOfficer } from "../context/BoothOfficerContext";
import { useNavigate } from "react-router-dom";

export default function BoothOfficerRegister() {
  const [form, setForm] = useState({
    BOOTH_ID: "",
    STATE_ID: "",
    DISTRICT_ID: "",
    ASSEMBLY_CONSTITUENCY_ID: "",
    PARLIAMENTARY_CONSTITUENCY_ID: "",
    OFFICER_NAME: "",
    OFFICER_EMAIL: "",
    OFFICER_PHONE: "",
    RFID_NO: "",
    PASSWORD: ""
  });

  const {bofficer,registerBoothOfficer} = useBoothOfficer()

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      if (name === "DISTRICT_ID") {
        const selectedState = stateData.states.find(s => s.state_id === prev.STATE_ID);
        const selectedDistrict = selectedState?.districts.find(d => d.district_id === value);
        const commonParliament = selectedDistrict?.district_id || "";
        return {
          ...prev,
          [name]: value,
          PARLIAMENTARY_CONSTITUENCY_ID: commonParliament
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(form)
    const res = registerBoothOfficer(navigate,form)

    if(res){
        setLoading(false)
    }
    else{
        setLoading(false)
    }
    
  };


  console.log(bofficer)


  const isFormValid = Object.values(form).every(val => String(val).trim() !== "");

  const selectedState = stateData.states.find(s => s.state_id === form.STATE_ID);
  const selectedDistrict = selectedState?.districts.find(d => d.district_id === form.DISTRICT_ID);

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="hidden md:block bg-blue-600 p-8">
        <div className="h-full flex flex-col items-center justify-center text-white space-y-4">
          <img src="../../public/logo.png" alt="Election Commission Logo" className="w-62 h-56 mb-4 drop-shadow-lg" />
          <h1 className="text-3xl font-extrabold text-center tracking-wide">Election Commission of India</h1>
          <p className="text-xl font-medium text-center">भारत निर्वाचन आयोग</p>
        </div>
      </div>

      <div className="p-6 flex items-center justify-center">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 space-y-6 transform transition duration-300">
          <h2 className="text-3xl font-extrabold text-center text-blue-600">Booth Officer Registration</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="group transition duration-200">
              <label className="block text-sm font-semibold text-gray-600">Booth ID *</label>
              <input type="text" name="BOOTH_ID" value={form.BOOTH_ID} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md" required />
            </div>

            <div className="group transition duration-200">
              <label className="block text-sm font-semibold text-gray-600">State *</label>
              <select name="STATE_ID" value={form.STATE_ID} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md">
                <option value="">Select State</option>
                {stateData.states.map(state => (
                  <option key={state.state_id} value={state.state_id}>{state.state_name}</option>
                ))}
              </select>
            </div>

            <div className="group transition duration-200">
              <label className="block text-sm font-semibold text-gray-600">District *</label>
              <select name="DISTRICT_ID" value={form.DISTRICT_ID} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md">
                <option value="">Select District</option>
                {selectedState?.districts.map(dist => (
                  <option key={dist.district_id} value={dist.district_id}>{dist.district_name}</option>
                ))}
              </select>
            </div>

            <div className="group transition duration-200">
              <label className="block text-sm font-semibold text-gray-600">Assembly Constituency *</label>
              <select name="ASSEMBLY_CONSTITUENCY_ID" value={form.ASSEMBLY_CONSTITUENCY_ID} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md">
                <option value="">Select Assembly Constituency</option>
                {selectedDistrict?.assemblies.map(assembly => (
                  <option key={assembly.assembly_id} value={assembly.assembly_id}>{assembly.assembly_name}</option>
                ))}
              </select>
            </div>

            <div className="group transition duration-200">
              <label className="block text-sm font-semibold text-gray-600">Parliamentary Constituency *</label>
              <select name="PARLIAMENTARY_CONSTITUENCY_ID" value={form.PARLIAMENTARY_CONSTITUENCY_ID} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md">
                <option value="">Select Parliamentary Constituency</option>
                <option value={selectedDistrict?.district_id}>{selectedDistrict?.district_name}</option>
              </select>
            </div>

            {[{
              label: "Officer Name *", name: "OFFICER_NAME", type: "text"
            }, {
              label: "Officer Email *", name: "OFFICER_EMAIL", type: "email"
            }, {
              label: "Officer Phone *", name: "OFFICER_PHONE", type: "tel"
            }, {
              label: "RFID No *", name: "RFID_NO", type: "text"
            }, {
              label: "Password *", name: "PASSWORD", type: "password"
            }].map(input => (
              <div key={input.name} className="group transition duration-200">
                <label className="block text-sm font-semibold text-gray-600">{input.label}</label>
                <input
                  type={input.type}
                  name={input.name}
                  value={form[input.name]}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full p-3 mt-6 font-bold rounded-xl text-white shadow-md transition duration-300 ${
                isFormValid && !loading ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Registering...</span>
                </div>
              ) : (
                "Register Booth Officer"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}