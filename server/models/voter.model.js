import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConnect.js";


const User = sequelize.define('User',{

    S_NO: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      EMAIL: {
        type: DataTypes.STRING(55),
        allowNull: true,
        unique: true
      },
      USERNAME: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        set(value) {
          this.setDataValue('USERNAME', value.trim().toLowerCase());
        }
      },
      PHN_NO: {
        type: DataTypes.STRING(15),
        allowNull: true
      },
      OTP: {
        type: DataTypes.STRING(6),
        allowNull: true
      },
      OTP_EXPIRY: {
        type: DataTypes.DATE,
        allowNull: true
      },
      IS_VERIFIED: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      NAME: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      PRESENT_ADDRESS: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      PERMANENT_ADDRESS: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      PARENT_NAME: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      IMAGE: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      GENDER: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      FINGERPRINT: {
        type: DataTypes.STRING(400),
        allowNull: true
      },
      DOB: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      AADHAR_CARD: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true
      },
      RFID_NO: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true
      },
      VOTING_BOOTH: {
        type: DataTypes.JSON,
        allowNull: true
      },
      VOTE_STATE: {
        type: DataTypes.JSON,
        allowNull: true
      },
      TIME_ND_CENTER: {
        type: DataTypes.JSON,
        allowNull: true
      }
    }, {
      tableName: 'Voter',
      timestamps: true

})


export default User