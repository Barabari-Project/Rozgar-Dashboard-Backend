import express from 'express';
import { signIn, signOut, signUp } from '../controllers/authController.js';
import { validateEmail, validateName, validatePassword, validatePhoneNumber } from '../middlewares/validationMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/sign-up',
    validateName,
    validateEmail,
    validatePhoneNumber,
    validatePassword,
    // we are not adding validation for optional fields for now. ( expected to be handled at frontend side.)
    signUp
);

router.post('/sign-in',
    validateEmail,
    validatePassword,
    signIn
);

router.get('/sign-out',
    authMiddleware,
    signOut
);

export default router;