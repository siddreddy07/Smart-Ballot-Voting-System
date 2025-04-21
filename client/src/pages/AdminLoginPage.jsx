export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#002147]">
      <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow p-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">Admin Login</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="officerName" className="block text-sm font-medium text-gray-700">
              Officer Name
            </label>
            <input id="officerName" placeholder="Enter Name" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>

          <div className="space-y-2">
            <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">
              ID Number
            </label>
            <input
              id="idNumber"
              placeholder="Enter ID Number"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              placeholder="Enter Phone Number"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              placeholder="Enter the OTP"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <button className="w-full bg-[#002147] hover:bg-[#003166] text-white font-bold py-2 px-4 rounded">
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

