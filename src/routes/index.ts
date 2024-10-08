import express from 'express';
import coursesRoute from './coursesRoute.js'
import authRoute from './authRoute.js';
import profileRoute from './profileRoute.js';
import submitRoute from './submissionRoute.js';
import adminRoute from './adminRoute.js';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/courses', coursesRoute);
router.use('/profile', profileRoute);
router.use('/submit', submitRoute);
router.use('/admin', adminRoute)

export default router;
