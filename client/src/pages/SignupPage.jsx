import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function SignUp() {
  const { generateOtp, verifyOtp, otpPopup, user, setOtpPopup, register } = useAuth();
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [userCaptchaInput, setUserCaptchaInput] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [retryEnabled, setRetryEnabled] = useState(false);
  const navigate = useNavigate();

  // Validate mobile number: exactly 10 digits, only numbers
  const isMobileValid = mobile.length === 10 && /^\d{10}$/.test(mobile);

  // Validate email: basic email format
  const isEmailValid = email.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Generate a random CAPTCHA
  const generateRandomCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let captchaText = "";
    for (let i = 0; i < 5; i++) {
      captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captchaText;
  };

  // Generate CAPTCHA on page load
  useEffect(() => {
    setCaptcha(generateRandomCaptcha());
  }, []);

  // Enable OTP retry after 2 minutes
  useEffect(() => {
    if (otpPopup) {
      setRetryEnabled(false);
      const timer = setTimeout(() => setRetryEnabled(true), 120000); // Enable retry after 2 minutes
      return () => clearTimeout(timer);
    }
  }, [otpPopup]);

  // Function to check valid input (Only one of Mobile or Email + Username required)
  const isValidInput = () => {
    return (isMobileValid || (email && isEmailValid)) && !(isMobileValid && email) && username.trim();
  };

  // Function to verify CAPTCHA
  const handleCaptchaCheck = () => {
    if (userCaptchaInput.trim().toUpperCase() === captcha) {
      setCaptchaVerified(true);
      toast.success("CAPTCHA Verified!");
    } else {
      setCaptchaVerified(false);
      toast.error("Incorrect CAPTCHA. Try Again!");
      setUserCaptchaInput(""); // Clear input on failure
    }
  };

  // Handle OTP Generation
  const handleGenerateOtp = async () => {
    if (!isValidInput()) {
      return toast.error("Enter either a valid 10-digit Mobile No. or Email, and Username is required!");
    }
    if (!captchaVerified) {
      return toast.error("Please verify the CAPTCHA first.");
    }

    const userInput = mobile || email;
    await generateOtp(userInput, username, "register");
  };

  // Handle OTP Verification
  const handleVerifyOtp = async () => {
    if (otp.trim().length !== 4) {
      return toast.error("Enter a valid 4-digit OTP!");
    }

    const userInput = mobile || email;
    const verified = await verifyOtp(user, otp);

    if (verified) {
      await register(userInput, navigate);
    }
  };

  // Handle Close Popup
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

      {/* Right Side - Sign-Up Form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-105">
          <h2 className="text-3xl font-bold text-[#f97316] mb-6 text-center animate-fade-in">
            Create Account
          </h2>
          <div className="space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Username *</label>
              <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all"
                required
              />
            </div>

            {/* Mobile Number Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Mobile Number *</label>
              <input
                type="tel"
                placeholder="Enter 10-digit Mobile Number"
                value={mobile}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Allow only numbers
                  if (value.length <= 10) {
                    setMobile(value);
                    if (value.length === 10 && /^\d{10}$/.test(value)) {
                      setEmail(""); // Reset email if valid mobile is entered
                    }
                  }
                }}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all ${
                  isEmailValid && email ? "bg-gray-200 opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isEmailValid && email} // Disable if valid email is entered
              />
              {mobile.length > 0 && mobile.length !== 10 && (
                <p className="text-sm text-red-500">
                  Mobile number must be exactly 10 digits
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email Address *</label>
              <input
                type="email"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmail(value);
                  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    setMobile(""); // Reset mobile if valid email is entered
                  }
                }}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all ${
                  isMobileValid ? "bg-gray-200 opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isMobileValid} // Disable if valid mobile is entered
              />
              {email.length > 0 && !isEmailValid && (
                <p className="text-sm text-red-500">
                  Please enter a valid email address
                </p>
              )}
            </div>

            {/* CAPTCHA Verification */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">CAPTCHA</label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold bg-gray-200 px-4 py-2 rounded-lg">{captcha}</span>
                <button
                  onClick={() => setCaptcha(generateRandomCaptcha())}
                  className="p-2 bg-gray-300 hover:bg-gray-400 text-black rounded-lg"
                >
                  🔄
                </button>
              </div>
              <input
                type="text"
                placeholder="Enter CAPTCHA"
                value={userCaptchaInput}
                onChange={(e) => setUserCaptchaInput(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all"
              />
              <button
                onClick={handleCaptchaCheck}
                className="w-full mt-2 py-3 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg font-semibold transition-all duration-300"
              >
                Verify CAPTCHA
              </button>
            </div>

            {/* Generate OTP Button */}
            <button
              onClick={handleGenerateOtp}
              disabled={!captchaVerified}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                captchaVerified
                  ? "bg-[#f97316] hover:bg-[#ea580c] active:scale-95"
                  : "bg-gray-300 cursor-not-allowed opacity-50"
              }`}
            >
              Generate OTP
            </button>

            {/* Login Link */}
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-[#f97316] hover:text-[#ea580c] font-medium hover:underline">
                Login
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
              ×
            </button>
            <h3 className="text-2xl font-bold text-[#f97316] mb-4 text-center">
              Verify OTP
            </h3>
            <input
              type="text"
              maxLength="4"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full p-3 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316]"
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