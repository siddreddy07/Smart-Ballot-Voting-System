import React, { useEffect, useState, useRef } from "react";
import { useBoothOfficer } from "../context/BoothOfficerContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function VoterVerificationAtBooth() {
  const { votersAtBooth, getAllVotersAtBooth } = useBoothOfficer();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [time, setTime] = useState(new Date());
  const [showScanPopup, setShowScanPopup] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [retryTimer, setRetryTimer] = useState(0);
  const [voterIdProofs, setVoterIdProofs] = useState({});
  const [timeRemaining, setTimeRemaining] = useState("");
  const [voterList, setVoterList] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scanError, setScanError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const pollingRef = useRef(null);

  let boothOfficer = null;
  try {
    boothOfficer = JSON.parse(localStorage.getItem("boothOfficer")) || {};
  } catch (error) {
    console.error("Error parsing boothOfficer:", error);
  }

  const API_BASE_URL = "http://192.168.124.83:5000/api/authentication";

  useEffect(() => {
    let storedVoters = [];
    try {
      const stored = localStorage.getItem("voterList");
      if (stored) {
        storedVoters = JSON.parse(stored);
        if (!Array.isArray(storedVoters)) storedVoters = [];
      }
      setVoterList(storedVoters);
    } catch (error) {
      console.error("Error parsing voterList:", error);
    }

    const fetchVoters = async () => {
      setIsFetching(true);
      setFetchError("");
      try {
        await getAllVotersAtBooth();
      } catch (error) {
        setFetchError("Failed to fetch voters.");
        setToastMessage("Failed to fetch voters");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } finally {
        setIsFetching(false);
      }
    };

    fetchVoters();
  }, []);

  useEffect(() => {
    if (isFetching || !votersAtBooth || !Array.isArray(votersAtBooth)) return;

    try {
      const storedVoterStatuses = JSON.parse(localStorage.getItem("voterStatuses") || "{}");
      const storedVoterList = JSON.parse(localStorage.getItem("voterList") || "[]");
      const mergedVoters = votersAtBooth.map((voter) => {
        const existingVoter = storedVoterList.find((v) => v.PHN_NO === voter.PHN_NO);
        return {
          ...voter,
          STATUS: storedVoterStatuses[voter.PHN_NO] || existingVoter?.STATUS || voter.STATUS || "Pending",
          isScanVerified: existingVoter?.isScanVerified || false,
          RFID_NO: existingVoter?.RFID_NO || voter.RFID_NO || "",
          FINGERPRINT: existingVoter?.FINGERPRINT || voter.FINGERPRINT || "",
          NAME: voter.NAME || "Unknown",
          PHN_NO: voter.PHN_NO || "",
          IMAGE: voter.IMAGE || "/placeholder.svg",
        };
      });

      setVoterList(mergedVoters);
      if (mergedVoters.length > 0) {
        localStorage.setItem("voterList", JSON.stringify(mergedVoters));
      }
    } catch (error) {
      setFetchError("Error updating voter list");
      setToastMessage("Error updating voter list");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  }, [votersAtBooth, isFetching]);

  useEffect(() => {
    if (voterList.length > 0) {
      try {
        localStorage.setItem("voterList", JSON.stringify(voterList));
      } catch (error) {
        console.error("Save error:", error);
      }
    }
  }, [voterList]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now);
      const endOfVoting = new Date(now);
      endOfVoting.setHours(17, 0, 0, 0);
      if (now > endOfVoting) {
        setTimeRemaining("Voting Closed");
        return;
      }
      const diff = endOfVoting - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (retryTimer > 0) {
      const timer = setTimeout(() => setRetryTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [retryTimer]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, []);

  const filteredVoters = voterList.filter((voter) => {
    const matchesSearch =
      (voter.NAME || "").toLowerCase().includes(search.toLowerCase()) ||
      (voter.PHN_NO || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Pending" && (!voter.STATUS || voter.STATUS === "Pending")) ||
      voter.STATUS === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatTime = (date) => date.toLocaleTimeString("en-GB");

  const openScanPopup = (voter) => {
    setSelectedVoter(voter);
    setShowScanPopup(true);
    setIsScanning(false);
    setScanSuccess(false);
    setScanError("");
    setRetryTimer(0);
  };

  const closeScanPopup = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setShowScanPopup(false);
    setSelectedVoter(null);
    setIsScanning(false);
    setScanSuccess(false);
    setScanError("");
  };

  const openImagePopup = (image) => {
    setSelectedImage(image || "/placeholder.svg");
    setShowImagePopup(true);
  };

  const closeImagePopup = () => {
    setShowImagePopup(false);
    setSelectedImage(null);
  };

  const updateVoterStatus = (phnNo, newStatus) => {
    try {
      setVoterList((prevList) => {
        const updatedList = prevList.map((voter) =>
          voter.PHN_NO === phnNo ? { ...voter, STATUS: newStatus } : voter
        );
        const storedVoterStatuses = JSON.parse(localStorage.getItem("voterStatuses") || "{}");
        storedVoterStatuses[phnNo] = newStatus;
        localStorage.setItem("voterStatuses", JSON.stringify(storedVoterStatuses));
        localStorage.setItem("voterList", JSON.stringify(updatedList));
        return updatedList;
      });
      setToastMessage(`Voter status: ${newStatus}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMessage("Failed to update status");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleIdProofChange = (voter, value) => {
    setVoterIdProofs((prev) => ({
      ...prev,
      [voter.PHN_NO]: value,
    }));
  };

  const handleManualApprove = async (voter) => {
    try {
      console.log('inside manual approve')
      const boothId = boothOfficer?.BOOTH_ID;
      if (!boothId) {
        throw new Error("Booth ID not found in local storage");
      }
      if (!voter.RFID_NO || !voter.FINGERPRINT) {
        throw new Error("Voter RFID or Fingerprint data missing");
      }

      const response = await axios.post('http://localhost:5000/api/auth/booth-officer/verify-voter', {
        S_NO: voter.S_NO,
        BOOTH_ID: boothId,
        RFID_NO: voter.RFID_NO,
        FINGERPRINT: voter.FINGERPRINT,
      });

      if (response.status === 200 && response.data.message === "Voter fully verified! Ready for voting.") {
        updateVoterStatus(voter.PHN_NO, "Approved");
        setToastMessage("Voter manually approved!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        throw new Error(response.data.message || "Failed to manually approve voter");
      }
    } catch (error) {
      setToastMessage(error.message || "Failed to manually approve voter");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleApprove = async (voter) => {
    try {
      const boothId = boothOfficer?.BOOTH_ID;
      if (!boothId) {
        throw new Error("Booth ID not found in local storage");
      }
      if (!voter.RFID_NO || !voter.FINGERPRINT) {
        throw new Error("Voter RFID or Fingerprint data missing");
      }

      const response = await axios.post('http://192.168.124.83:5000/api/auth/booth-officer/verify-voter', {
        S_NO: voter.S_NO,
        BOOTH_ID: boothId,
        RFID_NO: voter.RFID_NO,
        FINGERPRINT: voter.FINGERPRINT,
      });

      if (response.status === 200 && response.data.message === "Voter fully verified! Ready for voting.") {
        updateVoterStatus(voter.PHN_NO, "Approved");
        setToastMessage("Voter approved!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        throw new Error(response.data.message || "Failed to approve voter");
      }
    } catch (error) {
      setToastMessage(error.message || "Failed to approve voter");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleScan = async () => {
    if (isScanning || pollingRef.current) return;

    const fingerprintID = selectedVoter?.FINGERPRINT;
    if (!fingerprintID || fingerprintID === "0") {
      setIsScanning(false);
      setScanError("Invalid or missing fingerprint ID");
      setToastMessage("Invalid fingerprint ID");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    setIsScanning(true);
    setScanSuccess(false);
    setScanError("");

    try {
      const response = await fetch(`${API_BASE_URL}/start-authentication`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprintID }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to start authentication");
      }

      let taskConfirmed = false;
      let pollCount = 0;
      const maxPolls = 30;
      let noneCount = 0;
      const maxNone = 5;

      const taskTimeout = setTimeout(() => {
        if (!taskConfirmed && pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          setIsScanning(false);
          setScanError("Task confirmation timed out");
          setToastMessage("Task confirmation timed out");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      }, 30000);

      pollingRef.current = setInterval(async () => {
        if (!showScanPopup) {
          clearInterval(pollingRef.current);
          clearTimeout(taskTimeout);
          pollingRef.current = null;
          setIsScanning(false);
          return;
        }

        pollCount++;
        try {
          const taskResponse = await fetch(`${API_BASE_URL}/check-task`);
          const taskData = await taskResponse.json();

          if (!taskResponse.ok) {
            throw new Error(taskData.message || "Failed to check task");
          }

          if (taskData.task === "authenticate" && taskData.fingerprintID === fingerprintID) {
            taskConfirmed = true;
            noneCount = 0;
            clearTimeout(taskTimeout);
            clearInterval(pollingRef.current);
            pollingRef.current = null;

            const resultTimeout = setTimeout(() => {
              if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
                setIsScanning(false);
                setScanError("Authentication timed out");
                setToastMessage("Authentication timed out");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
              }
            }, 90000);

            pollingRef.current = setInterval(async () => {
              if (!showScanPopup) {
                clearInterval(pollingRef.current);
                clearTimeout(resultTimeout);
                pollingRef.current = null;
                setIsScanning(false);
                return;
              }

              try {
                const resultResponse = await fetch(`${API_BASE_URL}/get-authentication-result`);
                const resultData = await resultResponse.json();

                if (!resultResponse.ok) {
                  throw new Error(resultData.message || "Failed to get result");
                }

                if (resultData.success === true) {
                  clearInterval(pollingRef.current);
                  clearTimeout(resultTimeout);
                  pollingRef.current = null;
                  setIsScanning(false);
                  setScanSuccess(true);

                  // Update voterList with scanned RFID_NO, FINGERPRINT, and isScanVerified
                  setVoterList((prevList) => {
                    const updatedList = prevList.map((voter) =>
                      voter.PHN_NO === selectedVoter.PHN_NO
                        ? {
                            ...voter,
                            isScanVerified: true,
                            RFID_NO: resultData.RFID_NO || voter.RFID_NO,
                            FINGERPRINT: resultData.FINGERPRINT || voter.FINGERPRINT,
                          }
                        : voter
                    );
                    localStorage.setItem("voterList", JSON.stringify(updatedList));
                    return updatedList;
                  });

                  setToastMessage("Scan verified!");
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 3000);
                } else if (resultData.success === false) {
                  throw new Error(resultData.message || "Authentication failed");
                }
              } catch (error) {
                clearInterval(pollingRef.current);
                clearTimeout(resultTimeout);
                pollingRef.current = null;
                setIsScanning(false);
                setScanError(error.message || "Authentication failed");
                setToastMessage(error.message || "Scan failed");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
              }
            }, 2000);
          } else if (taskData.task === "none") {
            noneCount++;
            if (noneCount >= maxNone) {
              throw new Error("Task not sustained by server/ESP32");
            }
          } else if (pollCount >= maxPolls) {
            throw new Error("Task not found after maximum attempts");
          }
        } catch (error) {
          clearInterval(pollingRef.current);
          clearTimeout(taskTimeout);
          pollingRef.current = null;
          setIsScanning(false);
          setScanError(error.message || "Failed to check task");
          setToastMessage(error.message || "Scan failed");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      }, 1000);
    } catch (error) {
      setIsScanning(false);
      setScanError(error.message || "Failed to start authentication");
      setToastMessage(error.message || "Scan failed");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const retryFetch = async () => {
    setIsFetching(true);
    setFetchError("");
    try {
      await getAllVotersAtBooth();
    } catch (error) {
      setFetchError("Failed to fetch voters.");
      setToastMessage("Failed to fetch voters");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.header
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg mb-10"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center">
            Voter Verification - Booth {boothOfficer?.BOOTH_ID || "Unknown"}
          </h1>
        </motion.header>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <motion.div
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <img
              src={boothOfficer?.User?.IMAGE || "/placeholder.svg"}
              alt="Officer"
              className="w-16 h-16 rounded-full object-cover border-2 border-orange-500"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {boothOfficer?.OFFICER_NAME || "Unknown Officer"}
              </h2>
              <p className="text-sm text-gray-600">RFID: {boothOfficer?.RFID_NO || "N/A"}</p>
            </div>
          </motion.div>
          <motion.div
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-xl font-semibold text-red-600">{timeRemaining || "Calculating..."}</div>
            <div className="text-sm text-gray-600">Time Left to Vote</div>
          </motion.div>
          <motion.div
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-xl font-semibold text-orange-600">{formatTime(time)}</div>
            <div className="text-sm text-gray-600">{formatDate(time)}</div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <motion.div
          className="mb-10 flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="text"
            placeholder="Search by name or phone"
            className="w-full sm:w-80 p-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-2 flex-wrap">
            {["All", "Approved", "Pending", "Reported"].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  statusFilter === status
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Voter Table */}
        <motion.div
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-orange-100 text-orange-800">
                  <th className="p-4 text-left font-semibold">Photo</th>
                  <th className="p-4 text-left font-semibold">Name</th>
                  <th className="p-4 text-left font-semibold">Phone</th>
                  <th className="p-4 text-left font-semibold">ID Proof</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-left font-semibold">Scan</th>
                  <th className="p-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <tr>
                    <td colSpan="7" className="text-center p-6 text-gray-600">
                      Fetching voters...
                    </td>
                  </tr>
                ) : fetchError ? (
                  <tr>
                    <td colSpan="7" className="text-center p-6 text-red-600">
                      {fetchError}
                      <button
                        className="ml-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-300"
                        onClick={retryFetch}
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                ) : voterList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-6 text-gray-600">
                      No voters available.
                    </td>
                  </tr>
                ) : filteredVoters.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-6 text-gray-600">
                      No matching voters found.
                    </td>
                  </tr>
                ) : (
                  filteredVoters.map((voter) => (
                    <motion.tr
                      key={voter.PHN_NO || Math.random()}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-all duration-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="p-4">
                        <img
                          src={voter.IMAGE || "/placeholder.svg"}
                          alt={voter.NAME || "Voter"}
                          className="w-10 h-10 rounded-full object-cover cursor-pointer"
                          onClick={() => openImagePopup(voter.IMAGE)}
                        />
                      </td>
                      <td className="p-4 text-gray-800">{voter.NAME || "Unknown"}</td>
                      <td className="p-4 text-gray-600">{voter.PHN_NO || "N/A"}</td>
                      <td className="p-4">
                        <select
                          value={voterIdProofs[voter.PHN_NO] || ""}
                          onChange={(e) => handleIdProofChange(voter, e.target.value)}
                          className="p-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                        >
                          <option value="" disabled>
                            Select ID
                          </option>
                          <option value="Aadhaar">Aadhaar</option>
                          <option value="PAN">PAN</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            voter.STATUS === "Approved"
                              ? "bg-green-100 text-green-600"
                              : voter.STATUS === "Reported"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {voter.STATUS || "Pending"}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-300"
                          onClick={() => openScanPopup(voter)}
                        >
                          Scan
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 flex-wrap">
                          {voter.isScanVerified && (
                            <button
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                              onClick={() => handleApprove(voter)}
                            >
                              Approve
                            </button>
                          )}
                          {voterIdProofs[voter.PHN_NO] && (
                            <button
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                              onClick={() => handleManualApprove(voter)}
                            >
                              Manual Approve
                            </button>
                          )}
                          <button
                            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all duration-300"
                            onClick={() => updateVoterStatus(voter.PHN_NO, "Pending")}
                          >
                            Reject
                          </button>
                          <button
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                            onClick={() => updateVoterStatus(voter.PHN_NO, "Reported")}
                          >
                            Report
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Scan Popup */}
        <AnimatePresence>
          {showScanPopup && selectedVoter && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeScanPopup}
            >
              <motion.div
                className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl"
                  onClick={closeScanPopup}
                >
                  ×
                </button>
                <h2 className="text-xl font-semibold text-orange-600 mb-4">Verify Voter</h2>

                {/* 3D Flipping Card */}
                <motion.div className="perspective-1200 w-full h-48 mb-6">
                  <motion.div
                    className="relative w-full h-full"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateY: scanSuccess ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    {/* Front Side */}
                    <div className="absolute w-full h-full backface-hidden bg-white rounded-lg p-4 border border-gray-100 shadow-md flex flex-col items-center justify-center">
                      <img
                        src={selectedVoter.IMAGE || "/placeholder.svg"}
                        alt="Voter"
                        className="w-12 h-12 rounded-full mb-2 border-2 border-orange-500"
                      />
                      <p className="text-sm font-medium text-gray-800 text-center">{selectedVoter.NAME || "Unknown"}</p>
                      <p className="text-xs text-gray-600 text-center">Phone: {selectedVoter.PHN_NO || "N/A"}</p>
                      <p className="text-xs text-gray-600 text-center">Status: {selectedVoter.STATUS || "Pending"}</p>
                    </div>

                    {/* Back Side */}
                    <div className="absolute w-full h-full backface-hidden bg-white rounded-lg p-4 border border-gray-100 shadow-md transform rotate-y-180 flex flex-col items-center justify-center">
                      <img
                        src={selectedVoter.IMAGE || "/placeholder.svg"}
                        alt="Voter"
                        className="w-12 h-12 rounded-full mb-2 border-2 border-orange-500"
                      />
                      <p className="text-sm font-medium text-gray-800 text-center">{selectedVoter.NAME || "Unknown"}</p>
                      <p className="text-xs text-gray-600 text-center">RFID: {selectedVoter.RFID_NO || "N/A"}</p>
                      <p className="text-xs text-gray-600 text-center">
                        Fingerprint: {selectedVoter.FINGERPRINT ? `ID ${selectedVoter.FINGERPRINT}` : "N/A"}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Scan Status */}
                <div className="flex justify-center mb-6">
                  {isScanning ? (
                    <motion.div
                      className="w-16 h-16 border-4 border-gray-200 border-t-orange-500 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : scanSuccess ? (
                    <motion.svg
                      className="w-12 h-12 text-green-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </motion.svg>
                  ) : scanError ? (
                    <svg
                      className="w-12 h-12 text-red-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg
                      className="w-12 h-12 text-gray-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4m4-4c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4m4-4c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4"
                      />
                    </svg>
                  )}
                </div>
                <p className={`text-center text-sm mb-6 ${scanError ? "text-red-600" : "text-gray-600"}`}>
                  {isScanning
                    ? "Verifying credentials..."
                    : scanSuccess
                    ? "Verification successful!"
                    : scanError
                    ? scanError
                    : "Scan RFID or fingerprint"}
                </p>

                {/* Scan Buttons */}
                <div className="flex flex-col gap-3">
                  {!scanSuccess && (
                    <motion.button
                      className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-300 ${
                        isScanning ? "bg-gray-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"
                      }`}
                      onClick={handleScan}
                      disabled={isScanning}
                      animate={scanSuccess ? { scale: [1, 1.1, 1], backgroundColor: "#16A34A" } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      Start Scanning
                    </motion.button>
                  )}
                  {!scanSuccess && (
                    <button
                      className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-300 ${
                        retryTimer > 0 || isScanning
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                      onClick={() => {
                        setRetryTimer(30);
                        handleScan();
                      }}
                      disabled={retryTimer > 0 || isScanning}
                    >
                      {retryTimer > 0 ? `Retry in ${retryTimer}s` : "Retry"}
                    </button>
                  )}
                  {scanSuccess && (
                    <button
                      className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-300"
                      onClick={closeScanPopup}
                    >
                      Done
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Popup */}
        <AnimatePresence>
          {showImagePopup && selectedImage && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeImagePopup}
            >
              <motion.div
                className="relative max-w-[90%] p-4"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black bg-opacity-50 text-white flex items-center justify-center"
                  onClick={closeImagePopup}
                >
                  ×
                </button>
                <img
                  src={selectedImage}
                  alt="Voter"
                  className="w-full max-h-[80vh] rounded-lg object-contain shadow-2xl"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              className="fixed bottom-6 right-6 px-6 py-3 bg-orange-600 text-white rounded-lg shadow-lg z-[100]"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .perspective-1200 {
          perspective: 1200px;
        }

        .backface-hidden {
          backface-visibility: hidden;
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}