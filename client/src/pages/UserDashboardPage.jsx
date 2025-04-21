import React, { useEffect, Component } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

// Color palette with Indian flag theme
const colors = {
  saffron: "#FF9933", // Indian flag saffron
  white: "#FFFFFF",
  green: "#138808", // Indian flag green
  navyBlue: "#000080", // Ashoka Chakra navy blue (unused in circle)
  darkGray: "#2D2D2D",
  lightGray: "#F8F8F8",
  accentGray: "#E0E0E0",
  accentSaffron: "#ea580c",
};

// Error Boundary Component
class VoterErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center p-4"
          style={{ background: colors.white }}
        >
          <div
            className="p-6 rounded-lg shadow-md text-center"
            style={{ background: colors.lightGray, color: colors.darkGray }}
          >
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm mb-4">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              className="px-4 py-2 rounded-md"
              style={{ background: colors.saffron, color: colors.white }}
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function UserDashboard() {
  const { user, getUser } = useAuth();
  const { id } = useParams();

  // Fetch user data on mount
  useEffect(() => {
    if (id) getUser(id);
  }, [id]);

  // Loading state
  if (!user) {
    return (
      <VoterErrorBoundary>
        <div className="min-h-screen flex items-center justify-center" style={{ background: colors.white }}>
          <motion.p
            style={{ color: colors.darkGray, fontSize: "1.25rem" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Loading...
          </motion.p>
        </div>
      </VoterErrorBoundary>
    );
  }

  // Normalize user data with fallbacks
  const updatedUser = {
    NAME: user.NAME || "Unknown",
    EMAIL: user.EMAIL || "Not Provided",
    PHN_NO: user.PHN_NO || "Not Provided",
    AADHAAR: user.AADHAAR || "Not Provided",
    E_EPIC: user.E_EPIC || "Not Provided",
    RFID_NO: user.RFID_NO || "",
    DOB: user.DOB || "Not Provided",
    GENDER: user.GENDER || "Not Provided",
    PERMANENT_ADDRESS: user.PERMANENT_ADDRESS || "Not Provided",
    IMAGE: user.IMAGE || "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-profile-picture-business-profile-woman-suitable-social-media-profiles-icons-screensavers-as-templatex9_719432-1315.jpg?semt=ais_hybrid",
  };

  // Mask last 4 digits of RFID_NO
  const maskRFID = (rfid) => {
    if (!rfid || rfid.length < 4) return "XX:XX";
    const parts = rfid.split("-");
    if (parts.length === 3) {
      return `${parts[0]}-${parts[1]}-XX:XX`;
    }
    return rfid.slice(0, -4) + "XX:XX";
  };

  // Handle action button clicks
  const handleAction = (action) => alert(`${action} Clicked`);

  return (
    <VoterErrorBoundary>
      <div
        className="min-h-screen pt-16"
        style={{
          background: `linear-gradient(180deg, ${colors.white} 0%, rgba(255, 153, 51, 0.08) 100%)`,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* Header */}
        <header
          className="fixed top-0 left-0 w-full shadow-md z-10"
          style={{
            background: `linear-gradient(90deg, ${colors.saffron}, ${colors.accentSaffron})`,
            color: colors.white,
          }}
        >
          <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
            <motion.h1
              className="text-xl md:text-2xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              Smart Ballot
            </motion.h1>
            <motion.p
              className="text-sm md:text-base font-medium truncate"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {updatedUser.NAME}
            </motion.p>
          </div>
        </header>

        <motion.div
          className="max-w-5xl mx-auto p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Dashboard Title */}
          <div className="text-center mb-8">
            <motion.h2
              className="text-2xl md:text-3xl font-semibold"
              style={{ color: colors.darkGray, letterSpacing: "0.05em" }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              Voter Dashboard
            </motion.h2>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              {
                title: "New Registration",
                desc: "Register as a general elector",
                icon: "➕",
                action: "Register",
                bg: colors.white,
                text: colors.darkGray,
              },
              {
                title: "Overseas Registration",
                desc: "For citizens abroad",
                icon: "🌐",
                action: "Register Overseas",
                bg: colors.lightGray,
                text: colors.darkGray,
              },
              {
                title: "File Complaint",
                desc: "Share feedback or issues",
                icon: "📩",
                action: "Complain",
                bg: colors.white,
                text: colors.darkGray,
              },
              {
                title: "Track Application",
                desc: "Check your form status",
                icon: "📍",
                action: "Track",
                bg: colors.lightGray,
                text: colors.darkGray,
              },
              {
                title: "Electoral Roll",
                desc: "Search voter details",
                icon: "🔍",
                action: "Search",
                bg: colors.white,
                text: colors.darkGray,
              },
              {
                title: "Download E-EPIC",
                desc: "Get your digital voter ID",
                icon: "📥",
                action: "Download E-EPIC",
                bg: colors.lightGray,
                text: colors.darkGray,
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-xl shadow-sm hover:shadow-lg transition-shadow"
                style={{
                  background: card.bg,
                  color: card.text,
                  border: `1px solid ${colors.accentGray}`,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4, ease: "easeInOut" }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2" style={{ color: colors.saffron }}>
                    {card.icon}
                  </span>
                  <h3 className="text-base font-medium">{card.title}</h3>
                </div>
                <p className="text-xs mb-3">{card.desc}</p>
                <button
                  className="px-3 py-1 text-sm rounded-md hover:bg-opacity-90 transition-colors"
                  style={{ background: colors.saffron, color: colors.white }}
                  onClick={() => handleAction(card.action)}
                  aria-label={`Perform ${card.action} action`}
                  tabIndex={0}
                >
                  {card.action}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Stunning 3D Voter ID Card */}
          <motion.section
            className="w-full max-w-[360px] mx-auto mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ perspective: "1200px" }}
            aria-label="Voter ID Card"
          >
            <motion.div
              className="relative transition-all duration-300 hover:shadow-[0_0_16px_rgba(255,153,51,0.6)]"
              style={{
                width: "360px",
                height: "240px",
                transformStyle: "preserve-3d",
              }}
              animate={{
                rotateY: [0, 180, 180, 360],
                scale: [1, 1.02, 1.02, 1],
                boxShadow: [
                  "0 10px 20px rgba(0, 0, 0, 0.25)",
                  "0 12px 22px rgba(0, 0, 0, 0.3)",
                  "0 12px 22px rgba(0, 0, 0, 0.3)",
                  "0 10px 20px rgba(0, 0, 0, 0.25)",
                ],
              }}
              transition={{
                rotateY: { repeat: Infinity, duration: 6, times: [0, 0.17, 0.5, 0.67], ease: "easeInOut" },
                scale: { repeat: Infinity, duration: 6, times: [0, 0.17, 0.5, 0.67], ease: "easeInOut" },
                boxShadow: { repeat: Infinity, duration: 6, times: [0, 0.17, 0.5, 0.67], ease: "easeInOut" },
              }}
              whileHover={{ rotateY: 0 }}
            >
              {/* Front Side */}
              <div
                className="absolute w-full h-full"
                style={{
                  backfaceVisibility: "hidden",
                  background: `linear-gradient(180deg, rgba(255, 153, 51, 0.15) 0%, ${colors.white} 33%, ${colors.white} 66%, rgba(19, 136, 8, 0.15) 100%)`,
                  border: `2px solid`,
                  borderImage: `linear-gradient(to right, ${colors.saffron}, ${colors.accentSaffron}) 1`,
                  borderRadius: "12px",
                  padding: "12px",
                  boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.05)",
                  overflow: "hidden",
                }}
              >
                <div className="relative w-full h-full flex flex-col">
                  {/* Saffron Circle */}
                  <img
                    src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><circle cx='60' cy='60' r='60' fill='%23FF9933'/></svg>"
                    alt="Saffron circle"
                    className="absolute w-[120px] h-[120px] m-auto inset-0 opacity-[0.05]"
                    style={{ pointerEvents: "none", zIndex: 1 }}
                    aria-hidden="true"
                  />
                  {/* Watermark */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><circle cx="50" cy="50" r="40" fill="${encodeURIComponent(
                        colors.saffron
                      )}" /><text x="50" y="55" font-size="12" text-anchor="middle" fill="${encodeURIComponent(
                        colors.darkGray
                      )}">ECI</text></svg>') no-repeat center`,
                      backgroundSize: "120px",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                    aria-hidden="true"
                  />
                  {/* Holographic Pattern */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(45deg, rgba(255, 153, 51, 0.2), rgba(234, 88, 12, 0.15), transparent)`,
                      pointerEvents: "none",
                      zIndex: 3,
                    }}
                    animate={{ opacity: [0.2, 0.3, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    aria-hidden="true"
                  />
                  {/* Indian Emblem */}
                  <img
                    src="../../public/emblem.jpeg"
                    alt="Indian Emblem"
                    className="w-16 h-20 opacity-40 absolute"
                    style={{
                      filter: "",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      pointerEvents: "none",
                      zIndex: 5,
                    }}
                    aria-hidden="true"
                  />
                  {/* Titles */}
                  <div className="text-center mb-2 relative" style={{ zIndex: 10 }}>
                    <h2
                      className="text-base font-bold"
                      style={{
                        color: colors.saffron,
                        letterSpacing: "0.08em",
                        textShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      }}
                    >
                      Election Commission of India
                    </h2>
                    <p
                      className="text-sm font-bold"
                      style={{
                        color: colors.saffron,
                        marginTop: "4px",
                        letterSpacing: "0.08em",
                        textShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      }}
                    >
                      Voter ID
                    </p>
                  </div>
                  {/* Main Content */}
                  <div className="flex items-start flex-grow" style={{ zIndex: 10 }}>
                    <motion.img
                      src={updatedUser.IMAGE}
                      alt="Voter photo"
                      className="w-[100px] h-[120px]"
                      style={{
                        border: `2px solid ${colors.saffron}`,
                        boxShadow: `0 0 4px rgba(255, 153, 51, 0.4)`,
                        borderRadius: "4px",
                        position: "absolute",
                        left: "8px",
                        top: "48px",
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                    <div
                      className="flex flex-col gap-0.5 ml-[116px]"
                      style={{ maxWidth: "160px", fontSize: "10px" }}
                    >
                      <div>
                        <label
                          className="text-[9px] font-medium uppercase"
                          style={{ color: colors.darkGray }}
                        >
                          Voter Id Number
                        </label>
                        <p
                          className="font-semibold font-mono truncate"
                          style={{ color: colors.darkGray }}
                        >
                          {maskRFID(updatedUser.RFID_NO)}
                          
                           
                        </p>
                      </div>
                      <div>
                        <label
                          className="text-[9px] font-medium uppercase"
                          style={{ color: colors.darkGray }}
                        >
                          Full Name
                        </label>
                        <p
                          className="font-semibold truncate"
                          style={{ color: colors.darkGray }}
                        >
                          {updatedUser.NAME}
                          
                        </p>
                      </div>
                      <div>
                        <label
                          className="text-[9px] font-medium uppercase"
                          style={{ color: colors.darkGray }}
                        >
                          DOB
                        </label>
                        <p
                          className="font-semibold truncate"
                          style={{ color: colors.darkGray }}
                        >
                          {updatedUser.DOB}
                         
                        </p>
                      </div>
                      <div>
                        <label
                          className="text-[9px] font-medium uppercase"
                          style={{ color: colors.darkGray }}
                        >
                          Gender
                        </label>
                        <p
                          className="font-semibold truncate"
                          style={{ color: colors.darkGray }}
                        >
                          {updatedUser.GENDER}
                         
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back Side */}
              <div
                className="absolute w-full h-full"
                style={{
                  backfaceVisibility: "hidden",
                  background: `linear-gradient(180deg, rgba(255, 153, 51, 0.15) 0%, ${colors.white} 33%, ${colors.white} 66%, rgba(19, 136, 8, 0.15) 100%)`,
                  border: `2px solid`,
                  borderImage: `linear-gradient(to right, ${colors.saffron}, ${colors.accentSaffron}) 1`,
                  borderRadius: "12px",
                  padding: "12px",
                  transform: "rotateY(180deg)",
                  boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.05)",
                  overflow: "hidden",
                }}
              >
                <div className="relative w-full h-full flex flex-col">
                  {/* Saffron Circle */}
                  <img
                    src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><circle cx='60' cy='60' r='60' fill='%23FF9933'/></svg>"
                    alt="Saffron circle"
                    className="absolute w-[120px] h-[120px] m-auto inset-0 opacity-[0.05]"
                    style={{ pointerEvents: "none", zIndex: 1 }}
                    aria-hidden="true"
                  />
                  {/* Watermark */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><circle cx="50" cy="50" r="40" fill="${encodeURIComponent(
                        colors.saffron
                      )}" /><text x="50" y="55" font-size="12" text-anchor="middle" fill="${encodeURIComponent(
                        colors.darkGray
                      )}">ECI</text></svg>') no-repeat center`,
                      backgroundSize: "120px",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                    aria-hidden="true"
                  />
                  {/* Holographic Pattern */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(45deg, rgba(255, 153, 51, 0.2), rgba(234, 88, 12, 0.15), transparent)`,
                      pointerEvents: "none",
                      zIndex: 3,
                    }}
                    animate={{ opacity: [0.2, 0.3, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    aria-hidden="true"
                  />
                  {/* Indian Emblem */}
                  <img
                    src="../../public/emblem.jpeg"
                    alt="Indian Emblem"
                    className="w-16 h-20 opacity-40 absolute"
                    style={{
                      filter: "",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      pointerEvents: "none",
                      zIndex: 5,
                    }}
                    aria-hidden="true"
                  />
                  {/* Title */}
                  <div className="text-center mb-2 relative" style={{ zIndex: 10 }}>
                    <h2
                      className="text-base font-bold"
                      style={{
                        color: colors.saffron,
                        letterSpacing: "0.08em",
                        textShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      }}
                    >
                      Election Commission of India
                    </h2>
                  </div>
                  <div className="flex-grow flex flex-col justify-between mt-8 relative" style={{ zIndex: 10 }}>
                    <div className="pl-3">
                      <div>
                        <label
                          className="text-[9px] font-medium uppercase"
                          style={{ color: colors.darkGray }}
                        >
                          Address
                        </label>
                        <p
                          className="text-[10px] font-medium truncate"
                          style={{ color: colors.darkGray, maxWidth: "160px" }}
                        >
                          {updatedUser.PERMANENT_ADDRESS}
                          
                           
                        </p>
                      </div>
                      <div>
                        <label
                          className="text-[9px] font-medium uppercase"
                          style={{ color: colors.darkGray }}
                        >
                          Phone
                        </label>
                        <p
                          className="text-[10px] font-medium truncate"
                          style={{ color: colors.darkGray, maxWidth: "160px" }}
                        >
                          {updatedUser.PHN_NO}
                          
                          
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABYSURBVGhD7cEBAQAAAMKg9U9tCF8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACc4AG4AAfB6keWAAAAAElFTkSuQmCC"
                        alt="QR Code"
                        className="w-20 h-20 opacity-50"
                      />
                      <div
                        className="w-[100px] h-5 flex items-center justify-center mt-2"
                        style={{ background: colors.white, border: `1px solid ${colors.accentGray}` }}
                      >
                        <p
                          className="text-[10px] font-medium italic"
                          style={{ color: colors.darkGray }}
                        >
                          Authorized Signature
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* Profile Details */}
          <motion.div
            className="w-full bg-white rounded-xl p-6 shadow-sm"
            style={{ border: `1px solid ${colors.accentGray}` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.darkGray }}>
              Voter Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name", value: updatedUser.NAME },
                { label: "Email", value: updatedUser.EMAIL },
                { label: "Phone", value: updatedUser.PHN_NO },
                { label: "Aadhaar", value: updatedUser.AADHAAR },
                { label: "E-EPIC", value: updatedUser.E_EPIC },
                { label: "Address", value: updatedUser.PERMANENT_ADDRESS },
                { label: "Gender", value: updatedUser.GENDER },
              ].map((field, index) => (
                <motion.div
                  key={index}
                  className="p-3 rounded-lg"
                  style={{ background: colors.lightGray }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4, ease: "easeInOut" }}
                >
                  <label
                    className="text-xs font-medium block mb-1"
                    style={{ color: colors.darkGray }}
                  >
                    {field.label}
                  </label>
                  <p className="text-sm truncate" style={{ color: colors.darkGray }}>
                    {field.value || "Not Provided"}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </VoterErrorBoundary>
  );
}