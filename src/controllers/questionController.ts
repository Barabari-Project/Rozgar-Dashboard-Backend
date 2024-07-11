import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import QuestionModel from '../models/questionModel';

export const getAllQuestionsByTopic = expressAsyncHandler(async (req: Request, res: Response) => {
    const topicId = req.params.topicId;

    if (!mongoose.Types.ObjectId.isValid(topicId)) {
        throw createHttpError(400, 'Invalid Topic ID.');
    }
    await addQuestionsToTopics();
    const questions = await QuestionModel.find({ topic: topicId })
        .select('-submission') // Exclude submission details
        .exec();

    if (!questions) {
        throw createHttpError(404, 'Topic with provided ID Not Found.');
    } else {
        res.status(200).json(questions);
    }

});

export const getQuestionById = expressAsyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createHttpError(400, 'Invalid Question ID.');
    }
    const question = await QuestionModel.findById(id)
        .exec();

    if (!question) {
        throw createHttpError(404, 'Question with provided ID Not Found.');
    } else {
        res.status(200).json(question);
    }
});

import { TopicModel } from '../models/couseModel';

async function getAllTopics() {
    try {
        const topics = await TopicModel.find().exec();
        return topics;
    } catch (error) {
        throw new Error(`Error fetching topics: ${error.message}`);
    }
}

async function addQuestionsToTopics() {
    try {
        // Fetch all topics
        const topics = await getAllTopics();

        // Loop through each topic
        for (const topic of topics) {
            // Add two questions to the current topic
            const question1 = await QuestionModel.create({
                topic: topic._id,
                title: 'Question 1 Title',
                desc: 'Question 1 Description',
                submission: []
            });

            const question2 = await QuestionModel.create({
                topic: topic._id,
                title: 'Question 2 Title',
                desc: 'Question 2 Description',
                submission: []
            });

            // Assuming you want to log the created questions for each topic
            console.log(`Added questions to topic '${topic.title}':`, question1, question2);
        }

        console.log('Questions added to all topics successfully.');
    } catch (error) {
        console.error('Error:', error.message);
    }
}