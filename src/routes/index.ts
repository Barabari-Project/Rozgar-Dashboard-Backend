import express from 'express';
import coursesRoute from './coursesRoute.js'
import authRoute from './authRoute.js';

const router = express.Router();

router.use('/auth',authRoute);
router.use('/courses', coursesRoute);

export default router;
