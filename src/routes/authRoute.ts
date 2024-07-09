import express from 'express';
import { signIn, signUp } from '../controllers/authController.js';
import { validateAddress, validateEmail, validateName, validatePassword, validatePhoneNumber } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.post('/sign-up',
    validateName,
    validateEmail,
    validatePhoneNumber,
    validatePassword,
    validateAddress,
    signUp
);

router.post('/sign-in',
    validateEmail,
    validatePassword,
    signIn
);

export default router;