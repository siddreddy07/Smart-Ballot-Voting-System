import express from 'express'
import { boothOfficerDetaisl, getCandidatesForVoter, getVotersAtBooth, loginBoothOfficer, loginBoothOfficerWithBoothID, logoutBoothOfficer, registerBoothOfficer, verifyVoter } from '../controllers/boothofficer.controller.js';
import { protectroute } from '../middlewares/auth.middleware.js';



const router = express.Router();

router.post("/auth/booth-officer/register", registerBoothOfficer);
router.post("/auth/booth-officer/login", loginBoothOfficer);
router.post("/auth/booth-officer/login-with-id", loginBoothOfficerWithBoothID);
router.get("/auth/booth-officer/logout", protectroute ,logoutBoothOfficer);
router.get("/auth/booth-officer-dashboard",protectroute ,boothOfficerDetaisl);
router.get("/auth/booth-officer/get-candidates",protectroute,getCandidatesForVoter);
router.get("/auth/booth-officer/getallvoters",protectroute,getVotersAtBooth);
router.post("/auth/booth-officer/verify-voter",verifyVoter);


export default router;