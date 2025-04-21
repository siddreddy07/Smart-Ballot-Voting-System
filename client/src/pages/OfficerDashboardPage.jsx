const stats = {
  total: 500,
  voted: 169,
  pending: 167,
  reported: 164,
}

const voters = [
  { id: "ECV2001", name: "Voter 1", status: "Pending" },
  { id: "ECV2002", name: "Voter 2", status: "Voted" },
  { id: "ECV2003", name: "Voter 3", status: "Reported" },
  { id: "ECV2004", name: "Voter 4", status: "Pending" },
  { id: "ECV2005", name: "Voter 5", status: "Voted" },
]

export default function OfficerDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold text-center">Election Commission of India - Officer Dashboard</h1>
      </header>

      <div className="container mx-auto p-4 md:p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img src="/placeholder.svg" alt="Officer" className="w-24 h-24 rounded-full" />
              <div>
                <h2 className="text-xl font-bold">Officer Name</h2>
                <p className="text-gray-600">Officer ID: EC1001</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2">Total Voters</h3>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2">Voted</h3>
                <p className="text-3xl font-bold">{stats.voted}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2">Pending</h3>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2">Reported</h3>
                <p className="text-3xl font-bold">{stats.reported}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 flex flex-row items-center justify-between">
              <h3 className="text-lg font-semibold">Voter Status</h3>
              <div className="space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm">Pending</button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm">Voted</button>
                <button className="px-3 py-1 bg-red-600 text-white rounded text-sm">Report</button>
              </div>
            </div>
            <div className="p-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Voter ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {voters.map((voter) => (
                    <tr key={voter.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{voter.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{voter.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{voter.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

