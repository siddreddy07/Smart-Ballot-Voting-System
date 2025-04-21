import { Op } from "sequelize";
import BoothOfficer from "../models/boothofficer.model.js";
import Candidate from "../models/candiatesmaster.model.js";
import VerificationOfficer from "../models/verification_officer.model.js";
import User from "../models/voter.model.js";
import { generateToken } from "../utils/Token.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"


export const registerBoothOfficer = async (req, res) => {
    try {

      const {form} = req.body

      console.log(form)

        const {
            BOOTH_ID,
            STATE_ID,
            DISTRICT_ID,
            ASSEMBLY_CONSTITUENCY_ID,
            PARLIAMENTARY_CONSTITUENCY_ID,
            OFFICER_NAME,
            OFFICER_EMAIL,
            OFFICER_PHONE,
            RFID_NO,
            PASSWORD,
        } = form;

        const userExists = await User.findOne({ where: { RFID_NO } });
        if (!userExists) {
            return res.status(200).json({ message: "RFID_NO not found in Users table!" });
        }

        const isInVerification = await VerificationOfficer.findOne({ where: { RFID_NO } });
        const isInCandidate = await Candidate.findOne({ where: { RFID_NO } });

        if (isInVerification || isInCandidate) {
            return res.status(200).json({ message: "RFID_NO is already assigned to another role!" });
        }

        const boothOfficerExists = await BoothOfficer.findOne({
            where: {
                BOOTH_ID,
                STATE_ID,
                DISTRICT_ID,
                ASSEMBLY_CONSTITUENCY_ID,
            },
        });

        if (boothOfficerExists) {
            return res.status(200).json({
                message: "A Booth Officer is already assigned to this booth!",
            });
        }

        const rfidExistsInBoothOfficer = await BoothOfficer.findOne({ where: { RFID_NO } });
        if (rfidExistsInBoothOfficer) {
            return res.status(200).json({
                message: "This RFID_NO is already assigned to another Booth Officer!",
            });
        }


        const phoneExists = await BoothOfficer.findOne({ where: { OFFICER_PHONE } });
        const emailExists = await BoothOfficer.findOne({ where: { OFFICER_EMAIL } });

        if (phoneExists) {
            return res.status(200).json({
                message: "This OFFICER_PHONE is already in use by another Booth Officer!",
            });
        }

        if (emailExists) {
            return res.status(200).json({
                message: "This OFFICER_EMAIL is already in use by another Booth Officer!",
            });
        }

        const hashedPassword = await bcrypt.hash(PASSWORD, 10);

        const newBoothOfficer = await BoothOfficer.create({
            BOOTH_ID,
            STATE_ID,
            DISTRICT_ID,
            ASSEMBLY_CONSTITUENCY_ID,
            PARLIAMENTARY_CONSTITUENCY_ID,
            OFFICER_NAME,
            OFFICER_EMAIL,
            OFFICER_PHONE,
            RFID_NO,
            PASSWORD: hashedPassword,
            STATUS: "Inactive",
        });

        generateToken(newBoothOfficer.OFFICER_EMAIL, res);

        
      const boothOfficer = await BoothOfficer.findOne({
        where:{RFID_NO},
        include:{
          model:User,
          required:false,
          attributes:["NAME", "EMAIL", "PHN_NO", "PRESENT_ADDRESS", "GENDER", "IMAGE", "AADHAR_CARD"]
        }
      })

        res.status(200).json({
          success:true,
            message: "Booth Officer Registered Successfully!",
            bofficer: boothOfficer,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


export const boothOfficerDetaisl = async(req,res)=>{


  try {
    
      const {userId} = req

      console.log(userId)

      console.log('Insdie there')
    
      const boothOfficer = await BoothOfficer.findOne({
        where:{RFID_NO:userId},
        include:{
          model:User,
          required:false,
          attributes:["NAME", "EMAIL", "PHN_NO", "PRESENT_ADDRESS", "GENDER", "IMAGE", "AADHAR_CARD"]
        }
      })
    
      if(!boothOfficer){
        return res.json({success:false,message:'No Booth officer Found'})
      }

    
      return res.status(200).json({success:true,bofficer:boothOfficer})
    
  } catch (error) {
    return res.json({success:false,message:'Internal Server Error'})
  }


}



export const loginBoothOfficer = async (req, res) => {
  try {
    const { ID, PASSWORD } = req.body;

    console.log(ID)
    console.log(PASSWORD)

    if (!ID || !PASSWORD) {
      return res.status(400).json({ message: "Both ID and Password are required!" });
    }

    // Dynamically find officer by RFID_NO or OFFICER_PHONE
    const boothOfficer = await BoothOfficer.findOne({
      where: {
        [Op.or]: [
          { RFID_NO: ID },
          { OFFICER_PHONE: ID }
        ]
      },
      include:{
        model:User,
        required:false,
        attributes:["NAME", "EMAIL", "PHN_NO", "PRESENT_ADDRESS", "GENDER", "IMAGE", "AADHAR_CARD"]
      }
    });

    if (!boothOfficer) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    const isMatch = await bcrypt.compare(PASSWORD, boothOfficer.PASSWORD);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    generateToken(boothOfficer.OFFICER_EMAIL, res);
    return res.status(200).json({
      success: true,
      message: "Login Successful!",
      bofficer: boothOfficer,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


export const logoutBoothOfficer = async(req,res)=>{

    try {

        const {userId} = req

        res.clearCookie('token',{
            httpOnly:true,
            sameSite:'Strict'
        })

        return res.status(200).json({success:true,message:"Logged Out Successfully!"})

    } catch (error) {

        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
        
    }

  }



 export const loginBoothOfficerWithBoothID = async (req, res) => {
    try {
      const { email, password } = req.body;
      const { STATE_ID, DISTRICT_ID, BOOTH_ID, loginPurpose } = req.query;
  
      const boothOfficer = await BoothOfficer.findOne({
        where: {
          OFFICER_EMAIL: email,
          STATE_ID,
          DISTRICT_ID,
          BOOTH_ID,
        }
      });
  
      if (!boothOfficer) {
        return res.status(404).json({ message: "Booth officer not found" });
      }
  
      const isMatch = await bcrypt.compare(password, boothOfficer.PASSWORD);
  
      if (!isMatch) {
        return res.status(401).json({success:false, message: "Invalid credentials" });
      }
  
      const payload = {
        id: boothOfficer.id,
        email: boothOfficer.OFFICER_EMAIL,
        purpose: loginPurpose
      };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
  
      return res.json({
        success:true,
        message: "Login successful"
      });
  
    } catch (error) {
      console.error("Login Error:", error);
      if (!res.headersSent) {
        return res.status(500).json({success:false, message: "Internal server error" });
      }
    }
  };
  

export const getVotersAtBooth = async (req, res) => {
  try {
      console.log("Received Query Params:", req.query);

      const STATE_ID = parseInt(req.query.STATE_ID, 10);
      const DISTRICT_ID = parseInt(req.query.DISTRICT_ID, 10);
      const BOOTH_ID = parseInt(req.query.BOOTH_ID, 10);
      const ASSEMBLY_ID = parseInt(req.query.ASSEMBLY_ID, 10);
      const PARLIAMENTARY_ID = parseInt(req.query.PARLIAMENTARY_ID, 10);

      if (!STATE_ID || !DISTRICT_ID || !BOOTH_ID) {
          return res.status(400).json({ success: false, message: "Invalid or missing STATE_ID, DISTRICT_ID, or BOOTH_ID" });
      }

      const boothOfficer = await BoothOfficer.findOne({
          where: { STATE_ID, DISTRICT_ID, BOOTH_ID },
      });

      if (!boothOfficer) {
          return res.status(400).json({ message: "Booth Officer not authorized for this booth!" });
      }

      console.log("Booth Officer found:", boothOfficer);

      const voters = await User.findAll({
          where: {
            "VOTING_BOOTH.booth_id":BOOTH_ID,
              "VOTE_STATE.state_id": STATE_ID,
              "VOTE_STATE.district_id": DISTRICT_ID,
              "VOTE_STATE.assembly_id": ASSEMBLY_ID,
              "VOTE_STATE.parliamentary_id": PARLIAMENTARY_ID,
          },
          attributes: ["S_NO","PHN_NO", "NAME", "IMAGE","FINGERPRINT","RFID_NO"],
      });

      console.log(voters)

      if (!voters.length) {
          return res.status(404).json({success:false, message: "No voters found for this booth." });
      }

      // Update Booth Officer Status
      await boothOfficer.update({ STATUS: "Active" });

      res.status(200).json({
        success:true,
          message: "Voters fetched successfully!",
          voters,
      });

  } catch (error) {
      console.error("Error in getVotersAtBooth:", error);
      res.status(500).json({success:false, message: "Server Error", error: error.message });
  }
};



export const getCandidatesForVoter = async (req, res) => {
  try {
    const { BOOTH_OFFICER_ID, STATE_ID, DISTRICT_ID, ASSEMBLY_ID, PARLIAMENTARY_ID } = req.query;

    if (!BOOTH_OFFICER_ID || !STATE_ID || !DISTRICT_ID || !ASSEMBLY_ID || !PARLIAMENTARY_ID) {
      return res.status(400).json({ message: "Missing required query parameters!" });
    }

    const boothOfficer = await BoothOfficer.findOne({ where: {BOOTH_ID : BOOTH_OFFICER_ID,STATE_ID,DISTRICT_ID } });

    if (!boothOfficer || !boothOfficer.boothOfficerToken) {
      return res.status(404).json({ message: "Booth Officer/Voter not found!" });
    }

    let RFID_NO;
    try {
      const decoded = jwt.verify(boothOfficer.boothOfficerToken, process.env.JWT_SECRET);
      RFID_NO = decoded.RFID_NO;
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired RFID Token!" });
    }

    const voter = await User.findOne({
      where: {
        RFID_NO,
        "VOTE_STATE.state_id": STATE_ID,
        "VOTE_STATE.district_id": DISTRICT_ID,
        "VOTE_STATE.assembly_id": ASSEMBLY_ID,
        "VOTE_STATE.parliamentary_id": PARLIAMENTARY_ID
      },
    });

    if (!voter) {
      return res.status(404).json({ message: "Voter not found or does not match the given details!" });
    }

    if (!voter.VOTING_BOOTH?.is_Verified) {
      return res.status(403).json({ message: "Voter is not verified!" });
    }

    const mlaCandidates = await Candidate.findAll({
      where: { STATE_ID, DISTRICT_ID, ASSEMBLY_CONSTITUENCY_ID:ASSEMBLY_ID, ELECTION_TYPE: "MLA" },
    });

    const mpCandidates = await Candidate.findAll({
      where: { STATE_ID, DISTRICT_ID, PARLIAMENTARY_CONSTITUENCY_ID:PARLIAMENTARY_ID, ELECTION_TYPE: "MP" },
    });

    return res.status(200).json({
      message: "Candidates retrieved successfully!",
      MLA_Candidates: mlaCandidates,
      MP_Candidates: mpCandidates,
      user:voter
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



export const verifyVoter = async (req, res) => {
  try {
    const { S_NO, RFID_NO, FINGERPRINT, BOOTH_ID } = req.body; // ✅ No need to JSON.parse

    if (!S_NO) {
      return res.status(400).json({ message: "Voter S_NO is required!" });
    }

    const voter = await User.findOne({ where: { S_NO } });

    if (!voter) {
      return res.status(404).json({ message: "Voter not found!" });
    }

    let isRFIDVerified = voter.VOTING_BOOTH?.isRFIDVerified || false;
    let isFingerprintVerified = voter.VOTING_BOOTH?.isFingerprintVerified || false;

    if (RFID_NO) {
      if (voter.RFID_NO !== RFID_NO) {
        return res.status(400).json({ message: "RFID does not match!" });
      }
      isRFIDVerified = true;
    }

    if (FINGERPRINT) {
      if (voter.FINGERPRINT !== FINGERPRINT) {
        return res.status(400).json({ message: "Fingerprint does not match!" });
      }
      isFingerprintVerified = true;
    }

    const isFullyVerified = isRFIDVerified && isFingerprintVerified;

    voter.VOTING_BOOTH = {
      ...voter.VOTING_BOOTH,
      isRFIDVerified,
      isFingerprintVerified,
      is_Verified: isFullyVerified,
    };

    await voter.save();

    const officer = await BoothOfficer.findOne({ where: { BOOTH_ID } });

    if (isFullyVerified) {
      const token = jwt.sign({ RFID_NO: voter.RFID_NO }, process.env.JWT_SECRET, { expiresIn: '20m' });
      await officer.update({ boothOfficerToken: token });
      return res.status(200).json({ message: "Voter fully verified! Ready for voting." });
    } else if (RFID_NO) {
      return res.status(200).json({ message: "RFID verified! Now scan fingerprint." });
    } else if (FINGERPRINT) {
      return res.status(200).json({ message: "Fingerprint verified! Now scan RFID." });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


