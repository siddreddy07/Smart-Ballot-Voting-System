import { DataTypes } from "sequelize";
import {sequelize} from "../config/dbConnect.js";
import User from "./voter.model.js";


const Candidate = sequelize.define(
  "Candidate",
  {
    CANDIDATE_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    NAME: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    EMAIL: {
      type: DataTypes.STRING(55),
      allowNull: false,
      unique: true
    },

    PASSWORD: {
      type: DataTypes.STRING,
      allowNull: false
    },
    
    PARTY_ID: {
      type: DataTypes.STRING(45),
      allowNull: false
    },

    ELECTION_TYPE: {
      type: DataTypes.ENUM("MP", "MLA"),
      allowNull: false
    },

    STATE_ID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    DISTRICT_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    ASSEMBLY_CONSTITUENCY_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    PARLIAMENTARY_CONSTITUENCY_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    STATUS: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue:"Inactive"
    },

    ROLE:{
      type: DataTypes.ENUM("Associate", "Member","Manager"),
      defaultValue:"Member"
    },

    RFID_NO: {
    type: DataTypes.STRING(55),
    allowNull: false,
    references: {
      model: User,
      key: "RFID_NO",
    },
    unique: true
    },
  },
  {
    timestamps: true,
    tableName: "PARTY_CANDIDATES",
  }
);


export default Candidate;
