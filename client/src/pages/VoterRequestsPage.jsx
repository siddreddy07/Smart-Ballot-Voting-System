import { useState } from "react";

const initialRequests = [
  { id: "IND137672", name: "Sneha Verma", dob: "27-06-1999", gender: "Female", mobile: "9819323410", email: "sneha.verma7@example.com", aadhar: "853178534600", picture: "/placeholder.svg", fingerprint: "/placeholder.svg", pinCode: "560002", address: "House No. 409, Street 43", status: "Approved" },
  { id: "IND137674", name: "Ramesh Kumar", dob: "7-02-1973", gender: "Male", mobile: "9375723849", email: "ramesh.kumar9@example.com", aadhar: "841484328685", picture: "/placeholder.svg", fingerprint: "/placeholder.svg", pinCode: "600003", address: "House No. 324, Street 18", status: "Approved" },
  { id: "IND137678", name: "Sneha Verma", dob: "14-03-1978", gender: "Female", mobile: "9767429861", email: "sneha.verma13@example.com", aadhar: "193301725076", picture: "/placeholder.svg", fingerprint: "/placeholder.svg", pinCode: "600003", address: "House No. 296, Street 3", status: "Approved" },
  { id: "IND137680", name: "Arjun Singh", dob: "24-03-1985", gender: "Male", mobile: "9469550011", email: "arjun.singh15@example.com", aadhar: "546291365276", picture: "/placeholder.svg", fingerprint: "/placeholder.svg", pinCode: "500001", address: "House No. 232, Street 48", status: "Approved" },
  { id: "IND137687", name: "Arjun Singh", dob: "3-02-1980", gender: "Female", mobile: "9899758972", email: "arjun.singh22@example.com", aadhar: "140739437614", picture: "/placeholder.svg", fingerprint: "/placeholder.svg", pinCode: "500001", address: "House No. 194, Street 12", status: "Approved" },
  { id: "IND137690", name: "Priya Sharma", dob: "15-05-1992", gender: "Female", mobile: "9876543210", email: "priya.sharma@example.com", aadhar: "123456789012", picture: "/placeholder.svg", fingerprint: "/placeholder.svg", pinCode: "110001", address: "House No. 123, Street 5", status: "Pending" },
  { id: "IND137691", name: "Rahul Patel", dob: "22-08-1988", gender: "Male", mobile: "9876543211", email: "rahul.patel@example.com", aadhar: "123456789013", picture: "/placeholder.svg", fingerprint: "/placeholder.svg", pinCode: "400001", address: "House No. 456, Street 7", status: "Pending" },
  { id: "IND137692", name: "Anita Desai", dob: "10-11-1975", gender: "Female", mobile: "9876543212", email: "anita.desai@example.com", aadhar: "123456789014", picture: "/placeholder.svg", fingerprint: "/placeholder.svg", pinCode: "700001", address: "House No. 789, Street 9", status: "Modification" },
];

export default function VoterRequestsPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const handleProcess = (id) => {
    // Process the request (in a real app, this would involve more complex logic)
    console.log(`Processing request for ID: ${id}`);
    alert(`Processing request for ID: ${id}`);
  };

  const handleEdit = (id) => {
    // Only allow editing for approved or modification requests
    const request = requests.find(req => req.id === id);
    if (request && (request.status === "Approved" || request.status === "Modification")) {
      console.log(`Editing request for ID: ${id}`);
      alert(`Editing request for ID: ${id}`);
    } else {
      alert("Only approved or modification requests can be edited");
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = Object.values(request).some(
      value => typeof value === "string" && value.toLowerCase().includes(search.toLowerCase())
    );
    if (filter === "all") return matchesSearch;
    return matchesSearch && request.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">New Voter Card Requests</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        <button 
          onClick={() => setFilter("all")} 
          className={`px-4 py-2 rounded ${filter === "all" 
            ? "bg-blue-600 text-white" 
            : "bg-white text-gray-700 border border-gray-300"}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter("pending")} 
          className={`px-4 py-2 rounded ${filter === "pending" 
            ? "bg-blue-600 text-white" 
            : "bg-white text-gray-700 border border-gray-300"}`}
        >
          Pending
        </button>
        <button 
          onClick={() => setFilter("approved")} 
          className={`px-4 py-2 rounded ${filter === "approved" 
            ? "bg-blue-600 text-white" 
            : "bg-white text-gray-700 border border-gray-300"}`}
        >
          Approved
        </button>
        <button 
          onClick={() => setFilter("modification")} 
          className={`px-4 py-2 rounded ${filter === "modification" 
            ? "bg-blue-600 text-white" 
            : "bg-white text-gray-700 border border-gray-300"}`}
        >
          Modification
        </button>
      </div>
      <input
        type="text"
        placeholder="Search requests"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md p-2 border border-gray-300 rounded mb-4"
      />
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voter ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIN Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4 whitespace-nowrap">{request.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.dob}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.gender}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.mobile}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.pinCode}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      request.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : request.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleProcess(request.id)} 
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                    >
                      Process
                    </button>
                    {(request.status === "Approved" || request.status === "Modification") && (
                      <button 
                        onClick={() => handleEdit(request.id)} 
                        className="px-3 py-1 border border-gray-300 hover:bg-gray-50 text-sm rounded"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
