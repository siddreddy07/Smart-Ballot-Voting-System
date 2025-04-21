import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useVerificationOfficer } from "../context/VerificationOfficerContext";
import { motion } from "framer-motion";

const CandidateTokenDetails = () => {
  const { id } = useParams();
  const { getUserDetails, updateUserDetails } = useVerificationOfficer();

  const [details, setDetails] = useState({
    tokenId: "TOKEN123456",
    name: "",
    parentName: "",
    dob: "",
    aadharCardNo: "",
    phoneNumber: "",
    currentAddress: "",
    permanentAddress: "",
    photo: localStorage.getItem("candidate_photo") || "",
    email: "",
    rfidNo: "",
    fingerprint: "",
  });

  const [showVirtualId, setShowVirtualId] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scanError, setScanError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showCardAtBottom, setShowCardAtBottom] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const pollingRef = useRef(null);

  const hasPhoto = !!details.photo;
  const hasCredentials = !!details.rfidNo && !!details.fingerprint;

  // Saffron theme colors
  const colors = {
    saffron: "#f97316",
    lightSaffron: "#ffedd5",
    white: "#FFFFFF",
    darkGray: "#2D2D2D",
    lightGray: "#E0E0E0",
    accentSaffron: "#ea580c",
  };

  // Fetch user details on mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!id) return;
      try {
        const userData = await getUserDetails(id);
        if (userData) {
          setDetails((prev) => ({
            ...prev,
            name: userData.NAME || "",
            parentName: userData.PARENT_NAME || "",
            dob: userData.DOB ? new Date(userData.DOB).toISOString().split("T")[0] : "",
            aadharCardNo: userData.AADHAR_CARD || "",
            phoneNumber: userData.PHN_NO || "",
            currentAddress: userData.PRESENT_ADDRESS || "",
            permanentAddress: userData.PERMANENT_ADDRESS || "",
            email: userData.EMAIL || "",
            rfidNo: userData.RFID_NO || "",
            fingerprint: userData.FINGERPRINT || "",
          }));
        }
      } catch (error) {
        setScanError("Failed to fetch user details");
      }
    };
    fetchUserDetails();
  }, [id]);

  // Cleanup polling and camera on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Camera functions
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsCameraActive(true);
      }
    } catch (err) {
      setScanError("Failed to access camera");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  const openCameraModal = () => {
    setShowCameraModal(true);
    setTimeout(() => startCamera(), 300);
  };

  const closeCameraModal = () => {
    stopCamera();
    setShowCameraModal(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
      const photo = canvas.toDataURL("image/jpeg");
      localStorage.setItem("candidate_photo", photo);
      setDetails((prev) => ({ ...prev, photo }));
      closeCameraModal();
      
    }
  };

  // Scan modal functions
  const openScanModal = () => {
    setShowScanModal(true);
    setIsScanning(false);
    setScanSuccess(false);
    setScanError("");
  };

  const closeScanModal = () => {
    setShowScanModal(false);
    setIsScanning(false);
    setScanSuccess(false);
    setScanError("");
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const startScanning = async () => {
    if (isScanning || pollingRef.current) return;
    setIsScanning(true);
    setScanSuccess(false);
    setScanError("");

    try {
      const response = await fetch("http://192.168.124.83:5000/api/start-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const responseData = await response.json();
      if (!response.ok || responseData.message !== "Registration task queued") {
        throw new Error(responseData.message || "Failed to queue registration task");
      }

      const timeout = setTimeout(() => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          setIsScanning(false);
          setScanError("Scan timed out. Please try again.");
        }
      }, 60000);

      pollingRef.current = setInterval(async () => {
        try {
          const taskResponse = await fetch("http://192.168.124.83:5000/api/check-task", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const taskData = await taskResponse.json();
          if (!taskResponse.ok) {
            throw new Error(taskData.message || "Failed to check task status");
          }

          if (!taskData || taskData.task === "none") {
            const resultResponse = await fetch("http://192.168.124.83:5000/api/get-registration-result", {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            });
            const resultData = await resultResponse.json();
            if (!resultResponse.ok) {
              throw new Error(resultData.message || "Failed to get registration result");
            }

            if (resultData.success) {
              clearInterval(pollingRef.current);
              pollingRef.current = null;
              clearTimeout(timeout);
              setDetails((prev) => ({
                ...prev,
                rfidNo: resultData.rfidUID || `IN${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                fingerprint: String(resultData.fingerprintID || "scanned"),
              }));
              setIsScanning(false);
              setScanSuccess(true);
            }
          }
        } catch (error) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          clearTimeout(timeout);
          setIsScanning(false);
          setScanError(`Failed to complete scan: ${error.message}`);
        }
      }, 2000);
    } catch (error) {
      setIsScanning(false);
      setScanError(`Failed to start scan: ${error.message}`);
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }
  };

  const retryScan = () => {
    setIsScanning(false);
    setScanSuccess(false);
    setScanError("");
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setDetails((prev) => ({ ...prev, rfidNo: "", fingerprint: "" }));
  };

  const generateVirtualId = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setShowVirtualId(false);
      setShowCardAtBottom(true);
    }, 2000);
    setShowVirtualId(true);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const updates = {};
    if (details.email) updates.EMAIL = details.email;
    if (details.phoneNumber) updates.PHN_NO = details.phoneNumber;
    if (details.photo) updates.IMAGE = details.photo;
    if (details.rfidNo) updates.RFID_NO = details.rfidNo;
    if (details.fingerprint) updates.FINGERPRINT = details.fingerprint;

    console.log(details)

    if (Object.keys(updates).length === 0) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setIsSaving(false);
      }, 2000);
      return;
    }

    try {
      const result = await updateUserDetails(id, updates);
      if (result) {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          setIsSaving(false);
        }, 2000);
      }
    } catch (error) {
      setScanError("Failed to save changes");
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${colors.white} 0%, rgba(255, 170, 51, 0.1) 100%)`,
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          backgroundColor: colors.white,
          borderRadius: "20px",
          boxShadow: `0 10px 30px rgba(0,0,0,0.1)`,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <motion.div
          style={{
            background: `linear-gradient(to right, ${colors.saffron}, ${colors.accentSaffron})`,
            color: colors.white,
            padding: "30px 40px",
            textAlign: "center",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              margin: 0,
              letterSpacing: "1px",
            }}
          >
            Candidate Registration Portal
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: colors.lightSaffron,
              marginTop: "10px",
              opacity: 0.9,
            }}
          >
            Securely register your futuristic ID
          </p>
        </motion.div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "40px",
            padding: "40px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: "1",
              minWidth: "300px",
              display: "flex",
              flexDirection: "column",
              gap: "30px",
            }}
          >
            <motion.div
              style={{
                backgroundColor: colors.white,
                borderRadius: "16px",
                padding: "30px",
                boxShadow: `0 6px 20px rgba(0,0,0,0.1)`,
                border: `1px solid ${colors.lightGray}`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: colors.darkGray,
                  marginBottom: "20px",
                }}
              >
                Personal Information
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                {[
                  { label: "Full Name", key: "name", type: "text", readOnly: true },
                  { label: "Date of Birth", key: "dob", type: "date", readOnly: true },
                  { label: "Parent Name", key: "parentName", type: "text", readOnly: true },
                  { label: "Aadhar Card No", key: "aadharCardNo", type: "text", readOnly: true },
                  { label: "Phone Number", key: "phoneNumber", type: "tel", readOnly: false },
                  { label: "Email", key: "email", type: "email", readOnly: false },
                ].map((field) => (
                  <div key={field.key} style={{ display: "flex", flexDirection: "column" }}>
                    <label
                      style={{
                        fontSize: "14px",
                        color: colors.darkGray,
                        marginBottom: "8px",
                        fontWeight: "500",
                      }}
                    >
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={details[field.key] || ""}
                      onChange={(e) =>
                        !field.readOnly &&
                        setDetails((prev) => ({ ...prev, [field.key]: e.target.value }))
                      }
                      placeholder={field.label}
                      readOnly={field.readOnly}
                      style={{
                        padding: "12px",
                        borderRadius: "10px",
                        border: `1px solid ${colors.lightGray}`,
                        backgroundColor: field.readOnly ? colors.lightSaffron : colors.white,
                        fontSize: "15px",
                        outline: "none",
                        transition: "all 0.3s ease",
                        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                      }}
                      onFocus={(e) =>
                        !field.readOnly && (e.target.style.borderColor = colors.saffron)
                      }
                      onBlur={(e) =>
                        !field.readOnly && (e.target.style.borderColor = colors.lightGray)
                      }
                      aria-label={field.label}
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              style={{
                backgroundColor: colors.white,
                borderRadius: "16px",
                padding: "30px",
                boxShadow: `0 6px 20px rgba(0,0,0,0.1)`,
                border: `1px solid ${colors.lightGray}`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: colors.darkGray,
                  marginBottom: "20px",
                }}
              >
                Address Information
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  { label: "Current Address", key: "currentAddress", type: "text", readOnly: true },
                  { label: "Permanent Address", key: "permanentAddress", type: "text", readOnly: true },
                ].map((field) => (
                  <div key={field.key} style={{ display: "flex", flexDirection: "column" }}>
                    <label
                      style={{
                        fontSize: "14px",
                        color: colors.darkGray,
                        marginBottom: "8px",
                        fontWeight: "500",
                      }}
                    >
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={details[field.key] || ""}
                      onChange={(e) =>
                        !field.readOnly &&
                        setDetails((prev) => ({ ...prev, [field.key]: e.target.value }))
                      }
                      placeholder={field.label}
                      readOnly={field.readOnly}
                      style={{
                        padding: "12px",
                        borderRadius: "10px",
                        border: `1px solid ${colors.lightGray}`,
                        backgroundColor: field.readOnly ? colors.lightSaffron : colors.white,
                        fontSize: "15px",
                        outline: "none",
                        transition: "all 0.3s ease",
                        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                      }}
                      onFocus={(e) =>
                        !field.readOnly && (e.target.style.borderColor = colors.saffron)
                      }
                      onBlur={(e) =>
                        !field.readOnly && (e.target.style.borderColor = colors.lightGray)
                      }
                      aria-label={field.label}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div
            style={{
              width: "300px",
              display: "flex",
              flexDirection: "column",
              gap: "30px",
            }}
          >
            <motion.div
              style={{
                backgroundColor: colors.white,
                borderRadius: "16px",
                padding: "30px",
                boxShadow: `0 6px 20px rgba(0,0,0,0.1)`,
                border: `1px solid ${colors.lightGray}`,
                textAlign: "center",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: colors.darkGray,
                  marginBottom: "20px",
                }}
              >
                Photo
              </h2>
              <div
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "center",
                  gap: "20px",
                }}
              >
                {/* Current Photo */}
                {details.photo ? (
                  <img
                    src={details.photo}
                    alt="Candidate"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
                      border: `2px solid ${colors.saffron}`,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      backgroundColor: colors.lightSaffron,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: colors.darkGray,
                      fontSize: "16px",
                      fontWeight: "500",
                      boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
                    }}
                  >
                    No Photo
                  </div>
                )}
                {/* Placeholder for capturing new photo */}
                <motion.div
                  onClick={openCameraModal}
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    backgroundColor: colors.lightSaffron,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: colors.darkGray,
                    fontSize: "16px",
                    fontWeight: "500",
                    boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
                    cursor: "pointer",
                    border: `2px dashed ${colors.saffron}`,
                  }}
                  whileHover={{ scale: 1.05, backgroundColor: colors.lightGray }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Capture or retake candidate photo"
                >
                  {details.photo ? "Retake" : "Capture"}
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              style={{
                backgroundColor: colors.white,
                borderRadius: "16px",
                padding: "30px",
                boxShadow: `0 6px 20px rgba(0,0,0,0.1)`,
                border: `1px solid ${colors.lightGray}`,
                textAlign: "center",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: colors.darkGray,
                  marginBottom: "20px",
                }}
              >
                Credentials
              </h2>
              <motion.button
                onClick={openScanModal}
                style={{
                  backgroundColor: colors.saffron,
                  color: colors.white,
                  padding: "12px 20px",
                  borderRadius: "10px",
                  border: "none",
                  fontSize: "15px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: `0 4px 12px rgba(249,115,22,0.3)`,
                }}
                whileHover={{ scale: 1.05, backgroundColor: colors.accentSaffron }}
                whileTap={{ scale: 0.95 }}
                aria-label="Scan RFID or fingerprint"
              >
                Scan RFID/Fingerprint
              </motion.button>
            </motion.div>

            <motion.button
              onClick={generateVirtualId}
              disabled={!hasPhoto || !hasCredentials}
              style={{
                backgroundColor: hasPhoto && hasCredentials ? colors.saffron : colors.lightGray,
                color: colors.white,
                padding: "16px",
                borderRadius: "10px",
                border: "none",
                fontSize: "16px",
                fontWeight: "600",
                cursor: hasPhoto && hasCredentials ? "pointer" : "not-allowed",
                transition: "all 0.3s ease",
                boxShadow: hasPhoto && hasCredentials
                  ? `0 4px 12px rgba(249,115,22,0.3)`
                  : "none",
              }}
              whileHover={
                hasPhoto && hasCredentials
                  ? { scale: 1.05, backgroundColor: colors.accentSaffron }
                  : {}
              }
              whileTap={hasPhoto && hasCredentials ? { scale: 0.95 } : {}}
              aria-label="Generate virtual voter ID"
            >
              Generate Virtual Voter ID
            </motion.button>

            <motion.button
              onClick={handleSaveChanges}
              disabled={isSaving}
              style={{
                backgroundColor: isSaving ? colors.lightGray : colors.saffron,
                color: colors.white,
                padding: "16px",
                borderRadius: "10px",
                border: "none",
                fontSize: "16px",
                fontWeight: "600",
                cursor: isSaving ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: isSaving ? "none" : `0 4px 12px rgba(249,115,22,0.3)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
              whileHover={isSaving ? {} : { scale: 1.05, backgroundColor: colors.accentSaffron }}
              whileTap={isSaving ? {} : { scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              aria-label="Save changes"
            >
              {isSaving ? (
                <>
                  <style>
                    {`
                      @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    `}
                  </style>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      border: `3px solid ${colors.white}`,
                      borderTop: `3px solid ${colors.saffron}`,
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      marginRight: "8px",
                    }}
                  />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </motion.button>
          </div>
        </div>

        {showCardAtBottom && (
          <motion.div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "40px",
              backgroundColor: colors.white,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >
            <div
              style={{
                width: "380px",
                height: "240px",
                backgroundColor: colors.white,
                borderRadius: "20px",
                boxShadow: `0 10px 30px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.5)`,
                padding: "24px",
                color: colors.darkGray,
                fontFamily: "'Inter', sans-serif",
                position: "relative",
                border: `2px solid ${colors.saffron}`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "24px",
                  left: "24px",
                  width: "60px",
                  height: "60px",
                  background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${encodeURIComponent(
                    colors.saffron
                  )}"><circle cx="12" cy="12" r="10"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="${encodeURIComponent(
                    colors.white
                  )}"/></svg>') no-repeat center`,
                  backgroundSize: "contain",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "24px",
                  left: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    margin: 0,
                    color: colors.darkGray,
                  }}
                >
                  {details.name || "Candidate Name"}
                </p>
                <p
                  style={{
                    fontSize: "15px",
                    color: colors.darkGray,
                    margin: 0,
                  }}
                >
                  DOB: {details.dob || "DD-MM-YYYY"}
                </p>
                <p
                  style={{
                    fontSize: "17px",
                    color: colors.saffron,
                    fontWeight: "600",
                    margin: 0,
                    letterSpacing: "1.2px",
                  }}
                >
                  RFID: {details.rfidNo || `IN${Math.random().toString(36).substr(2, 6).toUpperCase()}`}
                </p>
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(45deg, rgba(255,149,51,0.1) 0%, rgba(255,255,255,0) 50%)`,
                  borderRadius: "20px",
                  pointerEvents: "none",
                }}
              />
            </div>
          </motion.div>
        )}

        {showVirtualId && (
          <motion.div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "380px",
              height: "240px",
              backgroundColor: colors.white,
              borderRadius: "20px",
              boxShadow: `0 10px 30px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.5)`,
              padding: "24px",
              color: colors.darkGray,
              fontFamily: "'Inter', sans-serif",
              zIndex: 100,
              border: `2px solid ${colors.saffron}`,
            }}
            initial={{ opacity: 0, rotateX: -15, rotateY: -15 }}
            animate={{ opacity: 1, rotateX: 0, rotateY: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div
              style={{
                position: "absolute",
                top: "24px",
                left: "24px",
                width: "60px",
                height: "60px",
                background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${encodeURIComponent(
                  colors.saffron
                )}"><circle cx="12" cy="12" r="10"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="${encodeURIComponent(
                  colors.white
                )}"/></svg>') no-repeat center`,
                backgroundSize: "contain",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "24px",
                left: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  margin: 0,
                  color: colors.darkGray,
                }}
              >
                {details.name || "Candidate Name"}
              </p>
              <p
                style={{
                  fontSize: "15px",
                  color: colors.darkGray,
                  margin: 0,
                }}
              >
                DOB: {details.dob || "DD-MM-YYYY"}
              </p>
              <p
                style={{
                  fontSize: "17px",
                  color: colors.saffron,
                  fontWeight: "600",
                  margin: 0,
                  letterSpacing: "1.2px",
                }}
              >
                RFID: {details.rfidNo || `IN${Math.random().toString(36).substr(2, 6).toUpperCase()}`}
              </p>
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(45deg, rgba(255,149,51,0.1) 0%, rgba(255,255,255,0) 50%)`,
                borderRadius: "20px",
                pointerEvents: "none",
              }}
            />
          </motion.div>
        )}

        {showToast && (
          <motion.div
            style={{
              position: "fixed",
              bottom: "30px",
              right: "30px",
              backgroundColor: colors.saffron,
              color: colors.white,
              padding: "14px 28px",
              borderRadius: "10px",
              boxShadow: `0 6px 20px rgba(249,115,22,0.3)`,
              zIndex: 150,
              fontSize: "15px",
              fontWeight: "500",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            role="alert"
            aria-live="polite"
          >
            {isSaving ? "Saving changes..." : "Changes saved!"}
          </motion.div>
        )}

        {showCameraModal && (
          <motion.div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              padding: "20px",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              style={{
                backgroundColor: colors.white,
                borderRadius: "16px",
                padding: "30px",
                maxWidth: "450px",
                width: "100%",
                boxShadow: `0 10px 30px rgba(0,0,0,0.2)`,
                position: "relative",
                border: `1px solid ${colors.lightGray}`,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={closeCameraModal}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "none",
                  border: "none",
                  color: colors.darkGray,
                  cursor: "pointer",
                  fontSize: "24px",
                  transition: "color 0.3s ease",
                }}
                onMouseOver={(e) => (e.target.style.color = colors.saffron)}
                onMouseOut={(e) => (e.target.style.color = colors.darkGray)}
                aria-label="Close camera modal"
              >
                ✕
              </button>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: colors.darkGray,
                  marginBottom: "20px",
                }}
              >
                Capture Photo
              </h3>
              <video
                ref={videoRef}
                autoPlay
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  backgroundColor: colors.lightSaffron,
                  border: `1px solid ${colors.lightGray}`,
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px", marginTop: "20px" }}>
                <motion.button
                  onClick={capturePhoto}
                  style={{
                    backgroundColor: colors.saffron,
                    color: colors.white,
                    padding: "12px 20px",
                    borderRadius: "10px",
                    border: "none",
                    fontSize: "15px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: `0 4px 12px rgba(249,115,22,0.3)`,
                  }}
                  whileHover={{ scale: 1.05, backgroundColor: colors.accentSaffron }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Capture photo"
                >
                  Capture
                </motion.button>
                <motion.button
                  onClick={closeCameraModal}
                  style={{
                    backgroundColor: colors.white,
                    color: colors.saffron,
                    padding: "12px 20px",
                    borderRadius: "10px",
                    border: `1px solid ${colors.saffron}`,
                    fontSize: "15px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
                  }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: colors.lightSaffron,
                    borderColor: colors.accentSaffron,
                    color: colors.accentSaffron,
                  }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Cancel photo capture"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showScanModal && (
          <motion.div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              padding: "20px",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              style={{
                backgroundColor: colors.white,
                borderRadius: "16px",
                padding: "30px",
                maxWidth: "450px",
                width: "100%",
                boxShadow: `0 10px 30px rgba(0,0,0,0.2)`,
                position: "relative",
                border: `1px solid ${colors.lightGray}`,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={closeScanModal}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "none",
                  border: "none",
                  color: colors.darkGray,
                  cursor: "pointer",
                  fontSize: "24px",
                  transition: "color 0.3s ease",
                }}
                onMouseOver={(e) => (e.target.style.color = colors.saffron)}
                onMouseOut={(e) => (e.target.style.color = colors.darkGray)}
                aria-label="Close scan modal"
              >
                ✕
              </button>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: colors.darkGray,
                  marginBottom: "20px",
                }}
              >
                Scan Credentials
              </h3>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                {isScanning ? (
                  <div style={{ width: "140px", height: "140px", position: "relative" }}>
                    <style>
                      {`
                        @keyframes spin {
                          0% { transform: rotate(0deg); }
                          100% { transform: rotate(360deg); }
                        }
                        @keyframes pulse {
                          0%, 100% { opacity: 0.5; }
                          50% { opacity: 1; }
                        }
                      `}
                    </style>
                    <div
                      style={{
                        position: "absolute",
                        width: "100px",
                        height: "100px",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        border: `10px solid ${colors.lightSaffron}`,
                        borderTop: `10px solid ${colors.saffron}`,
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        width: "50px",
                        height: "50px",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: colors.saffron,
                        borderRadius: "50%",
                        animation: "pulse 1.5s ease-in-out infinite",
                      }}
                    />
                  </div>
                ) : scanSuccess ? (
                  <div
                    style={{
                      width: "140px",
                      height: "140px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      style={{ width: "80px", height: "80px", color: colors.saffron }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                ) : scanError ? (
                  <div
                    style={{
                      width: "140px",
                      height: "140px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      style={{ width: "80px", height: "80px", color: "#ff3333" }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </div>
                ) : (
                  <div
                    style={{
                      width: "140px",
                      height: "140px",
                      backgroundColor: colors.lightSaffron,
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
                    }}
                  >
                    <svg
                      style={{ width: "60px", height: "60px", color: colors.darkGray }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4m4-4c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4m4-4c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <p
                style={{
                  color: scanError ? "#ff3333" : colors.darkGray,
                  textAlign: "center",
                  fontSize: "15px",
                  marginBottom: "20px",
                  fontWeight: "500",
                }}
              >
                {isScanning
                  ? "Scanning credentials..."
                  : scanSuccess
                  ? "Scan successful!"
                  : scanError
                  ? scanError
                  : "Place finger or RFID card"}
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
                {!scanSuccess && (
                  <motion.button
                    onClick={startScanning}
                    disabled={isScanning}
                    style={{
                      backgroundColor: isScanning ? colors.lightGray : colors.saffron,
                      color: colors.white,
                      padding: "12px 20px",
                      borderRadius: "10px",
                      border: "none",
                      fontSize: "15px",
                      fontWeight: "500",
                      cursor: isScanning ? "not-allowed" : "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: isScanning ? "none" : `0 4px 12px rgba(249,115,22,0.3)`,
                    }}
                    whileHover={
                      !isScanning ? { scale: 1.05, backgroundColor: colors.accentSaffron } : {}
                    }
                    whileTap={!isScanning ? { scale: 0.95 } : {}}
                    aria-label="Start scanning credentials"
                  >
                    Start Scanning
                  </motion.button>
                )}
                {!scanSuccess && (
                  <motion.button
                    onClick={retryScan}
                    disabled={isScanning}
                    style={{
                      backgroundColor: isScanning ? colors.lightGray : colors.white,
                      color: isScanning ? colors.white : colors.saffron,
                      padding: "12px 20px",
                      borderRadius: "10px",
                      border: isScanning ? "none" : `1px solid ${colors.saffron}`,
                      fontSize: "15px",
                      fontWeight: "500",
                      cursor: isScanning ? "not-allowed" : "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: isScanning ? "none" : `0 4px 12px rgba(0,0,0,0.1)`,
                    }}
                    whileHover={
                      !isScanning
                        ? {
                            scale: 1.05,
                            backgroundColor: colors.lightSaffron,
                            borderColor: colors.accentSaffron,
                            color: colors.accentSaffron,
                          }
                        : {}
                    }
                    whileTap={!isScanning ? { scale: 0.95 } : {}}
                    aria-label="Retry scanning credentials"
                  >
                    Retry
                  </motion.button>
                )}
                {scanSuccess && (
                  <motion.button
                    onClick={closeScanModal}
                    style={{
                      backgroundColor: colors.saffron,
                      color: colors.white,
                      padding: "12px 20px",
                      borderRadius: "10px",
                      border: "none",
                      fontSize: "15px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: `0 4px 12px rgba(249,115,22,0.3)`,
                    }}
                    whileHover={{ scale: 1.05, backgroundColor: colors.accentSaffron }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Close scan modal after success"
                  >
                    Done
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CandidateTokenDetails;