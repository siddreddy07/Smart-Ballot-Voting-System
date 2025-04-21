import React, { useEffect, useState } from "react";

const initialVoters = [
  { id: "V1001", name: "Voter 1", phone: "987654311" },
  { id: "V1002", name: "Voter 2", phone: "987654312" },
  { id: "V1003", name: "Voter 3", phone: "987654313" },
  { id: "V1004", name: "Voter 4", phone: "987654314" },
  { id: "V1005", name: "Voter 5", phone: "987654315" },
];

function Demo() {
  const [mode, setMode] = useState("registration"); // or "authentication"
  const [search, setSearch] = useState("");
  const [voters, setVoters] = useState(initialVoters);
  const [inputs, setInputs] = useState({});
  const [authStatus, setAuthStatus] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("votersData")) || {};
    setInputs(stored);
  }, []);

  const handleInputChange = (id, field, value) => {
    setInputs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const saveToLocal = (id) => {
    const updated = {
      ...inputs,
      [id]: {
        rfidNo: inputs[id]?.rfidNo || "",
        fingerprint: inputs[id]?.fingerprint || "",
      },
    };
    localStorage.setItem("votersData", JSON.stringify(updated));
    alert("Voter data saved!");
  };

  const checkMatch = (id, field) => {
    const stored = JSON.parse(localStorage.getItem("votersData")) || {};
    if (
      stored[id] &&
      stored[id][field] &&
      stored[id][field] === (inputs[id]?.[field] || "")
    ) {
      setAuthStatus((prev) => ({
        ...prev,
        [id]: { ...prev[id], [field]: true },
      }));
    } else {
      setAuthStatus((prev) => ({
        ...prev,
        [id]: { ...prev[id], [field]: false },
      }));
    }
  };

  const handleStatusChange = (id, status) => {
    setInputs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        status,
      },
    }));
  };

  const filteredVoters = voters.filter((v) =>
    v.id.toLowerCase().includes(search.toLowerCase()) ||
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  const statusStyle = {
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
    Reported: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center text-blue-800 mb-4">
        Booth Officer Dashboard
      </h1>
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setMode("registration")}
          className={`px-4 py-2 rounded ${
            mode === "registration"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border"
          }`}
        >
          Registration
        </button>
        <button
          onClick={() => setMode("authentication")}
          className={`px-4 py-2 rounded ${
            mode === "authentication"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border"
          }`}
        >
          Authentication
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-white p-4 rounded shadow">
        <input
          type="text"
          placeholder="Search Voter ID or Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full px-4 py-2 border rounded"
        />

        <table className="w-full table-auto border text-center">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2">Voter ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>RFID</th>
              <th>Fingerprint</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVoters.map((voter) => {
              const voterInput = inputs[voter.id] || {};
              const voterAuth = authStatus[voter.id] || {};
              const isAuthenticated = voterAuth.rfidNo && voterAuth.fingerprint;
              return (
                <tr key={voter.id} className="border-t">
                  <td className="p-2">{voter.id}</td>
                  <td>{voter.name}</td>
                  <td>{voter.phone}</td>

                  {/* RFID Field */}
                  <td>
                    <div className="flex gap-2 items-center justify-center">
                      <input
                        value={voterInput.rfidNo || ""}
                        onChange={(e) =>
                          handleInputChange(voter.id, "rfidNo", e.target.value)
                        }
                        className="border px-2 py-1 rounded w-32"
                        placeholder="Enter RFID"
                      />
                      {mode === "registration" ? (
                        <button
                          onClick={() => saveToLocal(voter.id)}
                          className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => checkMatch(voter.id, "rfidNo")}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Check
                        </button>
                      )}
                    </div>
                    {mode === "authentication" && voterAuth.rfidNo !== undefined && (
                      <div
                        className={`text-sm mt-1 ${
                          voterAuth.rfidNo ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {voterAuth.rfidNo ? "Matched" : "Not matched"}
                      </div>
                    )}
                  </td>

                  {/* Fingerprint Field */}
                  <td>
                    <div className="flex gap-2 items-center justify-center">
                      <input
                        value={voterInput.fingerprint || ""}
                        onChange={(e) =>
                          handleInputChange(voter.id, "fingerprint", e.target.value)
                        }
                        className="border px-2 py-1 rounded w-32"
                        placeholder="Enter Fingerprint"
                      />
                      {mode === "registration" ? (
                        <button
                          onClick={() => saveToLocal(voter.id)}
                          className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => checkMatch(voter.id, "fingerprint")}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Check
                        </button>
                      )}
                    </div>
                    {mode === "authentication" && voterAuth.fingerprint !== undefined && (
                      <div
                        className={`text-sm mt-1 ${
                          voterAuth.fingerprint ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {voterAuth.fingerprint ? "Matched" : "Not matched"}
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td>
                    {voterInput.status ? (
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          statusStyle[voterInput.status]
                        }`}
                      >
                        {voterInput.status}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* Approve / Reject / Report */}
                  <td>
                    {mode === "authentication" && isAuthenticated && (
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => handleStatusChange(voter.id, "Approved")}
                          className="bg-green-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(voter.id, "Rejected")}
                          className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleStatusChange(voter.id, "Reported")}
                          className="text-yellow-600 border border-yellow-600 px-2 py-1 rounded text-sm"
                        >
                          Report
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Demo;
