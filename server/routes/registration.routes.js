import express from 'express'

const router = express.Router()

import { startRegistration,registrationresult, checkTask, getRegistrationResult } from '../controllers/registration.controller.js';

router.post('/start-registration', startRegistration);
router.get('/check-task', checkTask);
router.post('/registration-result', registrationresult);
router.get('/get-registration-result', getRegistrationResult);

export default router