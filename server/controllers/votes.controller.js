import express from "express";
import jwt from "jsonwebtoken";
import { sequelize } from "../config/dbConnect.js";
import BoothOfficer from "../models/boothofficer.model.js";
import User from "../models/voter.model.js";
import Candidate from "../models/candiatesmaster.model.js";
import CandidateResult from "../models/candidate_result.model.js";
import ElectionResult from "../models/election_result.model.js";

const router = express.Router();

router.post("/auth/vote", async (req, res) => {
  const { BOOTH_ID, STATE_ID, DISTRICT_ID, ASSEMBLY_ID, PARLIAMENTARY_ID } = req.query;
  const { MLA_CANDIDATE_ID, MP_CANDIDATE_ID } = req.body;

  try {
    // **Find Booth Officer for the given booth**
    const boothOfficer = await BoothOfficer.findOne({
      where: { BOOTH_ID, STATE_ID, DISTRICT_ID },
    });

    if (!boothOfficer || !boothOfficer.boothOfficerToken) {
      return res.status(401).json({ success: false, message: "Unauthorized access!" });
    }

    const decodedRFID = jwt.verify(boothOfficer.boothOfficerToken, process.env.JWT_SECRET);

    const voter = await User.findOne({ where: { RFID_NO: decodedRFID.RFID_NO } });

    if (!voter) {
      return res.status(404).json({ success: false, message: "Voter not found!" });
    }

    // **Check If Voter Already Voted**
    if (voter.VOTING_BOOTH?.hasVoted) {
      return res.status(400).json({ success: false, message: "You have already voted!" });
    }

    // **Start Transaction**
    await sequelize.transaction(async (t) => {
      let MLA_RESULT_ID = null;
      let MP_RESULT_ID = null;

      // **Find or Create ElectionResult for MLA**
      if (MLA_CANDIDATE_ID) {
        MLA_RESULT_ID = await findOrCreateElectionResult("MLA", STATE_ID, DISTRICT_ID, ASSEMBLY_ID, null, t);
        await processCandidateVote(MLA_CANDIDATE_ID, MLA_RESULT_ID, STATE_ID, DISTRICT_ID, ASSEMBLY_ID, null, t);
      }

      // **Find or Create ElectionResult for MP**
      if (MP_CANDIDATE_ID) {
        MP_RESULT_ID = await findOrCreateElectionResult("MP", STATE_ID, DISTRICT_ID, null, PARLIAMENTARY_ID, t);
        await processCandidateVote(MP_CANDIDATE_ID, MP_RESULT_ID, STATE_ID, DISTRICT_ID, null, PARLIAMENTARY_ID, t);
      }

      // **Mark Voter as Voted**
      await voter.update(
        { VOTING_BOOTH: { ...voter.VOTING_BOOTH, hasVoted: true } },
        { transaction: t }
      );
    });

    await BoothOfficer.update(
      { boothOfficerToken: null },
      { where: { BOOTH_ID } }
    );

    res.status(200).json({ success: true, message: "Voted Successfully!" });

  } catch (error) {
    console.error("Voting Error:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error!" });
  }
});

/**
 * **Find or Create Election Result**
 * Ensures a single RESULT_ID exists for all parties in a given STATE_ID & DISTRICT_ID
 * MLA → Group by STATE_ID, DISTRICT_ID, ASSEMBLY_ID
 * MP  → Group by STATE_ID, DISTRICT_ID, PARLIAMENTARY_ID
 */
async function findOrCreateElectionResult(electionType, stateId, districtId, assemblyId, parliamentaryId, transaction) {
  let electionResult = await ElectionResult.findOne({
    where: {
      STATE_ID: stateId,
      DISTRICT_ID: districtId,
      ASSEMBLY_CONSTITUENCY_ID: electionType === "MLA" ? assemblyId : null,
      PARLIAMENTARY_CONSTITUENCY_ID: electionType === "MP" ? parliamentaryId : null,
      ELECTION_TYPE: electionType,
    },
    transaction,
  });

  if (!electionResult) {
    electionResult = await ElectionResult.create(
      {
        STATE_ID: stateId,
        DISTRICT_ID: districtId,
        ASSEMBLY_CONSTITUENCY_ID: electionType === "MLA" ? assemblyId : null,
        PARLIAMENTARY_CONSTITUENCY_ID: electionType === "MP" ? parliamentaryId : null,
        ELECTION_TYPE: electionType,
        TOTAL_VOTES_POLLED: 0,
      },
      { transaction }
    );
  }

  return electionResult.RESULT_ID;
}

async function processCandidateVote(candidateId, resultId, stateId, districtId, assemblyId, parliamentaryId, transaction) {
  // **Find Candidate**
  const candidate = await Candidate.findOne({
    where: {
      CANDIDATE_ID: candidateId,
      STATE_ID: stateId,
      DISTRICT_ID: districtId,
      ASSEMBLY_CONSTITUENCY_ID: assemblyId,
      PARLIAMENTARY_CONSTITUENCY_ID: parliamentaryId,
    },
    transaction,
  });

  if (!candidate) {
    throw new Error("Invalid candidate for the given region.");
  }

  // **Find or Create CandidateResult Entry**
  let candidateResult = await CandidateResult.findOne({
    where: {
      candidate_id: candidateId,
      result_id: resultId, // ✅ Only include fields that exist
    },
    transaction,
  });
  
  if (!candidateResult) {
    candidateResult = await CandidateResult.create(
      {
        candidate_id: candidateId,
        result_id: resultId,
        STATE_ID: stateId,
        DISTRICT_ID: districtId,
        ASSEMBLY_CONSTITUENCY_ID: assemblyId,
        PARLIAMENTARY_CONSTITUENCY_ID: parliamentaryId,
        votes: 1, // First vote for this candidate
      },
      { transaction }
    );
  } else {
    // **Increment Vote Count**
    await candidateResult.update(
      { votes: candidateResult.votes + 1 },
      { transaction }
    );
  }

  // **Update Total Votes in ElectionResult**
  await ElectionResult.increment(
    { TOTAL_VOTES_POLLED: 1 },
    {
      where: { RESULT_ID: resultId },
      transaction,
    }
  );
}



function getMajority(partyVotes) {
  let maxVotes = 0;
  let winningParty = null;

  for (const party in partyVotes) {
    if (partyVotes[party] > maxVotes) {
      maxVotes = partyVotes[party];
      winningParty = party;
    }
  }

  return { party: winningParty, votes: maxVotes };
}

router.post("/auth/get-result",
  async (req, res) => {
    const { STATE_ID, ELECTION_DATE } = req.body;
  
    try {
      const results = await ElectionResult.findAll({
        where: { STATE_ID, ELECTION_DATE }
      });
  
      if (!results.length) {
        return res.status(404).json({ message: "No results found." });
      }
  
      const finalResult = {
        state: { partyVotes: {}, majority: {} },
        assembly: { partyVotes: {}, winners: [], majority: {}, candidates: [] },
        parliamentary: { partyVotes: {}, winners: [], majority: {}, candidates: [] },
      };
  
      for (const result of results) {
        const isMP = result.ELECTION_TYPE === "MP";
        const section = isMP ? finalResult.parliamentary : finalResult.assembly;
        const constituencyId = isMP
          ? result.PARLIAMENTARY_CONSTITUENCY_ID
          : result.ASSEMBLY_CONSTITUENCY_ID;
  
        const candidateResults = await CandidateResult.findAll({
          where: { result_id: result.RESULT_ID },
          include: [{ model: Candidate }],
        });
  
        if (!candidateResults.length) continue;
  
        let highestVotes = 0;
        let winner = null;
  
        for (const cr of candidateResults) {
          const candidate = cr.Candidate;
  
          const candidateInfo = {
            candidate_id: candidate.CANDIDATE_ID,
            candidate_name: candidate.NAME,
            party_id: candidate.PARTY_ID,
            votes: cr.votes,
            constituency_id: constituencyId
          };
  
          // All candidate votes in this section
          section.candidates.push(candidateInfo);
  
          // Party-wise vote count for that level
          section.partyVotes[candidate.PARTY_ID] =
            (section.partyVotes[candidate.PARTY_ID] || 0) + cr.votes;
  
          // State-level party votes
          finalResult.state.partyVotes[candidate.PARTY_ID] =
            (finalResult.state.partyVotes[candidate.PARTY_ID] || 0) + cr.votes;
  
          // Winner logic
          if (cr.votes > highestVotes) {
            highestVotes = cr.votes;
            winner = candidateInfo;
          }
        }
  
        // Save winner to DB
        if (winner) {
          await result.update({ WINNING_CANDIDATE_ID: winner.candidate_id });
          section.winners.push(winner);
        }
      }
  
      // Majority calculation
      finalResult.state.majority = getMajority(finalResult.state.partyVotes);
      finalResult.assembly.majority = getMajority(finalResult.assembly.partyVotes);
      finalResult.parliamentary.majority = getMajority(finalResult.parliamentary.partyVotes);
  
      res.json(finalResult);
  
    } catch (err) {
      console.error("Error generating result:", err);
      res.status(500).json({ message: "Something went wrong", error: err.message });
    }
  }
)






export default router;
