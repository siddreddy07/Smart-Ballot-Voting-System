import { useState } from "react";
import { useParams } from "react-router-dom";

const initialVoters = [
  { id: "V1001", name: "Voter 1", phone: "987654311", rfidScanned: false, fingerprintVerified: false, status: "Pending" },
  { id: "V1002", name: "Voter 2", phone: "987654312", rfidScanned: false, fingerprintVerified: false, status: "Pending" },
  { id: "V1003", name: "Voter 3", phone: "987654313", rfidScanned: false, fingerprintVerified: false, status: "Pending" },
  { id: "V1004", name: "Voter 4", phone: "987654314", rfidScanned: false, fingerprintVerified: false, status: "Pending" },
  { id: "V1005", name: "Voter 5", phone: "987654315", rfidScanned: false, fingerprintVerified: false, status: "Pending" },
];

export default function BoothIdPage() {
  const { id } = useParams();
  const [voters, setVoters] = useState(initialVoters);
  const [search, setSearch] = useState("");

  const handleRFIDScan = (id) => {
    setVoters(voters.map(voter => 
      voter.id === id ? { ...voter, rfidScanned: true } : voter
    ));
  };

  const handleFingerprintVerify = (id) => {
    setVoters(voters.map(voter => 
      voter.id === id ? { ...voter, fingerprintVerified: true } : voter
    ));
  };

  const handleApprove = (id) => {
    setVoters(voters.map(voter => 
      voter.id === id ? { ...voter, status: "Approved" } : voter
    ));
  };

  const handleReject = (id) => {
    setVoters(voters.map(voter => 
      voter.id === id ? { ...voter, status: "Rejected" } : voter
    ));
  };

  const handleReport = (id) => {
    setVoters(voters.map(voter => 
      voter.id === id ? { ...voter, status: "Reported" } : voter
    ));
  };

  const filteredVoters = voters.filter(voter =>
    voter.id.toLowerCase().includes(search.toLowerCase()) ||
    voter.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#1e3a8a] text-white p-4">
        <h1 className="text-2xl font-bold text-center">Election Commission of India - Officer Dashboard</h1>
        <p className="text-center">Booth {id}</p>
      </header>

      <div className="p-4">
        <input
          type="text"
          placeholder="Search by Voter ID or Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-2 border border-gray-300 rounded mb-4"
        />

        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#1e3a8a] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Voter ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">RFID Scan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Fingerprint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVoters.map((voter) => (
                  <tr key={voter.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{voter.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{voter.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{voter.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className={`px-3 py-1 rounded ${voter.rfidScanned 
                          ? "bg-gray-200 text-gray-700" 
                          : "bg-blue-600 text-white hover:bg-blue-700"}`}
                        onClick={() => handleRFIDScan(voter.id)}
                        disabled={voter.rfidScanned}
                      >
                        {voter.rfidScanned ? "Scanned" : "Scan RFID"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className={`px-3 py-1 rounded ${voter.fingerprintVerified 
                          ? "bg-gray-200 text-gray-700" 
                          : "bg-blue-600 text-white hover:bg-blue-700"}`}
                        onClick={() => handleFingerprintVerify(voter.id)}
                        disabled={voter.fingerprintVerified}
                      >
                        {voter.fingerprintVerified ? "Verified" : "Verify Fingerprint"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          voter.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : voter.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : voter.status === "Reported"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {voter.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
                          onClick={() => handleApprove(voter.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                          onClick={() => handleReject(voter.id)}
                        >
                          Reject
                        </button>
                        <button
                          className="px-2 py-1 border border-yellow-600 text-yellow-600 hover:bg-yellow-50 text-sm rounded"
                          onClick={() => handleReport(voter.id)}
                        >
                          Report
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
