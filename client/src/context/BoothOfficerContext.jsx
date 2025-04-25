import { createContext, useContext, useState } from "react";
import axiosinstance from "../axiosinstance";
import toast from "react-hot-toast";

const BoothOfficerContext = createContext();

export function BoothOfficerProvider({ children }) {
  const [bofficer, setbofficer] = useState(null);
  const [votersAtBooth, setVotersAtBooth] = useState([]);

  const [loginPurpose, setLoginPurpose] = useState(null); // new

  const registerBoothOfficer = async (navigate, form) => {
    try {
      const res = await axiosinstance.post('/auth/booth-officer/register', { form });

      if (res.data.success) {
        setbofficer(res.data.bofficer);
        toast.success(res.data.message);
        navigate('/login');
        return true;
      } else {
        toast.error(res.data.message);
        return false;
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Internal Server Error');
      return false;
    }
  };



  const loginWithPurpose = async (email, password, purpose, navigate) => {
    if (!bofficer) {
      toast.error("Booth officer details not loaded");
      return false;
    }
  
    const {
      STATE_ID,
      DISTRICT_ID,
      BOOTH_ID,
      ASSEMBLY_CONSTITUENCY_ID,
      PARLIAMENTARY_CONSTITUENCY_ID,
    } = bofficer;
  
    try {
      const res = await axiosinstance.post(
        `/auth/booth-officer/login-with-id?STATE_ID=${STATE_ID}&DISTRICT_ID=${DISTRICT_ID}&BOOTH_ID=${BOOTH_ID}&loginPurpose=${purpose}`,
        { email, password }
      );
  
      const message = res?.data?.message || "Login successful";
  
      if (res.data.success) {
        setLoginPurpose(purpose);
        toast.success(message);
  
        // 👉 Fetch voters only if purpose is verification
        if (purpose === "verification") {
          try {
            const voterRes = await axiosinstance.get(`/auth/booth-officer/getallvoters`, {
              params: {
                STATE_ID,
                DISTRICT_ID,
                BOOTH_ID,
                ASSEMBLY_ID: ASSEMBLY_CONSTITUENCY_ID,
                PARLIAMENTARY_ID: PARLIAMENTARY_CONSTITUENCY_ID,
              },
            });
  
            if (voterRes.data.success) {
              setVotersAtBooth(voterRes.data.voters || []);
              toast.success("Voters loaded successfully");
            } else {
              toast.error(voterRes.data.message || "Failed to load voters");
            }
          } catch (voterErr) {
            toast.error("Error fetching voters");
          }
        }
  
        // 👉 Navigate based on purpose
        switch (purpose) {
          case "verification":
            navigate("/booth-officer/voter-verification");
            break;
          case "voting":
            navigate("/booth-officer/VotingPhase");
            break;
          default:
            navigate("/boothofficer-dashboard");
        }
  
        return true;
      } else {
        toast.error(res.data.message);
        return false;
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
      return false;
    }
  };
  
  
  
  const getAllVotersAtBooth = async () => {
    let storedOfficer = bofficer;
  
    // Try fetching from localStorage if not available in state
    if (!storedOfficer) {
      const stored = localStorage.getItem("boothOfficer");
      if (stored) {
        storedOfficer = JSON.parse(stored);
      } else {
        toast.error("Booth officer info not available");
        return [];
      }
    }
  
    const {
      STATE_ID,
      DISTRICT_ID,
      BOOTH_ID,
      ASSEMBLY_CONSTITUENCY_ID,
      PARLIAMENTARY_CONSTITUENCY_ID,
    } = storedOfficer;
  
    try {
      const res = await axiosinstance.get(`/auth/booth-officer/getallvoters`, {
              params: {
                STATE_ID,
                DISTRICT_ID,
                BOOTH_ID,
                ASSEMBLY_ID: ASSEMBLY_CONSTITUENCY_ID,
                PARLIAMENTARY_ID: PARLIAMENTARY_CONSTITUENCY_ID,
              },
      });
  
      if (res.data.success) {
        toast.success("Fetched voters successfully");
        setVotersAtBooth(res.data.voters)
        return true;
      } else {
        toast.error(res.data.message || "Failed to fetch voters");
        return false
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error while fetching voters");
      return false
    }
  };


  const submitVote = async ({ MLA_CANDIDATE_ID, MP_CANDIDATE_ID }) => {
    try {
      // ✅ Get booth officer only from localStorage
      const stored = localStorage.getItem("boothOfficer");
      if (!stored) {
        toast.error("Booth officer info missing");
        return false;
      }
  
      const officer = JSON.parse(stored);
      const {
        STATE_ID,
        DISTRICT_ID,
        BOOTH_ID,
        ASSEMBLY_CONSTITUENCY_ID,
        PARLIAMENTARY_CONSTITUENCY_ID,
        boothOfficerToken,
      } = officer;
  
      const res = await axiosinstance.post(
        "/auth/vote",
        {
          MLA_CANDIDATE_ID,
          MP_CANDIDATE_ID,
        },
        {
          params: {
            STATE_ID,
            DISTRICT_ID,
            BOOTH_ID,
            ASSEMBLY_ID: ASSEMBLY_CONSTITUENCY_ID,
            PARLIAMENTARY_ID: PARLIAMENTARY_CONSTITUENCY_ID,
          },
          headers: {
            Authorization: `Bearer ${boothOfficerToken || ""}`,
          },
        }
      );
  
      if (res.data.success) {
        toast.success("Vote registered successfully");
        return true;
      } else {
        toast.error(res.data.message || "Vote submission failed");
        return false;
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Server error while submitting vote");
      return false;
    }
  };
  
  
  


const loginBoothOfficer = async (ID, PASSWORD, navigate) => {
  try {
    const res = await axiosinstance.post('/auth/booth-officer/login', { ID, PASSWORD });

    if (res.data.success) {
      setbofficer(res.data.bofficer);

      // Store booth officer in local storage
      localStorage.setItem('boothOfficer', JSON.stringify(res.data.bofficer));

      toast.success(res.data.message);
      navigate('/boothofficer-dashboard');
      return true;
    } else {
      toast.error(res.data.message || 'Login failed');
      return false;
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Login Error');
    return false;
  }
};

const getCandidatesForVoter = async (voterRFID) => {
  try {
    let storedOfficer = bofficer;

    // Load from localStorage if state is empty
    if (!storedOfficer) {
      const stored = localStorage.getItem("boothOfficer");
      if (stored) {
        storedOfficer = JSON.parse(stored);
      } else {
        toast.error("Booth officer info not available");
        return null;
      }
    }

    const {
      BOOTH_ID,
      STATE_ID,
      DISTRICT_ID,
      ASSEMBLY_CONSTITUENCY_ID,
      PARLIAMENTARY_CONSTITUENCY_ID,
    } = storedOfficer;

    const res = await axiosinstance.get("/auth/booth-officer/get-candidates", {
      params: {
        BOOTH_OFFICER_ID: BOOTH_ID,
        STATE_ID,
        DISTRICT_ID,
        ASSEMBLY_ID: ASSEMBLY_CONSTITUENCY_ID,
        PARLIAMENTARY_ID: PARLIAMENTARY_CONSTITUENCY_ID,
      },
      headers: {
        Authorization: `Bearer ${storedOfficer?.boothOfficerToken || ""}`,
      },
    });

    if (res.status === 200 && res.data) {
      toast.success("Fetched candidates successfully");
      return res.data;
    } else {
      toast.error(res.data.message || "Unable to fetch candidates");
      return null;
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Error fetching candidates");
    return null;
  }
};


const verifyVoterIdentity = async ({ S_NO, RFID_NO, FINGERPRINT }) => {
  try {
    const stored = localStorage.getItem("boothOfficer");
    if (!stored) {
      toast.error("Booth officer info missing");
      return { success: false };
    }

    const { BOOTH_ID } = JSON.parse(stored);

    const res = await axiosinstance.post("/auth/verifyVoter", {
      S_NO,
      RFID_NO,
      FINGERPRINT,
      BOOTH_ID,
    });

    if (res.status === 200) {
      toast.success(res.data.message);
      return { success: true, message: res.data.message };
    } else {
      toast.error(res.data.message || "Verification failed");
      return { success: false };
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Error verifying voter");
    return { success: false };
  }
};



  const boothofficerdetails = async (navigate) => {
    try {
      const res = await axiosinstance.get('/auth/booth-officer-dashboard');
      if (res.data.success) {
        setbofficer(res.data.bofficer);
        if (navigate) navigate('/boothofficer-dashboard');
        return res.data.bofficer;
      } else {
        toast.error(res.data.message || 'Unable to fetch officer details');
        navigate('/booth-officer/login')
        return null;
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Internal Server Error while fetching officer');
      navigate('/booth-officer/login')
      return null;
    }
  };

  return (
    <BoothOfficerContext.Provider
      value={{
        bofficer,
        setbofficer,
        registerBoothOfficer,
        boothofficerdetails,
        loginBoothOfficer,
        loginWithPurpose,
        loginPurpose,
        setLoginPurpose,
        getAllVotersAtBooth,
        votersAtBooth, // <-- add this
        setVotersAtBooth,
        getCandidatesForVoter,
        submitVote,
        verifyVoterIdentity
      }}
    >
      {children}
    </BoothOfficerContext.Provider>
  );
}

export const useBoothOfficer = () => useContext(BoothOfficerContext);
