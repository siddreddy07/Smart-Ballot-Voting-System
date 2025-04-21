import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConnect.js";
import User from "./voter.model.js";

const VerificationOfficer = sequelize.define('VerificationOfficer', {
  SUPERVISOR_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  CENTER: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  SUPERVISOR_NAME: {
    type: DataTypes.STRING(45),
    allowNull: false
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
  EMAIL: {
    type: DataTypes.STRING(55),
    allowNull: false,
    unique: true
  },
  PASSWORD: {
    type: DataTypes.STRING(255), // Store the hashed password
    allowNull: false
  },
  ROLE: {
    type: DataTypes.ENUM('general', 'manager'),
    defaultValue: 'general'
  },
}, {
  tableName: 'verification_officer', // Table name remains lowercase
  timestamps: true,
});

export default VerificationOfficer;
