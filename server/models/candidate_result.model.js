import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConnect.js";
import ElectionResult from "./election_result.model.js";
import Candidate from "./candiatesmaster.model.js";

const CandidateResult = sequelize.define("CandidateResult", {
  candidate_result_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  result_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ElectionResult,
      key: "RESULT_ID",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  candidate_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Candidate,
      key: "CANDIDATE_ID",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  votes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: "candidate_result",
  timestamps: false,
});


export default CandidateResult;
