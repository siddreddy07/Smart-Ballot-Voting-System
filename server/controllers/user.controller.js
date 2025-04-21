import User from "../models/voter.model.js";
import { uploadImage } from "../utils/CloudinaryUtils.js";
import { generateToken } from "../utils/Token.js";
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';




export const generateOtp = async(req,res)=>{
    try {
      const {payload} = req.body
      console.log(payload)
      const tempRFID = `TEMP-${uuidv4()}`;

      const {username,userInput,type} = payload

      console.log(username)

      if(type == 'register' && !username || !userInput){
        return res.status(400).json({
          success: false,
          message: 'Please provide credentials to continue Registration.'
        });
      }

      if (!userInput) {
        return res.status(400).json({
          success: false,
          message: 'Please provide credentials to continue.'
        });
      }

      const otp = Math.floor(1000 + Math.random() * 9000);  // 4-digit OTP
      const otpExpiry = new Date(Date.now() +  2 * 60 * 1000);    // 2 mins expiry

      // ✅ Step 2: Determine Input Type
    let condition = {};

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (/^\d{10}$/.test(userInput)) {
      // Always allow PHN_NO
      condition = { PHN_NO: userInput };
    }
    else if (emailRegex.test(userInput)) {
      if (type === 'register') {
        condition = { EMAIL: userInput };
      } else {
        // ❌ If login, don't allow EMAIL
        return res.status(400).json({
          success: false,
          message: 'Login with EMAIL is not allowed'
        });
      }
    }
    else {
      if (type === 'login') {
        condition = { PHN_NO: userInput };
      } else {
        // ❌ If register, don't allow RFID
        return res.status(400).json({
          success: false,
          message: 'Register with RFID_NO is not allowed'
        });
      }
    }    



  
    if(!otp || !otpExpiry)
      return res.status(400).json({success:false,message:'OTP Generation Failed. Try Again'})

    
    const user = await User.findOne({ where: condition });

    if(!user && type == 'login'){
      return res.status(202).json({success:false,message:'No User Found'})
    }

    if(user && type == 'login'){
      user.OTP = otp
      user.OTP_EXPIRY = otpExpiry
      await user.save()
      console.log(user)
      console.log('Login ',otp)
      return res.status(200).json({success:true,message:'OTP Sent Successfully',userId:user.S_NO})
    }

    else if(user && type == 'register'){
      return res.status(400).json({success:false,message:'User Already Exists. Try Login Instead'})
    }

    else if(!user && type == 'register'){
      const newUser = await User.create({
        ...condition,
        USERNAME:username,
        RFID_NO: tempRFID, 
        OTP: otp,
        OTP_EXPIRY: otpExpiry
        })
      await newUser.save()
      console.log('New Fresh Registration : ',otp)
      return res.status(200).json({success:true,message:'OTP Sent Successfully',userId : newUser.S_NO})
    }


      
    } catch (error) {
      console.log('Error in OTP generation',error) 
    return res.status(500).json({success:false,message:'Internal Sevrer Error'})
    }
    }

export const getUserById = async (req, res) => {
  console.log('inside get user route')
      try {
        const {id} = req.params

        const {userId} = req

        console.log(userId)

        if(userId == id){
          const user = await User.findOne({where : {S_NO:id}});
          console.log(user)
          if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
          }
          
          return res.status(200).json({ success: true, user });
        }
    
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
      }
    };


export const register = async(req,res)=>{

    const {userInput} = req.body
    console.log(userInput)

    try {
        
        if(!userInput){
            res.status(400).json({success:false,message:'Please Enter Email/Phn.No to Continue'})
        }

        let EMAIL = null;
        let PHN_NO = null;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(emailRegex.test(userInput)){
            EMAIL = userInput
        }
        else if(/^\d{10}$/.test(userInput)){
            PHN_NO = userInput;
        }
        else{
            return res.status(400).json({success:false,message:'Invalid input. Provide valid Email or 10-digit Phone Number.'})
        }

        const existinguser = await User.findOne({
          where: {
            [EMAIL ? 'EMAIL' : 'PHN_NO']: EMAIL || PHN_NO
          }
        });

        console.log('Existing user : ',existinguser)



        if (existinguser.IS_VERIFIED) {
          // Generate JWT token based on EMAIL or PHN_NO
          const token = generateToken(existinguser.EMAIL || existinguser.PHN_NO, res);
        
          console.log("Generated Token:", token);

          existinguser.IS_VERIFIED = false
          await existinguser.save()
        
          if (token) {
            return res.status(201).json({
              success: true,
              message: 'Voter verified and Registered in successfully',
              token,               // Optional: send token back if needed
              user: existinguser,  // Return user data (sanitize if needed)
            });
          } else {
            await existinguser.destroy()
            return res.status(500).json({
              success: false,
              message: 'Failed to generate token. Please try again.',
            });
          }
        }
        
        
        await existinguser.destroy()
        return res.status(400).json({success:false,message:'Error in Registration. Reload Registration'})     

        

    } catch (error) {
        console.log('Error in User Registraion')
        res.status(500).json({success:false,message:'Internal Server Error'})
    }

}

export const verifyOtp = async(req,res)=>{

    const {userId,otp,type} = req.body
    console.log(typeof(otp))

    try {

        const user = await User.findByPk(userId)
        console.log(user)
        
        if (!user) {
            res.clearCookie("token", { httpOnly: true, secure: true });
            return res.status(404).json({ message: 'User not found' });
          }
        
          if (user.OTP_EXPIRY < new Date()) {
            if(!user.IS_VERIFIED && type ==='register'){
                await user.destroy();
            }
            res.clearCookie("token", { httpOnly: true, secure: true });
            return res.status(204).json({ message: 'OTP expired . Try to Register Again' });
          }
         
          if (user.OTP != parseInt(otp)) {
            res.clearCookie("token", { httpOnly: true, secure: true });
            return res.status(202).json({ message: 'Invalid OTP' });
          } 

          user.IS_VERIFIED = true;
          user.OTP = null;
          user.OTP_EXPIRY = null;
          await user.save(); 

          
    return res.status(201).json({success:true,message:'Verified Otp Successfully'})

    } catch (error) {
        console.error('Verify OTP Error:', error); 
        res.clearCookie("token", { httpOnly: true, secure: true });
    res.status(500).json({ message: 'Something went wrong' });
    }

}

export const login = async (req, res) => {
  const { userInput } = req.body;

  try {
    // ✅ Step 1: Validate Input
    if (!userInput) {
      return res.status(400).json({
        success: false,
        message: 'Please provide credentials to continue.'
      });
    }

    // ✅ Step 2: Determine Input Type
    let condition = {};
    if (/^\d{10}$/.test(userInput)) {
      condition = { PHN_NO: userInput };
    } else {
      condition = { RFID_NO: userInput };
    }

    // ✅ Step 3: Find User (findOne)
    const user = await User.findOne({ where: condition });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.'
      });
    }

    // ✅ Step 4: Check Verification Status
    if (user.IS_VERIFIED) {
      // ✅ Step 5: Generate JWT Token
      const token = generateToken(user.PHN_NO, res);

      if (!token) {
        return res.status(500).json({
          success: false,
          message: 'Failed to generate token. Try again later.'
        });
      }

      // ✅ Step 7: Success Response
      return res.status(200).json({
        success: true,
        message: 'User Logged In Successfully!',
        user
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'User is not verified. Please complete verification first.'
      });
    }

  } catch (error) {
    console.error('Error in Login:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

export const AddDetails = async (req, res) => {
  const { userId } = req;
  const { id } = req.params;

  try {
    const user = await User.findOne({ where: { S_NO: userId } });

    if (!user) {
      return res.status(400).json({ success: false, message: 'No User Found' });
    }

    const { addData } = req.body;
    const userData = { ...addData };

    // Optional: upload new image if provided
    if (userData.IMAGE !== undefined) {
      const uploadedUrl = await uploadImage(userData.IMAGE, 'users');
      userData.IMAGE = uploadedUrl;
    }

    // ✅ Include IS_VERIFIED override here
    const updatedData = await user.update({
      ...userData,
      IS_VERIFIED: false,
    });

    return res.status(200).json({
      success: true,
      message: 'User Data Registered Successfully',
      updatedData,
    });

  } catch (error) {
    console.error('❌ Error in AddDetails:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


export const loginECI = async(req,res)=>{

  try {

    const {userId} = req

    const user = await User.findOne({where:{S_NO:userId,RFID_NO:process.env.ECI_HEAD}})

    if(!user){
      return res.status(400).json({success:false,message:'User Not Authorized'})
    }

    await generateToken(user.EMAIL,res)
    return res.status(200).json({success:true,message:'ECI Head Login Successfull'})


  } catch (error) {
    console.log("Error : ",error.message)
    return res.status(500).json({success:false,message:'Internal Server Error'})
  }

}


export const continueRegistration = async(req,res)=>{
  try {

    const {id} = req.params

    console.log(id)

    const {userId} = req
    
    if(!id || userId){
      return res.status(400).json({success:false,message:'Invalid Request'})
    }

    if(id != userId){
      return res.status(400).json({success:false,message:'Unauthorized Request'})
    }

    const candidate = await User.findByPk(id)

    if(!candidate){
      return res.status(400).json({success:false,message:'Candidate Not Found'})
    }

    return res.status(200).json({success:true,message:"Continue - registration",user:candidate})

  } catch (error) {
    return res.status(500).json({success:false,message:'internal Server Error'})
  }
}
