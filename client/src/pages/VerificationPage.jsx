const voters = [
  { id: "ECV2001", name: "Voter 1", rfidVerified: false, fingerprintVerified: false, status: "Pending" },
  { id: "ECV2002", name: "Voter 2", rfidVerified: true, fingerprintVerified: true, status: "Voted" },
  { id: "ECV2003", name: "Voter 3", rfidVerified: false, fingerprintVerified: false, status: "Reported" },
  { id: "ECV2004", name: "Voter 4", rfidVerified: false, fingerprintVerified: false, status: "Pending" },
  { id: "ECV2005", name: "Voter 5", rfidVerified: true, fingerprintVerified: true, status: "Voted" },
]

export default function Verification() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold text-center">Election Commission of India - Officer Dashboard</h1>
      </header>

      <div className="container mx-auto p-4 md:p-8">
        <div className="grid gap-6">
          <div className="flex items-center space-x-4">
            <img src="/placeholder.svg" alt="Officer" className="w-24 h-24 rounded-full" />
            <div>
              <h2 className="text-xl font-bold">Officer Name</h2>
              <p className="text-gray-600">Officer ID: EC1001</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded">Pending</button>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded">Voted</button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded">Report</button>
          </div>

          <div className="bg-white rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Voter ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">RFID Scan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Fingerprint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {voters.map((voter) => (
                  <tr key={voter.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{voter.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{voter.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {voter.rfidVerified ? (
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-green-500 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Verified
                        </div>
                      ) : (
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">Scan RFID</button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {voter.fingerprintVerified ? (
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-green-500 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Verified
                        </div>
                      ) : (
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">Verify Fingerprint</button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          voter.status === "Voted"
                            ? "bg-green-100 text-green-800"
                            : voter.status === "Reported"
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {voter.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

