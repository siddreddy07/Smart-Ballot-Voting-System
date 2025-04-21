import express from 'express'
import { loginCandidate, registerCandidate, updateCandidate } from "../controllers/candidates.controller.js"
import { protectroute } from '../middlewares/auth.middleware.js'





const router = express.Router()


router.post("/auth/candidate-register",registerCandidate)
router.post("/auth/candidate-login",loginCandidate)
router.put("/auth/candidate-details-update/:candidateId",protectroute,updateCandidate)

export default router