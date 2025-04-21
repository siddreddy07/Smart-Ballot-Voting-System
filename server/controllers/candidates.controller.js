import bcrypt from "bcryptjs";
import Candidate from "../models/candiatesmaster.model.js";
import User from "../models/voter.model.js";
import { generateToken } from "../utils/Token.js";
import VerificationOfficer from "../models/verification_officer.model.js";

export const registerCandidate = async (req, res) => {
    try {

      const candidatePayload = req.body

      console.log(candidatePayload)

      const {
        EMAIL,
        NAME,
        RFID_NO,
        PARTY_ID,
        ELECTION_TYPE,
        STATE_ID,
        DISTRICT_ID,
        ASSEMBLY_CONSTITUENCY_ID,
        PARLIAMENTARY_CONSTITUENCY_ID,
        PASSWORD,
      } = candidatePayload;
  
      const existingUser = await User.findOne({ where: { RFID_NO } });
      if (!existingUser) {
        return res.status(200).json({ success: false, message: "RFID not registered in the system" });
      }
  
      const existingOfficer = await VerificationOfficer.findOne({ where: { RFID_NO } });
      if (existingOfficer) {
        return res.status(200).json({ success: false, message: "RFID is already associated with a Verification Officer" });
      }
  
      if (ELECTION_TYPE === "MLA" && !ASSEMBLY_CONSTITUENCY_ID) {
        return res.status(200).json({ success: false, message: "MLA candidates must have ASSEMBLY_CONSTITUENCY_ID" });
      }
      if (ELECTION_TYPE === "MP" && !PARLIAMENTARY_CONSTITUENCY_ID) {
        return res.status(200).json({ success: false, message: "MP candidates must have PARLIAMENTARY_CONSTITUENCY_ID" });
      }
  
      if (ELECTION_TYPE === "MLA") {
        const existingMLA = await Candidate.findOne({
          where: {
            STATE_ID,
            DISTRICT_ID,
            PARTY_ID,
            ASSEMBLY_CONSTITUENCY_ID,
            STATUS: "Member",
          },
        });
  
        if (existingMLA) {
          return res.status(200).json({
            success: false,
            message: "An active MLA candidate from the same party is already registered in this assembly constituency",
          });
        }
      }
  
      if (ELECTION_TYPE === "MP") {
        const existingMP = await Candidate.findOne({
          where: {
            STATE_ID,
            DISTRICT_ID,
            PARTY_ID,
            PARLIAMENTARY_CONSTITUENCY_ID,
            STATUS: "Active",
          },
        });
  
        if (existingMP) {
          return res.status(200).json({
            success: false,
            message: "An active MP candidate from the same party is already registered in this parliamentary constituency",
          });
        }
      }
  
      const existingCandidate = await Candidate.findOne({ where: { EMAIL } });
      if (existingCandidate) {
        return res.status(200).json({ success: false, message: "Candidate with this email already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(PASSWORD, 10);
  
      const newCandidate = await Candidate.create({
        EMAIL,
        NAME,
        RFID_NO,
        PARTY_ID,
        ELECTION_TYPE,
        STATE_ID,
        DISTRICT_ID,
        ASSEMBLY_CONSTITUENCY_ID,
        PARLIAMENTARY_CONSTITUENCY_ID,
        PASSWORD: hashedPassword
      });
  
      const token = generateToken(newCandidate.EMAIL, res);
      if (!token) {
        await newCandidate.destroy();
        return res.status(200).json({ success: false, message: "Error generating token" });
      }
  
      const registeredCandidate = newCandidate.toJSON();
      delete registeredCandidate.PASSWORD;
      delete registeredCandidate.RFID_NO;
      delete registeredCandidate.EMAIL;
  
      return res.status(200).json({
        success: true,
        message: "Candidate registered successfully",
        candidate: registeredCandidate,
      });
  
    } catch (error) {
      console.error("Error registering candidate:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

  
export const loginCandidate = async (req, res) => {
    try {
      const { EMAIL, PASSWORD } = req.body;
  
      const candidate = await Candidate.findOne({ where: { EMAIL } });
      if (!candidate) {
        return res.status(400).json({ success: false, message: "Invalid email or password" });
      }
  
      const isPasswordValid = await bcrypt.compare(PASSWORD, candidate.PASSWORD);
      if (!isPasswordValid) {
        return res.status(400).json({ success: false, message: "Invalid email or password" });
      }

      generateToken(candidate.EMAIL,res)
  
      return res.status(200).json({
        success: true,
        message: "Login successful",
        candidate: {
          NAME: candidate.NAME,
          EMAIL: candidate.EMAIL,
          ELECTION_TYPE: candidate.ELECTION_TYPE,
          PARTY_ID:candidate.PARTY_ID,
          STATE_ID: candidate.STATE_ID,
          DISTRICT_ID: candidate.DISTRICT_ID,
          ROLE: candidate.ROLE,
        },
      });
  
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

  export const updateCandidate = async (req, res) => {
    try {
        const { candidateId } = req.params;
        const { ELECTION_TYPE, ASSEMBLY_CONSTITUENCY_ID, PARLIAMENTARY_CONSTITUENCY_ID, DISTRICT_ID, PARTY_ID, STATUS, NAME, EMAIL } = req.body;

        const candidateToUpdate = await Candidate.findByPk(candidateId);
        if (!candidateToUpdate) {
            return res.status(404).json({ success: false, message: "Candidate not found" });
        }

        const loggedInUser = await Candidate.findByPk(req.userId); // Get the logged-in user
        if (!loggedInUser) {
            return res.status(403).json({ success: false, message: "Unauthorized user" });
        }

        const isSelf = loggedInUser.CANDIDATE_ID === parseInt(candidateId, 10); // Check if updating own profile

        /** ---------------------- ROLE-BASED PERMISSIONS ---------------------- **/
        if (isSelf) {
            // A normal Member can update only their own Name and Email
            const updatableFields = {};
            if (NAME) updatableFields.NAME = NAME;
            if (EMAIL) updatableFields.EMAIL = EMAIL;

            if (Object.keys(updatableFields).length === 0) {
                return res.status(403).json({ success: false, message: "You can only update your NAME and EMAIL" });
            }

            await candidateToUpdate.update(updatableFields);
            return res.status(200).json({ success: true, message: "Profile updated successfully", candidate: candidateToUpdate });
        }

        // Only an Associate or Manager can modify another candidate
        if (!["Associate", "Manager"].includes(loggedInUser.ROLE)) {
            return res.status(403).json({ success: false, message: "You are not allowed to update this candidate" });
        }

        // An Associate can update only candidates of the same Party and District
        if (loggedInUser.ROLE === "Associate" && (loggedInUser.PARTY_ID !== candidateToUpdate.PARTY_ID || loggedInUser.DISTRICT_ID !== candidateToUpdate.DISTRICT_ID)) {
            return res.status(403).json({ success: false, message: "You can only update candidates from your own Party and District" });
        }

        /** ---------------------- FIELD-SPECIFIC RESTRICTIONS ---------------------- **/
        // Only a Manager can change PARTY_ID, and it sets STATUS to Inactive
        if (PARTY_ID && PARTY_ID !== candidateToUpdate.PARTY_ID) {
            if (loggedInUser.ROLE !== "Manager") {
                return res.status(403).json({ success: false, message: "Only a Manager can change PARTY_ID" });
            }
            req.body.STATUS = "Inactive"; // Set status to inactive when party is changed
        }

        // STATE_ID should never be changed
        if ("STATE_ID" in req.body) {
            return res.status(403).json({ success: false, message: "STATE_ID cannot be changed" });
        }

        // Only an Associate can update DISTRICT_ID
        if (DISTRICT_ID && DISTRICT_ID !== candidateToUpdate.DISTRICT_ID) {
            if (loggedInUser.ROLE !== "Associate") {
                return res.status(403).json({ success: false, message: "Only an Associate can update DISTRICT_ID" });
            }
        }

        // If ELECTION_TYPE is changed, ensure the correct constituency ID is also updated
        if (ELECTION_TYPE && ELECTION_TYPE !== candidateToUpdate.ELECTION_TYPE) {
            if (ELECTION_TYPE === "MLA" && !ASSEMBLY_CONSTITUENCY_ID) {
                return res.status(400).json({ success: false, message: "MLA candidates must have an Assembly Constituency ID" });
            }
            if (ELECTION_TYPE === "MP" && !PARLIAMENTARY_CONSTITUENCY_ID) {
                return res.status(400).json({ success: false, message: "MP candidates must have a Parliamentary Constituency ID" });
            }
            req.body.STATUS = "Inactive"; // Set status to inactive when election type is changed
        }

        // Ensure no two Active candidates from the same Party, District, and Constituency exist
        if (STATUS === "Active") {
            if (candidateToUpdate.ELECTION_TYPE === "MLA") {
                const existingMLA = await Candidate.findOne({
                    where: {
                        PARTY_ID: candidateToUpdate.PARTY_ID,
                        DISTRICT_ID: candidateToUpdate.DISTRICT_ID,
                        ASSEMBLY_CONSTITUENCY_ID: candidateToUpdate.ASSEMBLY_CONSTITUENCY_ID,
                        STATUS: "Active",
                        ELECTION_TYPE: "MLA",
                    },
                });
                if (existingMLA && existingMLA.CANDIDATE_ID !== candidateId) {
                    return res.status(400).json({ success: false, message: "An Active MLA from the same Party, District, and Assembly Constituency already exists" });
                }
            }

            if (candidateToUpdate.ELECTION_TYPE === "MP") {
                const existingMP = await Candidate.findOne({
                    where: {
                        PARTY_ID: candidateToUpdate.PARTY_ID,
                        DISTRICT_ID: candidateToUpdate.DISTRICT_ID,
                        PARLIAMENTARY_CONSTITUENCY_ID: candidateToUpdate.PARLIAMENTARY_CONSTITUENCY_ID,
                        STATUS: "Active",
                        ELECTION_TYPE: "MP",
                    },
                });
                if (existingMP && existingMP.CANDIDATE_ID !== candidateId) {
                    return res.status(400).json({ success: false, message: "An Active MP from the same Party, District, and Parliamentary Constituency already exists" });
                }
            }
        }

        // Apply the update
        await candidateToUpdate.update(req.body);
        return res.status(200).json({ success: true, message: "Candidate updated successfully", candidate: candidateToUpdate });

    } catch (error) {
        console.error("Error updating candidate:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};












  
      
