import express from 'express'
const router = express.Router();


import { startAuthentication, checkTask, authenticationresult, getAuthenticationResult } from '../controllers/authentication.controller.js';

router.post('/start-authentication', startAuthentication);
router.get('/check-task', checkTask);
router.post('/authentication-result', authenticationresult);
router.get('/get-authentication-result', getAuthenticationResult);

export default router