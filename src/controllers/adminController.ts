import expressAsyncHandler from "express-async-handler";
import { Request, Response } from 'express';
import { CourseModel, ModuleModel, QuestionModel, SectionModel, TopicModel } from "../models/courseModel";
import { getCourse } from "./coursesController";
import mongoose from "mongoose";

export const updateCourseById = expressAsyncHandler(async (req: Request, res: Response) => {
    const { course: courseData } = req.body;
    console.log(courseData);
    // const updatedCourse = await CourseModel.findByIdAndUpdate(courseId, course, { new: true, overwrite: true });
    // res.status(200).json({ course: updatedCourse, message: 'Course updated successfully!' });

    try {

        // Create a new course document
        const course = {
            title: courseData.title,
            sections: []
        };

        // Iterate over each section in the course
        for (const sectionData of courseData.sections) {
            // Create a new section document
            const section = {
                title: sectionData.title,
                number: sectionData.number,
                modules: []
            };

            // Iterate over each module in the section
            for (const moduleData of sectionData.modules) {
                // Create a new module document
                const module = {
                    number: moduleData.number,
                    title: moduleData.title,
                    topics: []
                };

                // Iterate over each topic in the module
                for (const topicData of moduleData.topics) {
                    // Create a new topic document
                    const topic = {
                        title: topicData.title,
                        url: topicData.url,
                        questions: []
                    };

                    for (const questionData of topicData.questions) {
                        const questionId = questionData._id;
                        delete questionData._id;
                        const updatedQuestion = await QuestionModel.findByIdAndUpdate(questionId, questionData, { new: true, overwrite: true });

                        topic.questions.push(updatedQuestion._id);
                    }

                    // Save the topic and get its ObjectId
                    const updatedTopic = await TopicModel.findByIdAndUpdate(topicData._id, topic, { new: true, overwrite: true });
                    // Push the topic's ObjectId to the module's topics array
                    module.topics.push(updatedTopic._id as mongoose.Types.ObjectId);
                }

                const updatedModule = await ModuleModel.findByIdAndUpdate(moduleData._id, module, { new: true, overwrite: true });
                // Push the module's ObjectId to the section's modules array
                section.modules.push(updatedModule._id as mongoose.Types.ObjectId);
            }

            // Save the section and get its ObjectId
            const updatedSection = await SectionModel.findByIdAndUpdate(sectionData._id, section, { new: true, overwrite: true });
            // Push the section's ObjectId to the course's sections array
            course.sections.push(updatedSection._id as mongoose.Types.ObjectId);
        }

        // Save the course
        const updatedCourse = await CourseModel.findByIdAndUpdate(courseData._id, course, { new: true, overwrite: true });

        const courseFromDb = await getCourse(courseData._id);
        console.log(courseFromDb)
        res.status(201).json({ course: courseFromDb, message: 'Course updated successfully!' });
    } catch (error) {
        console.error('Error saving data:', error);
        console.log(error.message);
        res.status(500).json({ message: 'Error creating course. Please try again later.' });
    }
});

export const addNewCourse = expressAsyncHandler(async (req: Request, res: Response) => {
    const { course: courseData } = req.body;

    try {

        // Create a new course document
        const course = new CourseModel({
            title: courseData.title,
            sections: []
        });

        // Iterate over each section in the course
        for (const sectionData of courseData.sections) {
            // Create a new section document
            const section = new SectionModel({
                title: sectionData.title,
                number: sectionData.number,
                modules: []
            });

            // Iterate over each module in the section
            for (const moduleData of sectionData.modules) {
                // Create a new module document
                const module = new ModuleModel({
                    number: moduleData.number,
                    title: moduleData.title,
                    topics: []
                });

                // Iterate over each topic in the module
                for (const topicData of moduleData.topics) {
                    // Create a new topic document
                    const topic = new TopicModel({
                        title: topicData.title,
                        url: topicData.url,
                        questions: []
                    });

                    for (const questionData of topicData.questions) {
                        const question = new QuestionModel({
                            title: questionData.title,
                            url: questionData.url,
                            type: questionData.type,
                            number: questionData.number,
                        });
                        const savedQuestion = await question.save();
                        topic.questions.push(savedQuestion._id as mongoose.Types.ObjectId);
                    }

                    // Save the topic and get its ObjectId
                    const savedTopic = await topic.save();

                    // Push the topic's ObjectId to the module's topics array
                    module.topics.push(savedTopic._id as mongoose.Types.ObjectId);
                }

                // Save the module and get its ObjectId
                const savedModule = await module.save();

                // Push the module's ObjectId to the section's modules array
                section.modules.push(savedModule._id as mongoose.Types.ObjectId);
            }

            // Save the section and get its ObjectId
            const savedSection = await section.save();

            // Push the section's ObjectId to the course's sections array
            course.sections.push(savedSection._id as mongoose.Types.ObjectId);
        }

        // Save the course
        let savedCourse = await course.save();
        const courseFromDb = await getCourse(savedCourse._id as string);
        res.status(201).json({ course: courseFromDb, message: 'Course created successfully!' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Error creating course. Please try again later.' });
    }
});