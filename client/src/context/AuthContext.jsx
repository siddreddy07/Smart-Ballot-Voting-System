import { createContext, useContext, useState } from "react";

import toast from "react-hot-toast";
import axiosinstance from "../axiosinstance";
import { data, useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [otpPopup, setOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [retryEnabled, setRetryEnabled] = useState(false);


  const generateOtp = async (userInput,username,type) => {
    console.log("Inside Generat OTP")
    try {
      const payload = { userInput, type };
        
      // Include username if provided
      if (username) {
          payload.username = username;
      }
      const res = await axiosinstance.post("/auth/generateOtp", {
        payload
      });
      const {data} = res
      if (data.success) {
        setOtpPopup(true);
        setRetryEnabled(false);
        setTimeout(() => setRetryEnabled(true), 120000);
        console.log(data)
        setUser(data.userId)
        console.log(data.userId)
        toast.success(data.message)
      }
      if(!data.success){
          toast.error(data.message)
      }
    } catch (error) {
        console.log(error.message)
        toast.error(error.message)
      return error.response?.data || { success: false, message: "Something went wrong" };
    }
  };

  const verifyOtp = async (userId, otp) => {
    console.log(userId)
    try {
      const { data } = await axiosinstance.post("/auth/verifyotp", {
        userId,
        otp
      });
      if (data.success) {
        setOtpPopup(false);
        setUser(data.user);
        toast.success(data.message)
      }
      if(!data.success){
        toast.error(data.message)
      }
      return data;
    } catch (error) {
        toast.error(error.message)
      return error.response?.data || { success: false, message: "Something went wrong" };
    }
  };

  const login = async (userInput,navigate) => {
    try {
      const { data } = await axiosinstance.post("/auth/login", { userInput });
      if (data.success) {
        setUser(data.user);
        toast.success(data.message)
        navigate(`/userdashboard/${data.user.S_NO}`)
      }
      if(!data.success){
        toast.error(data.message)
      }
    } catch (error) {
        toast.error(error.message)
      return error.response?.data || { success: false, message: "Something went wrong" };
    }
  };


  const getUser = async (userId)=>{
    try {
      console.log(userId)
      const res = await axiosinstance.get(`/auth/user/${userId}`)
      console.log(res)

      if(res.data.success){
        setUser(res.data.user)
        console.log(res.data.user)
      }
      if(!res.data.success){
        toast.error(res.data.message)
      }

    } catch (error) {
      console.log(error.message)
      toast.error(error.message)
    }
  }

    const register = async (userInput,navigate) => {
      try {
        
        const res = await axiosinstance.post("/auth/register", { userInput });
  
        if (res.data.success) {
          setUser(res.data.user);
          toast.success(res.data.message)
          navigate(`/registration/new/${res.data.user.S_NO}`)
        } else {
          toast.error(res.data.message)
          throw new Error(res.data.message);
        }
      } catch (err) {
        toast.error(err.message)
        return { success: false, message: err.message };
      } finally {
        console.log(user)
      }
    };

    const AddDetails = async(addData,navigate)=>{
      try {

        console.log(addData.DOB)
        const res = await axiosinstance.put('/auth/add-data',{addData})

        if(res.data.success){
          setUser(res.data.updatedData)
          toast.success(res.data.message)
          localStorage.removeItem('personalInfoFormData');
          localStorage.removeItem('TIME_ND_CENTER');
          localStorage.removeItem('VOTE_STATE');
        navigate('/login')
        }

        if(!res.data.success){
          toast.error(res.data.message)
        }

      } catch (error) {
        console.log(error.message)
        toast.error(error.message)
      }
    }


  return (
    <AuthContext.Provider value={{ user, otpPopup, setOtpPopup,getUser,register, otp,AddDetails, setOtp, retryEnabled, generateOtp, verifyOtp, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
