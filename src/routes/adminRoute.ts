import express from 'express';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware';
import { addNewCourse, updateCourseById } from '../controllers/adminController';

const router = express.Router();

router.put('/update-course',
    adminAuthMiddleware,
    updateCourseById
);

router.post('/add-course',
    adminAuthMiddleware,
    addNewCourse
);

export default router;