"use client"

import { useState } from "react"

const initialVoters = [
  {
    id: "V1001",
    name: "Voter 1",
    phone: "987654311",
    rfidScanned: false,
    fingerprintVerified: false,
    status: "Pending",
  },
  {
    id: "V1002",
    name: "Voter 2",
    phone: "987654312",
    rfidScanned: false,
    fingerprintVerified: false,
    status: "Pending",
  },
  {
    id: "V1003",
    name: "Voter 3",
    phone: "987654313",
    rfidScanned: false,
    fingerprintVerified: false,
    status: "Pending",
  },
  {
    id: "V1004",
    name: "Voter 4",
    phone: "987654314",
    rfidScanned: false,
    fingerprintVerified: false,
    status: "Pending",
  },
  {
    id: "V1005",
    name: "Voter 5",
    phone: "987654315",
    rfidScanned: false,
    fingerprintVerified: false,
    status: "Pending",
  },
]

export default function BoothDashboard() {
  const [voters, setVoters] = useState(initialVoters)
  const [search, setSearch] = useState("")

  const handleRFIDScan = (id) => {
    setVoters(voters.map((voter) => (voter.id === id ? { ...voter, rfidScanned: true } : voter)))
  }

  const handleFingerprintVerify = (id) => {
    setVoters(voters.map((voter) => (voter.id === id ? { ...voter, fingerprintVerified: true } : voter)))
  }

  const handleApprove = (id) => {
    setVoters(voters.map((voter) => (voter.id === id ? { ...voter, status: "Approved" } : voter)))
  }

  const handleReject = (id) => {
    setVoters(voters.map((voter) => (voter.id === id ? { ...voter, status: "Rejected" } : voter)))
  }

  const handleReport = (id) => {
    setVoters(voters.map((voter) => (voter.id === id ? { ...voter, status: "Reported" } : voter)))
  }

  const filteredVoters = voters.filter(
    (voter) =>
      voter.id.toLowerCase().includes(search.toLowerCase()) || voter.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Election Commission of India - Officer Dashboard</h1>
      <input
        placeholder="Search by Voter ID or Name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md w-full p-2 border border-gray-300 rounded-md mb-4"
      />
      <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voter ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              RFID Scan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fingerprint
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredVoters.map((voter) => (
            <tr key={voter.id}>
              <td className="px-6 py-4 whitespace-nowrap">{voter.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{voter.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{voter.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {voter.rfidScanned ? (
                  "Scanned"
                ) : (
                  <button
                    onClick={() => handleRFIDScan(voter.id)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    Scan RFID
                  </button>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {voter.fingerprintVerified ? (
                  "Verified"
                ) : (
                  <button
                    onClick={() => handleFingerprintVerify(voter.id)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    Verify Fingerprint
                  </button>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{voter.status}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleApprove(voter.id)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded mr-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(voter.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded mr-2"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleReport(voter.id)}
                  className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded"
                >
                  Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

