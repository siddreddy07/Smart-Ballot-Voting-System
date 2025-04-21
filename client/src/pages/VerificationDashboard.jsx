import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVerificationOfficer } from "../context/VerificationOfficerContext";
import { motion } from "framer-motion";

export default function VerificationOfficerDashboard() {
  const navigate = useNavigate();
  const { vuser, getvOfficer, allTokens } = useVerificationOfficer();
  const [loading, setLoading] = useState(true);

  // Color palette with saffron theme
  const colors = {
    saffron: "#f97316",
    lightSaffron: "#ffedd5",
    white: "#FFFFFF",
    darkGray: "#2D2D2D",
    lightGray: "#E0E0E0",
    accentSaffron: "#ea580c",
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getvOfficer(navigate);
      if (!data) navigate("/vofficer/login");
      setLoading(false);
    };
    fetchData();
  }, [navigate]);

  const handlePortal = async () => {
    const data = await allTokens();
    if (data) {
      navigate("/voter-tokens");
    }
  };

  // Loading state
  if (loading || !vuser || !vuser.User) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center"
        style={{ background: colors.white }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p style={{ color: colors.darkGray, fontSize: "1.25rem" }}>Loading...</p>
      </motion.div>
    );
  }

  // Destructure data
  const {
    AADHAR_CARD,
    DOB,
    EMAIL,
    GENDER,
    IMAGE,
    IS_VERIFIED,
    NAME,
    PARENT_NAME,
    PERMANENT_ADDRESS,
    PHN_NO,
    PRESENT_ADDRESS,
  } = vuser.User;

  const { CENTER, ROLE, SUPERVISOR_NAME } = vuser;

  return (
    <motion.div
      className="min-h-screen p-6 md:p-12"
      style={{
        background: `linear-gradient(135deg, ${colors.white} 0%, rgba(255, 170, 51, 0.1) 100%)`,
        fontFamily: "'Inter', sans-serif",
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-[#f97316] to-[#ea580c] p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide">
              Verification Officer Dashboard
            </h1>
            <p className="text-sm mt-1 text-white opacity-90">Welcome, {NAME || "Officer"}</p>
          </div>
          <motion.button
            onClick={handlePortal}
            className="px-5 py-2 rounded-lg shadow hover:bg-[#ea580c] transition font-semibold text-white"
            style={{ background: colors.saffron }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            Go to Verification Portal
          </motion.button>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* User Info Card */}
          <motion.div
            className="bg-white rounded-lg p-6 shadow-lg"
            style={{ border: `1px solid ${colors.saffron}`, boxShadow: `0 4px 12px rgba(249, 115, 22, 0.15)` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-20 h-20 rounded-full overflow-hidden"
                style={{ border: `2px solid ${colors.saffron}`, boxShadow: `0 0 8px rgba(249, 115, 22, 0.5)` }}
              >
                {IMAGE ? (
                  <img src={IMAGE} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <img
                    src="https://via.placeholder.com/80/FFAA33/FFFFFF?text=Officer"
                    alt="Placeholder"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <h2 className="text-xl font-bold" style={{ color: colors.darkGray }}>
                {NAME}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Info label="Aadhar Card" value={AADHAR_CARD} colors={colors} />
              <Info label="Date of Birth" value={DOB} colors={colors} />
              <Info label="Parent Name" value={PARENT_NAME} colors={colors} />
              <Info label="Gender" value={GENDER || "Not provided"} colors={colors} />
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="bg-white rounded-lg p-6 shadow-lg"
            style={{ border: `1px solid ${colors.saffron}`, boxShadow: `0 4px 12px rgba(249, 115, 22, 0.15)` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.darkGray }}>
              Contact Info
            </h3>
            <div className="space-y-3">
              <Info label="Email" value={EMAIL} colors={colors} />
              <Info label="Phone Number" value={PHN_NO} colors={colors} />
            </div>
          </motion.div>

          {/* Address Info */}
          <motion.div
            className="bg-white rounded-lg p-6 shadow-lg"
            style={{ border: `1px solid ${colors.saffron}`, boxShadow: `0 4px 12px rgba(249, 115, 22, 0.15)` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.darkGray }}>
              Address Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Info label="Present Address" value={PRESENT_ADDRESS} colors={colors} />
              <Info label="Permanent Address" value={PERMANENT_ADDRESS} colors={colors} />
            </div>
          </motion.div>

          {/* Verification Info */}
          <motion.div
            className="bg-white rounded-lg p-6 shadow-lg"
            style={{ border: `1px solid ${colors.saffron}`, boxShadow: `0 4px 12px rgba(249, 115, 22, 0.15)` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.darkGray }}>
              Verification Details
            </h3>
            <div className="space-y-3">
              <Info label="Center" value={CENTER || "N/A"} colors={colors} />
              <Info label="Supervisor" value={SUPERVISOR_NAME} colors={colors} />
              <Info label="Role" value={ROLE} colors={colors} />
              <div>
                <p className="text-xs uppercase font-medium" style={{ color: colors.darkGray }}>
                  Verification Status
                </p>
                <p
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    IS_VERIFIED ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {IS_VERIFIED ? "Verified" : "Pending Verification"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Reusable Info display component
function Info({ label, value, colors }) {
  return (
    <div>
      <p className="text-xs uppercase font-medium" style={{ color: colors.darkGray }}>
        {label}
      </p>
      <p className="text-sm font-semibold" style={{ color: colors.darkGray }}>
        {value || "N/A"}
      </p>
    </div>
  );
}