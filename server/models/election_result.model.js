import { sequelize } from "../config/dbConnect.js";
import { DataTypes, Sequelize } from "sequelize";
import Candidate from "./candiatesmaster.model.js";

const ElectionResult = sequelize.define("ElectionResult", {
    RESULT_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ELECTION_TYPE: {
      type: DataTypes.ENUM("MP", "MLA"),
      allowNull: false,
    },
    STATE_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    DISTRICT_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ASSEMBLY_CONSTITUENCY_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    PARLIAMENTARY_CONSTITUENCY_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ELECTION_DATE: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    
    TOTAL_VOTES_POLLED: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    WINNING_CANDIDATE_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Candidate,
        key: "CANDIDATE_ID",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    RESULT_STATUS: {
      type: DataTypes.ENUM("Declared", "Pending"),
      defaultValue: "Pending",
    },
    RESULT_DECLARED_AT: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
  
  export default ElectionResult;