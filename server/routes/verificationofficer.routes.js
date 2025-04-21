import express from "express"
import { getOfficerDetails, getUserDetailsByVerificationOfficer, getUsersByCenterAndShift, getVerificationOfficer, getVerificationOfficersByCenter, loginVerificationOfficer, logoutVerificationOfficer, registerVerificationOfficer, updatedetailsVerificationOfficer, updateUserByVerificationOfficer, updatevdetails } from "../controllers/verification_officer.controller.js"
import { protectroute } from "../middlewares/auth.middleware.js"






const router = express.Router()

router.post('/auth/register-vofficer',registerVerificationOfficer)
router.post('/auth/login-vofficer',loginVerificationOfficer)
router.put('/auth/update-vofficer',protectroute,updatevdetails)
router.put('/auth/manager-update-officer/',protectroute,updatedetailsVerificationOfficer)
router.put('/auth/update-candidate-details',protectroute,updateUserByVerificationOfficer)
router.get('/auth/logout-vofficer',protectroute,logoutVerificationOfficer)
router.get('/auth/get-all',protectroute,getUsersByCenterAndShift)
router.get('/auth/get-VOfficerdetails',protectroute,getVerificationOfficer)
router.get('/auth/get-candidatetokendetails',protectroute,getUserDetailsByVerificationOfficer)
router.get('/auth/get-Officers/:CENTER',protectroute,getVerificationOfficersByCenter)

export default router