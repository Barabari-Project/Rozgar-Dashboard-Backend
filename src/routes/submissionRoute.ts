import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getAllQuestions, submitQuestion, submitTopic } from '../controllers/submissionController.js';

const router = express.Router();

router.post('/question',
    authMiddleware,
    submitQuestion
);

router.post('/topic',
    authMiddleware,
    submitTopic
);

router.get('/question',
    authMiddleware,
    getAllQuestions
)

export default router;