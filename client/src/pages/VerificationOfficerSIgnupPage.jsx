import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useVerificationOfficer } from "../context/VerificationOfficerContext";

export default function VerificationOfficerSignup() {
  const navigate = useNavigate();
  const { vuser, registerVerificationOfficer } = useVerificationOfficer();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [rfidNo, setRfidNo] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate email: basic email format
  const isEmailValid = email.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Validate form: all fields filled, valid email, and passwords match
  const isFormValid =
    email.trim() &&
    password.trim() &&
    confirmPassword.trim() &&
    supervisor.trim() &&
    rfidNo.trim() &&
    isEmailValid &&
    password === confirmPassword;

  const handleSubmit = async () => {
    if (!email || !password || !confirmPassword || !supervisor || !rfidNo) {
      return toast.error("All fields are required!");
    }
    if (!isEmailValid) {
      return toast.error("Please enter a valid email address!");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    setLoading(true);

    const success = await registerVerificationOfficer({
      EMAIL: email,
      PASSWORD: password,
      SUPERVISOR_NAME: supervisor,
      RFID_NO: rfidNo,
    });

    setLoading(false);

    if (success) {
      console.log(vuser);
      navigate("/vofficer/login");
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-saffron-50 to-white">
      {/* Left Side Logo Panel */}
      <div className="hidden md:flex bg-gradient-to-b from-[#f97316] to-[#c2410c] p-8 flex-col items-center justify-center text-white">
        <img
          src="../../public/logo.png"
          alt="Election Commission Logo"
          className="w-62 h-56 mb-6 animate-pulse"
        />
        <h1 className="text-3xl font-extrabold text-center drop-shadow-md">
          Election Commission of India
        </h1>
        <p className="text-2xl font-semibold text-center mt-2">भारत निर्वाचन आयोग</p>
      </div>

      {/* Right Side Signup Form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-105">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-[#f97316] text-center animate-fade-in">
              Verification Officer Sign-Up
            </h2>
          </div>

          <div className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all"
              />
              {email.length > 0 && !isEmailValid && (
                <p className="text-sm text-red-500">
                  Please enter a valid email address
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Password *</label>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all"
              />
              {email.trim() && !password.trim() && (
                <p className="text-sm text-red-500">
                  Password is required
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all"
              />
              {password.trim() && !confirmPassword.trim() && (
                <p className="text-sm text-red-500">
                  Confirm Password is required
                </p>
              )}
              {password.trim() && confirmPassword.trim() && password !== confirmPassword && (
                <p className="text-sm text-red-500">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Supervisor Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Supervisor Name *</label>
              <input
                type="text"
                placeholder="Enter Supervisor Name"
                value={supervisor}
                onChange={(e) => setSupervisor(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all"
              />
              {email.trim() && !supervisor.trim() && (
                <p className="text-sm text-red-500">
                  Supervisor Name is required
                </p>
              )}
            </div>

            {/* RFID Number */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">RFID Number *</label>
              <input
                type="text"
                placeholder="Enter RFID Number"
                value={rfidNo}
                onChange={(e) => setRfidNo(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all"
              />
              {email.trim() && !rfidNo.trim() && (
                <p className="text-sm text-red-500">
                  RFID Number is required
                </p>
              )}
            </div>

            {/* Submit Button with Spinner */}
            <button
              onClick={handleSubmit}
              disabled={loading || !isFormValid}
              className={`w-full py-3 flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 ${
                loading
                  ? "bg-gray-300 opacity-50 cursor-not-allowed"
                  : isFormValid
                  ? "bg-[#f97316] hover:bg-[#ea580c] text-white active:scale-95"
                  : "bg-gray-300 opacity-50 cursor-not-allowed"
              }`}
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}