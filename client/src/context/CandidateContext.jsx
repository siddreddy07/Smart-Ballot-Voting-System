import { createContext, useContext, useState } from "react";
import axiosinstance from "../axiosinstance";
import toast from "react-hot-toast";




const CandidateContext = createContext()


export function CandidateContextProvider({children}){

    const [candidate,setcandidate] = useState(null)


    //Function to Register Candidate

    const registerCandidate = async(candidatePayload)=>{

        console.log(candidatePayload)

        try {
            const res = await axiosinstance.post('/auth/candidate-register',candidatePayload)
    
            if(res.data.success){
                setcandidate(res.data.candidate)
                toast.success('Candidate Registered Succssfully')
            }
            else{
                toast.error(res.data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }


    return (
        <CandidateContext.Provider value={{registerCandidate,candidate}}>
            {children}
        </CandidateContext.Provider>
    )


}


export const useCandidate = ()=> useContext(CandidateContext)