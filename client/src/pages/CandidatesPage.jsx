const candidates = [
  {
    id: 1,
    name: "VALLABHANENI BALASHORY",
    party: "JANASENA PARTY",
    image: "/placeholder.svg",
    partyLogo: "/placeholder.svg",
    symbol: "/placeholder.svg",
  },
  {
    id: 2,
    name: "MVV SATYANARAYANA",
    party: "YSR CONGRESS PARTY",
    image: "/placeholder.svg",
    partyLogo: "/placeholder.svg",
    symbol: "/placeholder.svg",
  },
  {
    id: 3,
    name: "DAGGUBATI PURANDESWARI",
    party: "BHARATIYA JANATA PARTY",
    image: "/placeholder.svg",
    partyLogo: "/placeholder.svg",
    symbol: "/placeholder.svg",
  },
  {
    id: 4,
    name: "BHEESETTI BABJI",
    party: "INDIAN NATIONAL CONGRESS",
    image: "/placeholder.svg",
    partyLogo: "/placeholder.svg",
    symbol: "/placeholder.svg",
  },
]

export default function Candidates() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-2">Election Voting Dashboard</h1>
            <h2 className="text-2xl font-semibold text-center mb-6">MP Candidates List</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Party Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Party Logo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate Symbol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vote
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {candidates.map((candidate) => (
                    <tr key={candidate.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={candidate.image || "/placeholder.svg"}
                          alt={candidate.name}
                          className="w-16 h-16 rounded-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{candidate.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{candidate.party}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={candidate.partyLogo || "/placeholder.svg"}
                          alt={`${candidate.party} logo`}
                          className="w-10 h-10"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={candidate.symbol || "/placeholder.svg"}
                          alt={`${candidate.name} symbol`}
                          className="w-10 h-10"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                          Vote
                        </button>
                      </td>
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

