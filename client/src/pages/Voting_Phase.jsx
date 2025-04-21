import React, { useEffect, useState } from "react";
import { useBoothOfficer } from "../context/BoothOfficerContext";
import toast from "react-hot-toast";
import { partyData } from "../../../parties";
import { useNavigate } from "react-router-dom";

const VotingPage = () => {
  const { getCandidatesForVoter, submitVote } = useBoothOfficer();
  const [mlaCandidates, setMlaCandidates] = useState([]);
  const [mpCandidates, setMpCandidates] = useState([]);
  const [selectedMla, setSelectedMla] = useState(null);
  const [selectedMp, setSelectedMp] = useState(null);
  const [currentVoter, setCurrentVoter] = useState(null);
  const navigate = useNavigate();
  const [phase, setPhase] = useState("MLA");

  useEffect(() => {
    const load = async () => {
      const result = await getCandidatesForVoter();
      if (result) {
        setMlaCandidates(result.MLA_Candidates || []);
        setMpCandidates(result.MP_Candidates || []);
        setCurrentVoter(result.user);

        const storedMla = JSON.parse(localStorage.getItem("MLA_CANDIDATE"));
        const storedMp = JSON.parse(localStorage.getItem("MP_CANDIDATE"));

        if (storedMla) setSelectedMla(storedMla.id);
        if (storedMp) setSelectedMp(storedMp.id);
      }
    };
    load();
  }, [getCandidatesForVoter]);

  const handleVoteSelect = (candidate, setSelected, type) => {
    setSelected(candidate.CANDIDATE_ID);
    localStorage.setItem(`${type}_CANDIDATE`, JSON.stringify({
      id: candidate.CANDIDATE_ID,
      name: candidate.NAME
    }));
  };

  const handleRegisterVote = async () => {
    if (!selectedMla || !selectedMp) {
      toast.error("Please vote for both MLA and MP");
      return;
    }

    const success = await submitVote({
      MLA_CANDIDATE_ID: selectedMla,
      MP_CANDIDATE_ID: selectedMp
    });

    if (success) {
      toast.success("Vote registered successfully!");
      localStorage.removeItem("MLA_CANDIDATE");
      localStorage.removeItem("MP_CANDIDATE");
      setSelectedMla(null);
      setSelectedMp(null);
      setPhase("MLA");
      navigate('/thank-you');
    }
  };

  const renderCandidatesTable = (title, candidates, selected, setSelected, type) => (
    <div className="mb-12 animate-slideUp">
      <h2 className="text-3xl font-bold text-orange-600 mb-8">{title}</h2>
      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-orange-100 text-orange-800">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Candidate Name</th>
              <th className="p-4 text-left">Party</th>
              <th className="p-4 text-left">Party Logo</th>
              <th className="p-4 text-left">Symbol</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => {
              const party = partyData.find(p => p.party_id === candidate.PARTY_ID.toString());
              return (
                <tr
                  key={candidate.CANDIDATE_ID}
                  className="border-t hover:bg-gray-50 transition-all duration-200 animate-fadeIn"
                >
                  <td className="p-4">
                    <img
                      src={candidate.IMAGE || "/placeholder.png"}
                      alt="candidate"
                      className="h-14 w-14 rounded-full"
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-800">{candidate.NAME}</td>
                  <td className="p-4 text-gray-600">{party?.party_name || "Unknown"}</td>
                  <td className="p-4">
                    <img
                      src={party?.image_url}
                      alt="party logo"
                      className="h-8 w-8"
                    />
                  </td>
                  <td className="p-4">
                    <img
                      src={party?.symbol_url}
                      alt="party symbol"
                      className="h-8 w-8"
                    />
                  </td>
                  <td className="p-4">
                    <button
                      className={`px-4 py-2 rounded-lg text-white font-semibold shadow-md transition-all duration-300 transform hover:scale-105 ${
                        selected === candidate.CANDIDATE_ID
                          ? "bg-green-600"
                          : "bg-orange-600 hover:bg-orange-700"
                      }`}
                      onClick={() =>
                        handleVoteSelect(candidate, setSelected, type)
                      }
                    >
                      {selected === candidate.CANDIDATE_ID ? "Selected" : "Vote"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-6 shadow-lg flex items-center justify-between animate-fadeIn">
        <h1 className="text-3xl font-extrabold tracking-wide animate-slideInFromLeft">
          🗳️ Voting - MLA/MP Elections
        </h1>
        {currentVoter && (
          <div className="text-right bg-orange-600 bg-opacity-75 px-4 py-2 rounded-lg shadow animate-slideInFromRight">
            <p className="font-semibold">Hi, {currentVoter.NAME}</p>
            <p className="text-sm">RFID: {currentVoter.RFID_NO}</p>
          </div>
        )}
      </div>

      <div className="px-6 py-12 max-w-7xl mx-auto">
        {phase === "MLA" && (
          <>
            {renderCandidatesTable("MLA Candidates", mlaCandidates, selectedMla, setSelectedMla, "MLA")}
            <div className="text-right mt-8 animate-slideUp">
              <button
                onClick={() => setPhase("MP")}
                disabled={!selectedMla}
                className={`px-6 py-3 rounded-lg text-white font-semibold shadow-md transition-all duration-300 transform hover:scale-105 ${
                  selectedMla ? "bg-orange-600 hover:bg-orange-700" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Next: MP Voting →
              </button>
            </div>
          </>
        )}

        {phase === "MP" && (
          <>
            {renderCandidatesTable("MP Candidates", mpCandidates, selectedMp, setSelectedMp, "MP")}
            <div className="text-right mt-8 animate-slideUp">
              <button
                onClick={handleRegisterVote}
                disabled={!selectedMp}
                className={`px-6 py-3 rounded-lg text-white font-semibold shadow-md transition-all duration-300 transform hover:scale-105 ${
                  selectedMp ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                ✅ Register Vote
              </button>
            </div>
          </>
        )}
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
          animation: fadeIn 1s ease-in-out;
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
      `}</style>
    </div>
  );
};

export default VotingPage;