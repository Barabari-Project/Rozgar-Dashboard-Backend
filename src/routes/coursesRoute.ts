import express from 'express';
import { getAllCourses, getCourseById } from '../controllers/coursesController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/',
    authMiddleware,
    getAllCourses
);

router.get('/:id',
    authMiddleware,
    getCourseById
);

export default router;