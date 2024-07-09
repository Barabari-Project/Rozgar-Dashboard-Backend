import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import CourseModel from '../models/couseModel';
import mongoose from 'mongoose';

export const getAllCourses = expressAsyncHandler(async (req: Request, res: Response) => {
    const courses = await CourseModel.find({}, 'title');
    res.status(200).json(courses);
});

export const getCourseById = expressAsyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createHttpError(400, 'Invalid Course ID.');
    }

    const course = await CourseModel.findById(id);

    if (!course) {
        throw createHttpError(404, 'Course not found.');
    } else {
        res.status(200).json(course);
    }

});