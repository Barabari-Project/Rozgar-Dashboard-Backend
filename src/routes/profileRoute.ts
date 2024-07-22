import express from 'express';
import { validateEmail, validateName, validatePhoneNumber } from '../middlewares/validationMiddleware';
import { updateProfile } from '../controllers/profileController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/update',
    authMiddleware,
    validateName,
    validateEmail,
    validatePhoneNumber,
    updateProfile
);

export default router;