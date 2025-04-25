
import bcrypt from 'bcryptjs';
import { Op, literal } from 'sequelize'; 
import User from '../models/voter.model.js';
import VerificationOfficer from '../models/verification_officer.model.js';
import { generateToken } from '../utils/Token.js';
import { uploadImage, deleteImage } from '../utils/CloudinaryUtils.js';

export const registerVerificationOfficer = async (req, res) => {
    const {officerData} = req.body

    console.log(officerData)
    
    const { SUPERVISOR_NAME, RFID_NO, EMAIL, PASSWORD } = officerData;

    try {
        if (!SUPERVISOR_NAME || !RFID_NO || !EMAIL || !PASSWORD) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields.'
            });
        }

        const verification_officerExists = await VerificationOfficer.findOne({ where:{ EMAIL } });

        if(verification_officerExists){
            return res.status(400).json({success:false,message:'Email Already Exists'})
        }

        const userExists = await User.findOne({ where: { RFID_NO } });
        if (!userExists) {
            return res.status(400).json({
                success: false,
                message: 'RFID number not found in user database.'
            });
        }

        const hashedPassword = await bcrypt.hash(PASSWORD, 10);

        const verificationOfficer = await VerificationOfficer.create({
            SUPERVISOR_NAME,
            RFID_NO,
            EMAIL,
            PASSWORD: hashedPassword
        });

        const verificationOfficerData = verificationOfficer.toJSON();
        delete verificationOfficerData.PASSWORD;
        delete verificationOfficerData.RFID_NO

        // const token = generateToken(verificationOfficerData.EMAIL,res)
        return res.status(201).json({
            success: true,
            message: 'Verification officer registered successfully.',
            user: verificationOfficerData,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};






export const loginVerificationOfficer = async (req, res) => {

    const {officerData} = req.body

    const { EMAIL, PASSWORD } = officerData;

  
    try {
      if (!EMAIL || !PASSWORD) {
        return res.status(400).json({
          success: false,
          message: "Please provide both email and password.",
        });
      }
  
      // Find the officer and include related User using RFID_NO
      const verificationOfficer = await VerificationOfficer.findOne({
        where: { EMAIL },
        include: [
          {
            model: User,
            attributes: {
              exclude: ["PASSWORD","RFID_NO", "FINGERPRINT", "createdAt", "updatedAt"], // exclude sensitive info
            },
          },
        ],
      });
  
      if (!verificationOfficer) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password.",
        });
      }
  
      const isMatch = await bcrypt.compare(PASSWORD, verificationOfficer.PASSWORD);
  
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password.",
        });
      }
  
      const verificationOfficerData = verificationOfficer.toJSON();
      delete verificationOfficerData.PASSWORD;
      delete verificationOfficerData.RFID_NO;
  
      // Set token if needed
      const token = generateToken(verificationOfficerData.EMAIL, res);
  
      return res.status(200).json({
        success: true,
        message: "Login successful.",
        data: {
          user: verificationOfficerData
        },
      });
    } catch (error) {
      console.error("Login Error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error. Please try again later.",
      });
    }
  };






export const logoutVerificationOfficer = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'Strict',
        });

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully.',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};







export const updatedetailsVerificationOfficer = async (req, res) => {
    try {
        const { userId } = req;
        const updatedata = req.body;
        const { CENTER, SUPERVISOR_ID } = req.query;

        if (!CENTER || !SUPERVISOR_ID) {
            return res.status(400).json({ success: false, message: 'Both Queries cannot be null' });
        }

        if (!updatedata || Object.keys(updatedata).length === 0) {
            return res.status(400).json({ success: false, message: 'No update data provided.' });
        }

        delete updatedata.RFID_NO;

        const officer = await VerificationOfficer.findByPk(SUPERVISOR_ID);

        if (!officer) {
            return res.status(400).json({ success: false, message: 'No verification officer found.' });
        }

        const manager = await VerificationOfficer.findOne({
            where: {
                SUPERVISOR_ID: userId,
                CENTER,
                ROLE: "manager",
            },
        });


        if (SUPERVISOR_ID == userId) {
            delete updatedata.CENTER;
            delete updatedata.SUPERVISOR_NAME
            delete updatedata.ROLE;

            const newData = (await officer.update(updatedata)).toJSON();
            delete newData.PASSWORD
            delete newData.RFID_NO
            return res.status(200).json({ success: true, message: 'Your details have been updated successfully', officer:newData });
        }

    
        if (manager) {
            if (manager.CENTER !== CENTER) {
                return res.status(403).json({ success: false, message: 'Manager can update only officers in their own center.' });
            }

            delete updatedata.PASSWORD;
            delete updatedata.EMAIL;

           const newData = (await officer.update(updatedata)).toJSON();
           delete newData.PASSWORD
            delete newData.RFID_NO
            return res.status(200).json({ success: true, message: 'Officer details updated successfully', officer:newData });
        }

        return res.status(403).json({ success: false, message: 'Unauthorized action.' });

    } catch (error) {
        console.error("Error in updatedetailsVerificationOfficer:", error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};







export const getUsersByCenterAndShift = async (req, res) => {
  const { userId } = req;

  try {
    const verificationOfficer = await VerificationOfficer.findOne({
      where: { SUPERVISOR_ID: userId },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["PASSWORD", "RFID_NO", "FINGERPRINT", "createdAt", "updatedAt", "OTP", "NAME", "PARENT_NAME"]
          }
        }
      ]
    });
    if (!verificationOfficer) {
      return res.status(404).json({
        success: false,
        message: 'Verification officer not found',
      });
    }

    const officerCenter = verificationOfficer.CENTER;
    console.log('Verification Officer Center:', officerCenter);

    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    // Get today's date string: YYYY-MM-DD
    const year = currentTime.getFullYear();
    const month = String(currentTime.getMonth() + 1).padStart(2, '0');
    const day = String(currentTime.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    let shiftStartStr = null;
    let shiftEndStr = null;
    let shiftLabel = null;

    // Morning Shift: 9:00 AM - 12:30 PM
    if (
      (currentHour === 9 && currentMinute >= 0) ||
      (currentHour > 9 && currentHour < 12) ||
      (currentHour === 12 && currentMinute <= 30)
    ) {
      shiftStartStr = `${todayStr} 09:00:00`;
      shiftEndStr = `${todayStr} 12:30:00`;
      shiftLabel = '9:00 AM to 12:30 PM';
    }

    // Evening Shift: 1:30 PM - 5:00 PM
    else if (
      (currentHour === 13 && currentMinute >= 30) ||
      (currentHour > 13 && currentHour < 17) ||
      (currentHour === 17 && currentMinute <= 0)
    ) {
      shiftStartStr = `${todayStr} 13:30:00`;
      shiftEndStr = `${todayStr} 17:00:00`;
      shiftLabel = '1:30 PM to 5:00 PM';
    }

    else {
      return res.status(200).json({
        success: false,
        message: 'No active shifts at this time.',
      });
    }

    const users = await User.findAll({
      where: {
        [Op.and]: [
          {
            [Op.and]: [
              literal(`json_unquote(json_extract(TIME_ND_CENTER, '$.center')) = '${officerCenter}'`),
              literal(`CAST(json_unquote(json_extract(TIME_ND_CENTER, '$.time')) AS DATETIME) BETWEEN '${shiftStartStr}' AND '${shiftEndStr}'`)
            ]
          }
        ]
      },
      attributes: ['S_NO', 'IMAGE', 'NAME', 'PHN_NO', 'AADHAR_CARD']
    });

    if (!users || users.length === 0) {
      return res.status(200).json({
        success: false,
        message: `No users found for the ${shiftLabel} shift.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `${shiftLabel} shift users fetched successfully.`,
      data: users,
      user: verificationOfficer,
      list: users.length
    });

  } catch (error) {
    console.error('Error in getUsersByCenterAndShift:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};







export const updateUserByVerificationOfficer = async (req, res) => {
  const { userId } = req; // VO's user ID
  const { targetUserId, IMAGE, FINGERPRINT, EMAIL, PHN_NO, RFID_NO } = req.body;

  try {
    console.log(RFID_NO);
    // Check for RFID conflict
    if (RFID_NO !== undefined) {
      const existingUser = await User.findOne({ where: { RFID_NO } });

      if (existingUser && existingUser.S_NO !== targetUserId) {
        return res.status(409).json({
          success: false,
          message: 'RFID_NO already associated with a different user',
        });
      }
    }

    // Verify VO
    const verificationOfficer = await VerificationOfficer.findOne({
      where: { SUPERVISOR_ID: userId },
    });

    if (!verificationOfficer) {
      return res.status(404).json({
        success: false,
        message: 'Verification officer not found',
      });
    }

    const officerCenter = verificationOfficer.CENTER;

    // Find target user
    const targetUser = await User.findOne({ where: { S_NO: targetUserId } });

    console.log(targetUser.RFID_NO);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found',
      });
    }

    // Center and shift time validation
    const userCenter = targetUser.TIME_ND_CENTER?.center;
    const userTime = targetUser.TIME_ND_CENTER?.time;

    if (!userCenter || !userTime) {
      return res.status(400).json({
        success: false,
        message: 'User center or time not properly set',
      });
    }

    if (userCenter !== officerCenter) {
      return res.status(403).json({
        success: false,
        message: "Verification officer is not authorized for this user's center",
      });
    }

    const currentTime = new Date();
    const userShiftTime = new Date(userTime);

    // Morning Shift: 9:00 AM - 12:30 PM
    const shiftStart1 = new Date(userShiftTime);
    shiftStart1.setHours(9, 0, 0);
    const shiftEnd1 = new Date(userShiftTime);
    shiftEnd1.setHours(12, 30, 0);

    // Evening Shift: 1:30 PM - 5:00 PM
    const shiftStart2 = new Date(userShiftTime);
    shiftStart2.setHours(13, 30, 0);
    const shiftEnd2 = new Date(userShiftTime);
    shiftEnd2.setHours(17, 0, 0);

    const isInShift =
      (currentTime >= shiftStart1 && currentTime <= shiftEnd1) ||
      (currentTime >= shiftStart2 && currentTime <= shiftEnd2);

    if (!isInShift) {
      return res.status(403).json({
        success: false,
        message: 'User is not in an active shift currently',
      });
    }

    // Prepare updated fields
    const updatedFields = {};

    // ✅ Image handling: delete old image, upload new one
    if (IMAGE !== undefined) {
      if (targetUser.IMAGE) {
        await deleteImage(targetUser.IMAGE); // old URL
      }

      const uploadedUrl = await uploadImage(IMAGE, 'users');
      updatedFields.IMAGE = uploadedUrl;
    }

    if (FINGERPRINT !== undefined) updatedFields.FINGERPRINT = FINGERPRINT;
    if (EMAIL !== undefined) updatedFields.EMAIL = EMAIL;
    if (PHN_NO !== undefined) updatedFields.PHN_NO = PHN_NO;
    if (RFID_NO !== undefined) updatedFields.RFID_NO = RFID_NO;

    // Clear TIME_ND_CENTER
    targetUser.TIME_ND_CENTER = null;

    // Update user
    await targetUser.update(updatedFields);

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedFields,
    });
  } catch (error) {
    console.error('Error in updateUserByVerificationOfficer:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};






export const getUserDetailsByVerificationOfficer = async (req, res) => {
  const { userId } = req; // VO's user ID
  const { targetUserId } = req.query; // User's ID to fetch

  console.log(typeof(targetUserId));

  try {
    const verificationOfficer = await VerificationOfficer.findOne({
      where: { SUPERVISOR_ID: userId }
    });

    console.log(verificationOfficer);

    if (!verificationOfficer) {
      return res.status(404).json({
        success: false,
        message: 'Verification officer not found',
      });
    }

    const officerCenter = verificationOfficer.CENTER;

    console.log(officerCenter);

    const targetUser = await User.findOne({ where: { S_NO: targetUserId } });

    console.log(targetUser);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found',
      });
    }

    // Parse JSON TIME_ND_CENTER
    const userCenter = targetUser.TIME_ND_CENTER?.center;
    const userShiftTime = targetUser.TIME_ND_CENTER?.time;

    if (!userCenter || !userShiftTime) {
      return res.status(400).json({
        success: false,
        message: 'User TIME_ND_CENTER data is missing or malformed',
      });
    }

    if (userCenter !== officerCenter) {
      return res.status(403).json({
        success: false,
        message: 'Verification officer not authorized for this user\'s center',
      });
    }

    const now = new Date();
    const shiftBaseDate = new Date(userShiftTime);

    // Morning Shift: 9:00 AM - 12:30 PM
    const shiftStart1 = new Date(shiftBaseDate);
    shiftStart1.setHours(9, 0, 0); // 9:00 AM
    const shiftEnd1 = new Date(shiftBaseDate);
    shiftEnd1.setHours(12, 30, 0); // 12:30 PM

    // Evening Shift: 1:30 PM - 5:00 PM
    const shiftStart2 = new Date(shiftBaseDate); // Declare shiftStart2
    shiftStart2.setHours(13, 30, 0); // 1:30 PM
    const shiftEnd2 = new Date(shiftBaseDate);
    shiftEnd2.setHours(17, 0, 0); // 5:00 PM

    const isInShift =
      (now >= shiftStart1 && now <= shiftEnd1) ||
      (now >= shiftStart2 && now <= shiftEnd2);

    if (!isInShift) {
      return res.status(403).json({
        success: false,
        message: 'User is not in an active shift currently',
      });
    }

    const candidate = targetUser.toJSON();

    delete candidate.VOTING_BOOTH;
    delete candidate.VOTE_STATE;
    delete candidate.TIME_ND_CENTER;
    delete candidate.FINGERPRINT;
    delete candidate.RFID_NO;

    console.log(candidate);

    // All validations passed — send full user data
    return res.status(200).json({
      success: true,
      message: 'User details fetched successfully',
      data: candidate
    });

  } catch (error) {
    console.error('Error in getUserDetailsByVerificationOfficer:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};









export const getOfficerDetails = async (req, res) => {
    try {
        const { userId } = req;
        const { SUPERVISOR_ID, CENTER } = req.query;

        const manager = await VerificationOfficer.findOne({
            where: { SUPERVISOR_ID: userId, CENTER, ROLE: "manager" },
        });

        if (!manager && SUPERVISOR_ID != userId) {
            return res.status(400).json({ success: false, message: "Unauthorized Access" });
        }

        const officer = await VerificationOfficer.findOne({
            where: { SUPERVISOR_ID },
            include: {
                model: User,
                required: false, // Change to false to allow missing values
                attributes: ["NAME", "EMAIL", "PHN_NO", "PRESENT_ADDRESS", "GENDER", "IMAGE", "AADHAR_CARD"],
            },
        });
        console.log("Fetched Officer:", JSON.stringify(officer, null, 2));

        if (!officer) {
            return res.status(400).json({ success: false, message: "No Officer Found" });
        }

        const officerDetails = officer.toJSON();
        delete officerDetails.PASSWORD;
        delete officerDetails.RFID_NO;

        return res.status(200).json({ success: true, officer: officerDetails });

    } catch (error) {
        console.log("Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};







export const updatevdetails = async(req,res)=>{
    
    try {
        
        const {userId} = req

        const updatedata = req.body

        console.log(userId)
        delete updatedata.RFID_NO

        const user = await VerificationOfficer.findByPk(userId)

        if(!user){
            return res.status(400).json({success:false,message:'Unauthorized Access'})
        }

        delete updatedata.SUPERVISOR_NAME

        const newData = await (await user.update(updatedata)).toJSON()
        console.log(newData)

        delete newData.PASSWORD
        delete newData.RFID_NO


        return res.status(200).json({success:true,message:'Updated Successfully !',newData})

    } catch (error) {
        console.log("Error : ",error.message)
        return res.status(500).json({success:false,message:'Internal Server Error'})
    }

}







export const getVerificationOfficersByCenter = async (req, res) => {
  try {
    const { CENTER } = req.params;
    const { userId } = req;

    const manager = await VerificationOfficer.findOne({
      where: { SUPERVISOR_ID: userId, ROLE: "manager" }
    });

    if (!manager) {
      return res.status(403).json({ success: false, message: "Unauthorized Access" });
    }

    const officers = await VerificationOfficer.findAll({
      where: { CENTER }
    });

    if (officers.length === 0) {
      return res.status(404).json({ success: false, message: "No verification officers found in this center" });
    }

    return res.status(200).json({ success: true, officers,list:officers.length });

  } catch (error) {
    console.error("Error fetching verification officers:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};








export const getVerificationOfficer = async (req, res) => {
    try {
      const {userId} = req;
      console.log(userId)
  
      const officer = await VerificationOfficer.findOne({
        where: { SUPERVISOR_ID : userId },
        include: [
          {
            model: User,
            attributes: {
                exclude: ["PASSWORD","RFID_NO", "FINGERPRINT", "createdAt", "updatedAt"], // exclude sensitive info
              },
          },
        ]
      });
  
      if (!officer) {
        return res.status(404).json({success:false, message: "Verification Officer not found" });
      }
  
      res.status(200).json({success:true, message:"VOfficer Found" ,officer});
    } catch (error) {
      console.error("Error fetching Verification Officer:", error);
      res.status(500).json({success:false, message: "Server error" });
    }
  };


  


