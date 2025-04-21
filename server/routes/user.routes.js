import express from 'express'
import { AddDetails, continueRegistration, generateOtp, getUserById, login, register, verifyOtp } from '../controllers/user.controller.js';
import { protectroute } from '../middlewares/auth.middleware.js';

const router = express.Router()

router.post('/auth/register',register)
router.get('/auth/continue-register/:id',protectroute,continueRegistration)
router.post('/auth/generateOtp',generateOtp)
router.post('/auth/verifyotp',verifyOtp)
router.post('/auth/login',login)
router.get('/auth/user/:id',protectroute,getUserById)
router.put('/auth/add-data',protectroute,AddDetails)

export default router;