import express from 'express';
import { getAllQuestionsByTopic, getQuestionById } from '../controllers/questionController';

const router = express.Router();

router.get('/:topicId',
    getAllQuestionsByTopic
);

router.get('/:id',
    getQuestionById
);

export default router;