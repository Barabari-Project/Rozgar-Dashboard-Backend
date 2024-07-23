import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import expressAsyncHandler from 'express-async-handler';
import userModel from '../models/userModel';
import { QuestionModel, TopicModel } from '../models/courseModel';

export const submitQuestion = expressAsyncHandler(async (req: Request, res: Response) => {
    const { questionId, link } = req.body;
    const userId = req.id;

    const user = await userModel.findOneAndUpdate(
        { _id: userId, 'submissions.question': questionId }, // what if question is not there ( try by yourself)
        { $set: { 'submissions.$.link': link } },
        { new: true }
    );

    if (!user) {
        const question = await QuestionModel.findById(questionId);
        if (!question) {
            throw createHttpError(404, "Question not found");
        }
        await userModel.findByIdAndUpdate(
            userId,
            { $push: { submissions: { question: questionId, link } } },
            { new: true }
        );
    }

    res.status(200).json({ message: 'Link is submited successfully!' });
});

export const submitTopic = expressAsyncHandler(async (req: Request, res: Response) => {
    const { topicId } = req.body;
    const userId = req.id;

    const userWithUpdatedTopic = await userModel.findOneAndUpdate(
        { _id: userId, topics: topicId },
        {},
        { new: true }
    );

    if (!userWithUpdatedTopic) {
        const topic = await TopicModel.findById(topicId);
        if (!topic) {
            throw createHttpError(404, "Topic not found");
        }
        await userModel.findByIdAndUpdate(
            userId,
            { $addToSet: { topics: topicId } },
            { new: true }
        );
    }

    res.status(200).json({ message: 'Topic is marked as completed!' });
});

export const getAllQuestions = expressAsyncHandler(async (req: Request, res: Response) => {
    const userId = req.id;
    const user = await userModel.findById(userId).populate('submissions.question');

    if (!user) {
        throw createHttpError(404, "User not found");
    }

    res.status(200).json({ submission: user.submissions });
});