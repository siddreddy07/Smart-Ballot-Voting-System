import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { partyData } from "../../../parties";

// Function to get party color based on party ID
const getPartyColor = (partyId) => {
  const party = partyData.find(p => p.party_id === partyId);
  return party ? party.color : "#4B8BF5"; // Default color if not found
};

const CandidateCard = ({ candidate, type }) => {
  const party = partyData.find(p => p.party_id === candidate.party_id);
  
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition-all duration-300">
      <div className="flex justify-between mb-4 items-center">
        <div className="font-semibold text-xl text-gray-800">{candidate.candidate_name}</div>
        <div className="font-semibold text-sm text-gray-500">{party?.party_name}</div>
      </div>
      <div className="text-gray-600 text-lg mb-4">Votes: {candidate.votes}</div>
      <div className="flex justify-between items-center text-gray-700">
        <span className="text-sm">{type} Candidate</span>
        <img src={party?.symbol_url} alt={`${party?.party_name} logo`} className="h-8" />
      </div>
    </div>
  );
};

const ResultPage = () => {
  const [resultData, setResultData] = useState({
    state: { partyVotes: {}, majority: {} },
    assembly: { partyVotes: {}, winners: [], majority: {}, candidates: [] },
    parliamentary: { partyVotes: {}, winners: [], majority: {}, candidates: [] },
  });
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('State');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/get-result", {
        STATE_ID: "4", // Example state ID
        ELECTION_DATE: "2025-04-09" // Example date
      });
      setResultData(data);
    } catch (error) {
      console.error("Error fetching result data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderChartData = (partyVotes) => {
    return Object.entries(partyVotes).map(([partyId, votes]) => ({
      name: partyData.find(p => p.party_id === partyId)?.party_name || "Unknown Party",
      value: votes
    }));
  };

  const renderWinners = (winners, type) => (
    winners?.map((winner, index) => (
      <CandidateCard key={index} candidate={winner} type={type} />
    )) || <p>No winners available</p>
  );

  return (
    <div className="bg-white p-8 min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 tracking-widest">Election Results - Andhra Pradesh</h1>
        <p className="text-gray-600 mt-2">Election results for 2025-04-09</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setSelectedTab('State')}
          className={`px-6 py-2 rounded-md transition-all ${selectedTab === 'State' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'} mx-2 shadow-lg hover:shadow-xl`}
        >
          State Results
        </button>
        <button
          onClick={() => setSelectedTab('Assembly')}
          className={`px-6 py-2 rounded-md transition-all ${selectedTab === 'Assembly' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'} mx-2 shadow-lg hover:shadow-xl`}
        >
          Assembly Results
        </button>
        <button
          onClick={() => setSelectedTab('Parliamentary')}
          className={`px-6 py-2 rounded-md transition-all ${selectedTab === 'Parliamentary' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'} mx-2 shadow-lg hover:shadow-xl`}
        >
          Parliamentary Results
        </button>
      </div>

      {/* State Results */}
      <div className={`transition-all duration-300 ${selectedTab === 'State' ? 'block' : 'hidden'}`}>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">State-Wide Party Votes</h2>
          <div className="flex gap-6 flex-wrap">
            {Object.entries(resultData.state.partyVotes).map(([partyId, votes]) => (
              <div
                key={partyId}
                className="w-1/4 p-4 bg-white rounded-lg shadow-lg text-center"
                style={{ borderTopColor: getPartyColor(partyId), borderTopWidth: '6px' }}
              >
                <div className="text-lg font-semibold">{partyData.find(p => p.party_id === partyId)?.party_name}</div>
                <div className="text-2xl">{votes} votes</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart for State-wide Result */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">State-Wide Party Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={renderChartData(resultData.state.partyVotes)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {Object.entries(resultData.state.partyVotes).map(([partyId]) => (
                  <Cell key={partyId} fill={getPartyColor(partyId)} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Assembly Results */}
      <div className={`transition-all duration-300 ${selectedTab === 'Assembly' ? 'block' : 'hidden'}`}>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Assembly Results (MLA)</h2>
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">Winner: </h3>
            {resultData.assembly.winners.length > 0 ? (
              <CandidateCard
                candidate={resultData.assembly.winners[0]}
                type="MLA"
              />
            ) : (
              <p>No assembly winner available</p>
            )}
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Other Candidates</h3>
            <div className="flex gap-6 flex-wrap">
              {renderWinners(resultData.assembly.candidates, "MLA")}
            </div>
          </div>

          {/* Pie Chart for Assembly Result */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Assembly Party Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={renderChartData(resultData.assembly.partyVotes)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {Object.entries(resultData.assembly.partyVotes).map(([partyId]) => (
                    <Cell key={partyId} fill={getPartyColor(partyId)} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Parliamentary Results */}
      <div className={`transition-all duration-300 ${selectedTab === 'Parliamentary' ? 'block' : 'hidden'}`}>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Parliamentary Results (MP)</h2>
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">Winner: </h3>
            {resultData.parliamentary.winners.length > 0 ? (
              <CandidateCard
                candidate={resultData.parliamentary.winners[0]}
                type="MP"
              />
            ) : (
              <p>No parliamentary winner available</p>
            )}
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Other Candidates</h3>
            <div className="flex gap-6 flex-wrap">
              {renderWinners(resultData.parliamentary.candidates, "MP")}
            </div>
          </div>

          {/* Pie Chart for Parliamentary Result */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Parliamentary Party Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={renderChartData(resultData.parliamentary.partyVotes)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {Object.entries(resultData.parliamentary.partyVotes).map(([partyId]) => (
                    <Cell key={partyId} fill={getPartyColor(partyId)} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
