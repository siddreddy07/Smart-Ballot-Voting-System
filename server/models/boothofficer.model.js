import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConnect.js";
import User from "./voter.model.js";

const BoothOfficer = sequelize.define("BoothOfficer", {
  BOOTH_ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  OFFICER_NAME: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  OFFICER_EMAIL: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  OFFICER_PHONE: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  PASSWORD : {
    type:DataTypes.STRING(255),
    allowNull:false
  },
  RFID_NO: {
    type: DataTypes.STRING(255),
    allowNull: true, // ✅ Fix: Allow NULL to support ON DELETE SET NULL
    references: {
      model: User,
      key: "RFID_NO",
    },
    unique: true,
  },
  boothOfficerToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  STATUS: {
    type: DataTypes.ENUM("Active", "Inactive"),
    defaultValue: "Inactive",
  },
});

export default BoothOfficer;
