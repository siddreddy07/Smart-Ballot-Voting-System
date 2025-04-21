import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { generateOtp, verifyOtp, otpPopup, setOtpPopup, user, login } = useAuth();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [retryEnabled, setRetryEnabled] = useState(false);
  const navigate = useNavigate();

  // Validate mobile number: exactly 10 digits, only numbers
  const isMobileValid = mobile.length === 10 && /^\d{10}$/.test(mobile);

  useEffect(() => {
    if (otpPopup) {
      setRetryEnabled(false);
      const timer = setTimeout(() => setRetryEnabled(true), 120000); // Enable retry after 2 minutes
      return () => clearTimeout(timer);
    }
  }, [otpPopup]);

  const handleGenerateOtp = async () => {
    if (isMobileValid) {
      await generateOtp(mobile, null, "login");
    } else {
      toast.error("Please enter a valid 10-digit mobile number");
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length === 4) {
      const verified = await verifyOtp(user, otp);
      if (verified) {
        await login(mobile, navigate);
      }
    } else {
      toast.error("Please enter a valid 4-digit OTP");
    }
  };

  const handleClosePopup = () => {
    setOtpPopup(false);
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-saffron-50 to-white">
      {/* Left Side - Branding */}
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

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-105">
          <h2 className="text-3xl font-bold text-saffron-700 mb-6 text-center animate-fade-in">
            Welcome Back
          </h2>
          <div className="space-y-6">
            {/* Mobile Number Input */}
            <div className="space-y-2">
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number *
              </label>
              <input
                id="mobile"
                type="tel"
                placeholder="Enter 10-digit Mobile Number"
                value={mobile}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Allow only numbers
                  if (value.length <= 10) setMobile(value);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 transition-all"
              />
              {mobile.length > 0 && mobile.length !== 10 && (
                <p className="text-sm text-red-500">
                  Mobile number must be exactly 10 digits
                </p>
              )}
            </div>

            {/* Generate OTP Button - Always visible, enabled only when mobile is valid */}
            <button
              onClick={handleGenerateOtp}
              disabled={!isMobileValid}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                isMobileValid
                  ? "bg-[#f97316] hover:bg-[#ea580c] active:scale-95"
                  : "bg-gray-300 cursor-not-allowed opacity-50"
              }`}
            >
              Generate OTP
            </button>

            {/* Register Link */}
            <p className="text-sm text-center text-gray-600">
              New here?{" "}
              <Link
                to="/signup"
                className="text-saffron-600 hover:text-saffron-800 font-medium hover:underline"
              >
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* OTP Popup */}
      {otpPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm"
          onClick={handleClosePopup}
        >
          <div
            className="bg-white p-8 rounded-2xl shadow-xl w-96 animate-slide-up relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClosePopup}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-saffron-700 mb-4 text-center">
              Verify OTP
            </h3>
            <input
              type="text"
              maxLength="4"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full p-3 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
              placeholder="Enter 4-digit OTP"
            />
            <div className="mt-6 flex justify-center gap-4">
              <button
                disabled={!retryEnabled}
                onClick={() => setOtpPopup(false)}
                className={`px-6 py-2 rounded-lg font-medium ${
                  retryEnabled
                    ? "bg-[#f97316] text-white hover:bg-[#ea580c]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Retry
              </button>
              <button
                onClick={handleVerifyOtp}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                Verify OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}