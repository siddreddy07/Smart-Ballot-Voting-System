import BoothOfficer from "../models/boothofficer.model.js";
import Candidate from "../models/candiatesmaster.model.js";
import CandidateResult from "../models/candidate_result.model.js";
import ElectionResult from "../models/election_result.model.js";
import VerificationOfficer from "../models/verification_officer.model.js";
import User from "../models/voter.model.js";

// ========== USER → VERIFICATION OFFICER ==========
User.hasOne(VerificationOfficer, {
  foreignKey: {
    name: "RFID_NO",
    allowNull: false,
    onUpdate: "CASCADE",
    onDelete: "SET NULL"
  }
});
VerificationOfficer.belongsTo(User, {
  foreignKey: {
    name: "RFID_NO",
    allowNull: false,
    onUpdate: "CASCADE",
    onDelete: "SET NULL"
  },
  targetKey: "RFID_NO"
});

// ========== USER → CANDIDATE ==========
User.hasOne(Candidate, {
  foreignKey: {
    name: "RFID_NO",
    allowNull: false,
    onUpdate: "CASCADE",
    onDelete: "SET NULL"
  }
});
Candidate.belongsTo(User, {
  foreignKey: {
    name: "RFID_NO",
    allowNull: false,
    onUpdate: "CASCADE",
    onDelete: "SET NULL"
  },
  targetKey: "RFID_NO"
});

// ========== USER → BOOTH OFFICER ==========
User.hasOne(BoothOfficer, {
  foreignKey: {
    name: "RFID_NO",
    allowNull: false,
    onUpdate: "CASCADE",
    onDelete: "SET NULL"
  }
});
BoothOfficer.belongsTo(User, {
  foreignKey: {
    name: "RFID_NO",
    allowNull: false,
    onUpdate: "CASCADE",
    onDelete: "SET NULL"
  },
  targetKey: "RFID_NO"
});

// ========== CANDIDATE → ELECTION RESULT ==========
Candidate.hasOne(ElectionResult, {
  foreignKey: {
    name: "WINNING_CANDIDATE_ID",
    allowNull: false
  }
});
ElectionResult.belongsTo(Candidate, {
  foreignKey: {
    name: "WINNING_CANDIDATE_ID",
    allowNull: false,
    targetKey: "CANDIDATE_ID"
  }
});

// ========== CANDIDATE → CANDIDATE RESULT ==========
Candidate.hasMany(CandidateResult, {
  foreignKey: {
    name: "candidate_id",
    allowNull: false
  }
});
CandidateResult.belongsTo(Candidate, {
  foreignKey: {
    name: "candidate_id",
    allowNull: false
  }
});

// ========== ELECTION RESULT → CANDIDATE RESULT ==========
ElectionResult.hasMany(CandidateResult, {
  foreignKey: {
    name: "result_id",
    allowNull: false
  }
});
CandidateResult.belongsTo(ElectionResult, {
  foreignKey: {
    name: "result_id",
    allowNull: false
  }
});

export default {
  User,
  VerificationOfficer,
  BoothOfficer,
  Candidate,
  CandidateResult,
  ElectionResult
};
