import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBoothOfficer } from "../context/BoothOfficerContext";

export default function BoothOfficerLoginPage() {
  const [ID, setID] = useState("");
  const [PASSWORD, setPassword] = useState("");
  const navigate = useNavigate();
  const { loginBoothOfficer } = useBoothOfficer();

  const handleLogin = async () => {
    if (!ID || !PASSWORD) {
      toast.error("All fields are required!");
      return;
    }

    await loginBoothOfficer(ID, PASSWORD, navigate);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-10 animate-fadeIn">
        <div className="flex flex-col items-center justify-center text-white space-y-6 w-full">
          <img
            src="../../public/logo.png"
            alt="Election Commission Logo"
            className="w-62 h-56 mb-6 transform transition-transform duration-700 hover:scale-105 animate-slideInFromLeft"
          />
          <h1 className="text-4xl font-extrabold text-center leading-tight animate-slideInFromRight">
            Election Commission of India
          </h1>
          <p className="text-2xl font-medium text-center animate-slideInFromRight delay-200">
            भारत निर्वाचन आयोग
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-white">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 md:p-10 animate-slideUp">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-orange-600">Booth Officer Login</h2>
            <p className="text-gray-500 mt-2">Sign in to access your booth officer dashboard</p>
          </div>
          <div className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                RFID / Mobile Number *
              </label>
              <input
                id="id"
                type="text"
                placeholder="Enter RFID or Mobile"
                value={ID}
                onChange={(e) => setID(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gray-50 text-gray-900 placeholder-gray-400"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={PASSWORD}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gray-50 text-gray-900 placeholder-gray-400"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInFromLeft {
          from {
            transform: translateX(-50px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInFromRight {
          from {
            transform: translateX(50px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1.2s ease-in-out;
        }

        .animate-slideInFromLeft {
          animation: slideInFromLeft 0.8s ease-out;
        }

        .animate-slideInFromRight {
          animation: slideInFromRight 0.8s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.7s ease-out;
        }

        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
}