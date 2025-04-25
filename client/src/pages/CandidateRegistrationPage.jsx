import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { stateData } from "../../../States";
import { partyData } from "../../../parties";
import { useCandidate } from "../context/CandidateContext";

// Utility function to convert image URL to base64
const convertImageToBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export default function CandidateRegistration() {
  const [form, setForm] = useState({
    EMAIL: "",
    NAME: "",
    RFID_NO: "",
    PARTY_ID: "",
    ELECTION_TYPE: "",
    STATE_ID: "",
    DISTRICT_ID: "",
    PARLIAMENTARY_CONSTITUENCY_ID: "",
    ASSEMBLY_ID: "",
    PASSWORD: ""
  });

  const [districts, setDistricts] = useState([]);
  const [assemblies, setAssemblies] = useState([]);
  const [filteredParties, setFilteredParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [loading, setLoading] = useState(false);

  const { registerCandidate } = useCandidate();

  useEffect(() => {
    if (!form.STATE_ID) {
      setDistricts([]);
      return;
    }
    const state = stateData.states.find(s => String(s.state_id) === String(form.STATE_ID));
    setDistricts(state?.districts || []);
  }, [form.STATE_ID]);

  useEffect(() => {
    const district = districts.find(d => d.district_id === form.DISTRICT_ID);
    setAssemblies(district ? district.assemblies : []);
  }, [form.DISTRICT_ID, districts]);

  useEffect(() => {
    const parties = partyData.filter(p => p.state_id === form.STATE_ID);
    setFilteredParties(parties);
  }, [form.STATE_ID]);

  useEffect(() => {
    if (form.ELECTION_TYPE === "MP") {
      setForm(prev => ({
        ...prev,
        PARLIAMENTARY_CONSTITUENCY_ID: form.DISTRICT_ID
      }));
    }
  }, [form.ELECTION_TYPE, form.DISTRICT_ID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === "PARTY_ID") {
      const party = filteredParties.find(p => p.party_id === value);
      setSelectedParty(party);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let partyImageBase64 = null;

      if (selectedParty?.image_url) {
        partyImageBase64 = await convertImageToBase64(selectedParty.image_url);
      }

      const candidatePayload = {
        EMAIL: form.EMAIL,
        NAME: form.NAME,
        RFID_NO: form.RFID_NO,
        PARTY_ID: form.PARTY_ID,
        ELECTION_TYPE: form.ELECTION_TYPE,
        STATE_ID: Number(form.STATE_ID),
        DISTRICT_ID: Number(form.DISTRICT_ID),
        PASSWORD: form.PASSWORD,
        PARTY_IMAGE_BASE64: partyImageBase64,
        ...(form.ELECTION_TYPE === "MP"
          ? { PARLIAMENTARY_CONSTITUENCY_ID: Number(form.PARLIAMENTARY_CONSTITUENCY_ID) }
          : { ASSEMBLY_CONSTITUENCY_ID: Number(form.ASSEMBLY_ID) })
      };

      console.log("Registering candidate with payload:", candidatePayload);
      await registerCandidate(candidatePayload);
      

    } catch (err) {
      console.error("Registration failed:", err);
      alert("Registration failed! See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    form.EMAIL.trim() !== "" &&
    form.NAME.trim() !== "" &&
    form.RFID_NO.trim() !== "" &&
    form.PARTY_ID.trim() !== "" &&
    form.ELECTION_TYPE.trim() !== "" &&
    form.STATE_ID.trim() !== "" &&
    form.DISTRICT_ID.trim() !== "" &&
    form.PASSWORD.trim() !== "" &&
    (form.ELECTION_TYPE === "MP" || form.ASSEMBLY_ID.trim() !== "");

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-[#fff7ed] to-white">
      {/* Left Side - Branding */}
      <div className="hidden md:flex bg-gradient-to-b from-[#f97316] to-[#c2410c] p-8 flex-col items-center justify-center text-white">
        <img
          src="/logo.png"
          alt="Election Commission Logo"
          className="w-62 h-56 mb-6 animate-pulse"
        />
        <h1 className="text-3xl font-extrabold text-center drop-shadow-md">
          Election Commission of India
        </h1>
        <p className="text-2xl font-semibold text-center mt-2">भारत निर्वाचन आयोग</p>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-105">
          <h2 className="text-3xl font-bold text-[#f97316] mb-6 text-center animate-fade-in">
            Candidate Registration
          </h2>
          
          {/* FORM STARTS HERE */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {[ 
              { label: "Full Name *", name: "NAME", type: "text", placeholder: "Enter Full Name" },
              { label: "Email *", name: "EMAIL", type: "email", placeholder: "Enter Email Address" },
              { label: "RFID No *", name: "RFID_NO", type: "text", placeholder: "Enter RFID Number" },
              { label: "Password *", name: "PASSWORD", type: "password", placeholder: "Enter Password" }
            ].map(input => (
              <div key={input.name} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">{input.label}</label>
                <input
                  type={input.type}
                  name={input.name}
                  value={form[input.name]}
                  onChange={handleChange}
                  placeholder={input.placeholder}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all"
                  required
                />
              </div>
            ))}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Election Type *</label>
              <select
                name="ELECTION_TYPE"
                value={form.ELECTION_TYPE}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all"
                required
              >
                <option value="">Select Election</option>
                <option value="MLA">MLA</option>
                <option value="MP">MP</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">State *</label>
              <select
                name="STATE_ID"
                value={form.STATE_ID}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all"
                required
              >
                <option value="">Select State</option>
                {stateData.states.map(state => (
                  <option key={state.state_id} value={state.state_id}>{state.state_name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">District *</label>
              <select
                name="DISTRICT_ID"
                value={form.DISTRICT_ID}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all"
                required
              >
                <option value="">Select District</option>
                {districts.map(d => (
                  <option key={d.district_id} value={d.district_id}>{d.district_name}</option>
                ))}
              </select>
            </div>

            {form.ELECTION_TYPE === "MLA" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Assembly *</label>
                <select
                  name="ASSEMBLY_ID"
                  value={form.ASSEMBLY_ID}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all"
                  required
                >
                  <option value="">Select Assembly</option>
                  {assemblies.map(a => (
                    <option key={a.assembly_id} value={a.assembly_id}>{a.assembly_name}</option>
                  ))}
                </select>
              </div>
            )}

            {form.STATE_ID === "4" ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Party *</label>
                <select
                  name="PARTY_ID"
                  value={form.PARTY_ID}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all"
                  required
                >
                  <option value="">Select Party</option>
                  {filteredParties.map(p => (
                    <option key={p.party_id} value={p.party_id}>{p.party_name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-sm text-red-500 text-center">
                Currently, only Andhra Pradesh party registrations are supported.
              </p>
            )}

            {selectedParty && (
              <div className="flex flex-col items-center justify-center space-y-2">
                <img
                  src={selectedParty.image_url}
                  alt={selectedParty.party_name}
                  className="w-24 h-24 object-contain rounded-md shadow border border-gray-300"
                />
                <p className="text-sm font-semibold text-gray-600">{selectedParty.party_name}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                isFormValid && !loading
                  ? "bg-[#f97316] hover:bg-[#ea580c] active:scale-95"
                  : "bg-gray-300 cursor-not-allowed opacity-50"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Registering...</span>
                </div>
              ) : (
                "Register Candidate"
              )}
            </button>

            {/* Login Link */}
            <p className="text-sm text-center text-gray-600">
              Already registered?{" "}
              <Link
                to="/login"
                className="text-[#f97316] hover:text-[#ea580c] font-medium hover:underline"
              >
                Login Now
              </Link>
            </p>
          </form>
          {/* FORM ENDS HERE */}
        </div>
      </div>
    </div>
  );
}
