import express from 'express';
import { auth, signIn, signOut, signUp } from '../controllers/authController.js';
import { phoneNumberRequired, validateEmail, validateName, validatePassword, validatePhoneNumber } from '../middlewares/validationMiddleware.js';
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

router.get('/',
    authMiddleware,
    auth
)

router.post('/sign-in',
    phoneNumberRequired,
    validatePhoneNumber,
    validatePassword,
    signIn
);

router.get('/sign-out',
    authMiddleware,
    signOut
);

export default router;