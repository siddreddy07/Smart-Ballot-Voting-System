import React, { useEffect, useState } from 'react';
import { useBoothOfficer } from '../context/BoothOfficerContext';
import { useNavigate } from 'react-router-dom';
import { stateData } from '../../../States'; // Adjust path if needed

const BoothOfficerDashboard = () => {
  const { bofficer, boothofficerdetails, loginWithPurpose } = useBoothOfficer();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!bofficer) {
      boothofficerdetails();
    }
  }, []);

  const getStateName = (stateId) => {
    return stateData.states.find(s => s.state_id === String(stateId))?.state_name || 'N/A';
  };

  const getDistrictName = (stateId, districtId) => {
    return stateData.states
      .find(s => s.state_id === String(stateId))
      ?.districts.find(d => d.district_id === String(districtId))?.district_name || 'N/A';
  };

  const getAssemblyName = (stateId, districtId, assemblyId) => {
    return stateData.states
      .find(s => s.state_id === String(stateId))
      ?.districts.find(d => d.district_id === String(districtId))
      ?.assemblies.find(a => a.assembly_id === String(assemblyId))?.assembly_name || 'N/A';
  };

  // Using District Name as Parliamentary Name as requested
  const getParliamentaryName = (stateId, districtId) => {
    return getDistrictName(stateId, districtId);
  };

  const handleLogin = async () => {
    if (!email || !password) return;

    const success = await loginWithPurpose(email, password, selectedPurpose, navigate);
    if (success) {
      setShowLoginPopup(false);
      setEmail('');
      setPassword('');
      setSelectedPurpose('');
    }
  };

  if (!bofficer) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-xl text-gray-700 font-semibold animate-pulse">Loading Booth Officer...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-orange-500 text-white py-6 shadow-md">
        <div className="text-center text-2xl font-bold tracking-wide">Election Commission of India</div>
      </div>

      {/* Page Title */}
      <div className="text-center mt-6 mb-4">
        <h2 className="text-3xl font-bold text-orange-600">Booth Officer Dashboard</h2>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-6xl mx-auto px-6 py-10 rounded-3xl shadow-2xl border border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row gap-10 items-center sm:items-start">
          <div className="relative w-40 h-40 rounded-full border-4 border-orange-500 shadow-lg overflow-hidden">
            <img
              src={bofficer?.User?.IMAGE || '/default-user.jpg'}
              alt="Officer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
              {bofficer?.OFFICER_NAME}
            </h1>
            <p className="text-gray-600 mt-1">{bofficer?.User?.EMAIL}</p>
            <p className="text-gray-600">{bofficer?.User?.PHN_NO}</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          <InfoCard label="Booth ID" value={bofficer?.BOOTH_ID} />
          <InfoCard label="State" value={getStateName(bofficer?.STATE_ID)} />
          <InfoCard label="District" value={getDistrictName(bofficer?.STATE_ID, bofficer?.DISTRICT_ID)} />
          <InfoCard label="Assembly Constituency" value={getAssemblyName(bofficer?.STATE_ID, bofficer?.DISTRICT_ID, bofficer?.ASSEMBLY_CONSTITUENCY_ID)} />
          <InfoCard label="Parliamentary Constituency" value={getParliamentaryName(bofficer?.STATE_ID, bofficer?.DISTRICT_ID)} />
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center sm:justify-start">
          <button
            onClick={() => {
              setSelectedPurpose('verification');
              setShowLoginPopup(true);
            }}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md hover:shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-105"
          >
            Go to Voter Verification
          </button>
          <button
            onClick={() => {
              setSelectedPurpose('voting');
              setShowLoginPopup(true);
            }}
            className="bg-orange-400 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md hover:shadow-lg hover:bg-orange-500 transition-transform transform hover:scale-105"
          >
            Vote MLA / MP
          </button>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginPopup && (
        <div className="absolute top-0 left-0 w-full h-full bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[90%] max-w-md shadow-xl border border-gray-200">
            <h3 className="text-2xl font-bold text-orange-700 mb-6 text-center">Login to Proceed</h3>
            <input
              type="email"
              placeholder="Enter your Email"
              className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter your Password"
              className="w-full mb-6 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <button
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 font-semibold transition duration-300"
                onClick={handleLogin}
              >
                Login
              </button>
              <button
                className="text-orange-600 font-medium hover:underline"
                onClick={() => setShowLoginPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition duration-300">
    <h4 className="text-sm text-gray-500 font-medium mb-1">{label}</h4>
    <p className="text-xl font-semibold text-gray-800">{value || 'N/A'}</p>
  </div>
);

export default BoothOfficerDashboard;
