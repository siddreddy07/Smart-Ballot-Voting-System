import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import axiosinstance from "../axiosinstance";

// 1. Create the context
const VerificationOfficerContext = createContext();

// 2. Provider component
export function VerificationOfficerProvider({ children }) {
  const [vuser, setvUser] = useState(null); // Add user state
  const [list,setlist] = useState(null)
  const [tokens, settokens] = useState(null); // Add user state
  const [userDetails, setUserDetails] = useState(null);

  // Function to register a verification officer
  const registerVerificationOfficer = async (officerData) => {
    console.log(officerData)
    try {
      const res = await axiosinstance.post("/auth/register-vofficer", {officerData});
      

      if (res.data.success) {
        setvUser(res.data.user); // Set the registered officer
        toast.success("Registration successful!");
        return true;
      } else {
        toast.error(res.data.message || "Registration failed!");
        return false;
      }
    } catch (error) {
      console.error("Error in registerVerificationOfficer:", error);
      toast.error(error.response?.data?.message || "Server error!");
      return false;
    }
  };

  const loginVerificationOfficer = async(officerData,navigate)=>{
    try {

      const res = await axiosinstance.post('/auth/login-vofficer',{officerData})

      if(res.data.success){
        setvUser(res.data.data.user)
        toast.success(res.data.message) 
        console.log(res.data.data.user.User)
        navigate('/vofficer-dashboard')
        return true     
}

else{
  toast.error(res.data.message)
  return false
}

    } catch (error) {
      toast.error(error.response?.data?.message || "Server error!")
      return false
    }
  }

  const getvOfficer = async(navigate)=>{
    
    try {
      const res = await axiosinstance.get('/auth/get-VOfficerdetails')

      if(res.data.success){
        setvUser(res.data.officer)
        console.log(res.data.officer)
        console.log(res.data.officer)
        return true
      }
      else{
        toast.error(res.data.message)
        navigate('/vofficer-login')
        return false
      }

    } catch (error) {
      console.log(error.message)
      navigate('/vofficer-login')
      return false
    }

  }

  const getUserDetails = async (targetUserId) => {
    try {
      const res = await axiosinstance.get('/auth/get-candidatetokendetails', {
        params: { targetUserId },
      });

      if (res.data.success) {
        setUserDetails(res.data.data);
        toast.success(res.data.message);
        return res.data.data;
      } else {
        toast.error(res.data.message);
        setUserDetails(null);
        return null;
      }
    } catch (error) {
      console.error('Error in getUserDetails:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch user details');
      setUserDetails(null);
      return null;
    }
  };

  const updateUserDetails = async (targetUserId, updates) => {
    try {
      const res = await axiosinstance.put('/auth/update-candidate-details', {
        targetUserId,
        ...updates,
      });
      if (res.data.success) {
        // Update local userDetails to reflect changes
        setUserDetails((prev) => ({
          ...prev,
          ...res.data.data,
        }));
        toast.success(res.data.message);
        return res.data.data;
      } else {
        toast.error(res.data.message);
        return null;
      }
    } catch (error) {
      console.error('Error in updateUserDetails:', error);
      toast.error(error.response?.data?.message || 'Failed to update user details');
      return null;
    }
  };


  const allTokens = async()=>{
    try {

      const res = await axiosinstance.get('/auth/get-all')

      if(res.data.success){
          settokens(res.data.data)
          setvUser(res.data.user)
          setlist(res.data.list)
          console.log(res.data)
          return true
      }
      else{
        toast.error(res.data.message)
        return false
      }

    } catch (error) {
      toast.error(error.message)
      return false
    }
  }

  return (
    <VerificationOfficerContext.Provider value={{ vuser, setvUser, registerVerificationOfficer,getvOfficer,allTokens,tokens,loginVerificationOfficer,getUserDetails,userDetails,updateUserDetails }}>
      {children}
    </VerificationOfficerContext.Provider>
  );
}

// 3. Hook to use the context
export const useVerificationOfficer = () => useContext(VerificationOfficerContext);
