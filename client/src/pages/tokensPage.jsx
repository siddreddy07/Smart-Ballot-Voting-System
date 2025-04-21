import React, { useState, useEffect } from "react";
import { useVerificationOfficer } from "../context/VerificationOfficerContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function VerificationDashboard() {
  const navigate = useNavigate();
  const { vuser, tokens ,allTokens} = useVerificationOfficer();
  const [search, setSearch] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Color palette with saffron theme
  const colors = {
    saffron: "#f97316",
    lightSaffron: "#ffedd5",
    white: "#FFFFFF",
    darkGray: "#2D2D2D",
    lightGray: "#E0E0E0",
    accentSaffron: "#ea580c",
  };

  // Real-time clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate loading state
  useEffect(() => {
    // allTokens()
    if (vuser && vuser.User && Array.isArray(tokens)) {
      setIsLoading(false);
    }

    if(!vuser){
      allTokens()
    }
  }, [vuser]);

  // Loading state
  if (isLoading || !vuser || !vuser.User || !Array.isArray(tokens)) {
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

  const officerImage = vuser.User.IMAGE || "https://via.placeholder.com/64/FFAA33/FFFFFF?text=User";
  const supervisorName = vuser.SUPERVISOR_NAME || "N/A";
  const centerID = vuser.CENTER || "N/A";

  const handleView = (id) => {
    if (id) {
      navigate(`/candidate-token/${id}`);
    }
  };

  const filteredTokens = tokens.filter((token) => {
    const name = token.NAME?.toLowerCase() || "";
    const phone = token.PHN_NO?.toString() || "";
    return name.includes(search.toLowerCase()) || phone.includes(search.toLowerCase());
  });

  const formattedTime = currentTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const formattedDate = currentTime.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      className="min-h-screen px-4 py-6"
      style={{
        background: `linear-gradient(135deg, ${colors.white} 0%, rgba(255, 170, 51, 0.1) 100%)`,
        fontFamily: "'Inter', sans-serif",
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header Title */}
        <motion.h1
          className="text-2xl sm:text-3xl font-bold text-center text-white mb-6"
          style={{
            background: `linear-gradient(to right, ${colors.saffron}, ${colors.accentSaffron})`,
            padding: "1.5rem",
            borderRadius: "8px",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Verification-Officer Voter Tokens Verification - {centerID}
        </motion.h1>

        {/* Top Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-6">
          {/* Appointments Info */}
          <motion.div
            className="bg-white border-l-4 p-4 rounded-lg shadow-md w-full sm:w-auto"
            style={{ borderColor: colors.saffron, boxShadow: `0 4px 12px rgba(249, 115, 22, 0.15)` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <p className="text-sm" style={{ color: colors.darkGray }}>
              Appointments Today
            </p>
            <p className="text-xl font-bold" style={{ color: colors.saffron }}>
              {tokens.length}
            </p>
          </motion.div>

          {/* Clock */}
          <motion.div
            className="text-center border rounded-lg px-6 py-2 bg-white shadow w-full sm:w-auto"
            style={{ borderColor: colors.saffron, boxShadow: `0 4px 12px rgba(249, 115, 22, 0.15)` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <h2 className="text-2xl font-mono tracking-widest" style={{ color: colors.saffron }}>
              {formattedTime}
            </h2>
            <p className="text-sm" style={{ color: colors.darkGray }}>
              {formattedDate}
            </p>
          </motion.div>

          {/* Officer Info */}
          <motion.div
            className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-md w-full sm:w-auto"
            style={{ border: `1px solid ${colors.saffron}`, boxShadow: `0 4px 12px rgba(249, 115, 22, 0.15)` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <img
              src={officerImage}
              alt="Officer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
              style={{ border: `2px solid ${colors.saffron}`, boxShadow: `0 0 8px rgba(249, 115, 22, 0.5)` }}
            />
            <div className="text-left">
              <p className="font-semibold" style={{ color: colors.darkGray }}>
                {supervisorName}
              </p>
              <p className="text-sm" style={{ color: colors.darkGray }}>
                Center: {centerID}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          className="max-w-md mb-6 w-full mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <input
            type="text"
            placeholder="Search by Name or Phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]"
            style={{ borderColor: colors.saffron }}
            aria-label="Search voters by name or phone"
          />
        </motion.div>

        {/* Tokens Table */}
        <motion.div
          className="bg-white p-4 rounded-lg shadow-lg overflow-hidden"
          style={{ boxShadow: `0 4px 12px rgba(249, 115, 22, 0.15)` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <div className="max-h-[500px] overflow-y-auto">
            {filteredTokens.length === 0 ? (
              <motion.p
                className="text-center py-4"
                style={{ color: colors.darkGray }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                No voters found.
              </motion.p>
            ) : (
              <table className="w-full text-left border-collapse" role="grid">
                <thead className="sticky top-0 text-white z-10" style={{ background: colors.saffron }}>
                  <tr>
                    <th className="p-3 min-w-[60px]" scope="col">S.No</th>
                    <th className="p-3 min-w-[100px]" scope="col">Image</th>
                    <th className="p-3 min-w-[150px]" scope="col">Name</th>
                    <th className="p-3 min-w-[120px]" scope="col">Phone</th>
                    <th className="p-3 min-w-[150px]" scope="col">Aadhar Card No.</th>
                    <th className="p-3 min-w-[100px]" scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTokens.map((token, index) => (
                    <motion.tr
                      key={token.S_NO || index}
                      className="border-b"
                      style={{ background: index % 2 === 0 ? colors.white : colors.lightSaffron }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ backgroundColor: colors.lightSaffron }}
                      transition={{ duration: 0.3, delay: index * 0.05 + 0.9 }}
                      role="row"
                    >
                      <td className="p-3" style={{ color: colors.darkGray }}>
                        {token.S_NO || "N/A"}
                      </td>
                      <td className="p-3">
                        <img
                          src={token.IMAGE || "https://via.placeholder.com/64/FFAA33/FFFFFF?text=User"}
                          alt={token.NAME || "User"}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                          style={{ border: `1px solid ${colors.saffron}` }}
                        />
                      </td>
                      <td className="p-3 font-semibold" style={{ color: colors.darkGray }}>
                        {token.NAME || "N/A"}
                      </td>
                      <td className="p-3" style={{ color: colors.darkGray }}>
                        {token.PHN_NO || "N/A"}
                      </td>
                      <td className="p-3" style={{ color: colors.darkGray }}>
                        {token.AADHAR_CARD || "N/A"}
                      </td>
                      <td className="p-3">
                        <motion.button
                          onClick={() => handleView(token.S_NO)}
                          className="px-4 py-1.5 rounded-lg text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ background: colors.saffron }}
                          disabled={!token.S_NO}
                          whileHover={{ scale: 1.05, backgroundColor: colors.accentSaffron }}
                          whileTap={{ scale: 0.95 }}
                          aria-label={`View details for voter ${token.NAME || "unknown"}`}
                        >
                          View
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}