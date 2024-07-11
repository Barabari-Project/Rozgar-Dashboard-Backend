import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import { CourseModel } from '../models/couseModel';
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

    const course = await CourseModel
        .findById(id)
        .populate(
            {
                path: 'sections',
                populate: {
                    path: 'modules',
                    populate: {
                        path: 'topics'
                    }
                }
            }
        );

    if (!course) {
        throw createHttpError(404, 'Course not found.');
    } else {
        res.status(200).json(course);
    }
    
});

// import mongoose from 'mongoose';
// import CourseModel from '../models/courseModel'; // Adjust the import paths as per your project structure
// import { SectionModel, ModuleModel, TopicModel } from '../models/couseModel';
// import  from '../models/couseModel';
// import  from '../models/couseModel';

// async function storeData(data: any) {
//     try {
//         // Iterate over each course in the JSON data
//         for (const courseData of data) {
//             // Create a new course document
//             const course = new CourseModel({
//                 title: courseData.title,
//                 sections: []
//             });

//             // Iterate over each section in the course
//             for (const sectionData of courseData.sections) {
//                 // Create a new section document
//                 const section = new SectionModel({
//                     title: sectionData.title,
//                     number: sectionData.number,
//                     modules: []
//                 });

//                 // Iterate over each module in the section
//                 for (const moduleData of sectionData.modules) {
//                     // Create a new module document
//                     const module = new ModuleModel({
//                         number: moduleData.number,
//                         title: moduleData.title,
//                         topics: []
//                     });

//                     // Iterate over each topic in the module
//                     for (const topicData of moduleData.topics) {
//                         // Create a new topic document
//                         const topic = new TopicModel({
//                             title: topicData.title,
//                             url: topicData.url
//                         });

//                         // Save the topic and get its ObjectId
//                         const savedTopic = await topic.save();

//                         // Push the topic's ObjectId to the module's topics array
//                         module.topics.push(savedTopic._id);
//                     }

//                     // Save the module and get its ObjectId
//                     const savedModule = await module.save();

//                     // Push the module's ObjectId to the section's modules array
//                     section.modules.push(savedModule._id);
//                 }

//                 // Save the section and get its ObjectId
//                 const savedSection = await section.save();

//                 // Push the section's ObjectId to the course's sections array
//                 course.sections.push(savedSection._id);
//             }

//             // Save the course
//             let courses = await course.save();
//             console.log(courses)
//         }

//         console.log('Data saved successfully!');
//     } catch (error) {
//         console.error('Error saving data:', error);
//     }
// }

// // Example usage with your JSON data
// const jsonData = [
//     {
//         "title": "Full Stack Web Development Program",
//         "sections": [
//             {
//                 "title": "Frontend",
//                 "number": 1,
//                 "modules": [
//                     {
//                         "number": 1,
//                         "title": "Web Development Fundamentals",
//                         "topics": [
//                             {
//                                 "title": "Module Intro Call",
//                                 "url": "abc"
//                             },
//                             {
//                                 "title": "Basic Command Line",
//                                 "url": "abc"
//                             }
//                             // Add more topics as needed
//                         ]
//                     },
//                     {
//                         "number": 2,
//                         "title": "JavaScript Mastery",
//                         "topics": [
//                             {
//                                 "title": "Module Intro Call",
//                                 "url": "abc"
//                             },
//                             {
//                                 "title": "Basic Command Line",
//                                 "url": "abc"
//                             }
//                             // Add more topics as needed
//                         ]
//                     },
//                     {
//                         "number": 3,
//                         "title": "ReactJS",
//                         "topics": [
//                             {
//                                 "title": "Module Intro Call",
//                                 "url": "abc"
//                             },
//                             {
//                                 "title": "Basic Command Line",
//                                 "url": "abc"
//                             }
//                             // Add more topics as needed
//                         ]
//                     }
//                     // Add more modules as needed
//                 ]
//             },
//             {
//                 "title": "Backend",
//                 "number": 2,
//                 "modules": [
//                     {
//                         "number": 4,
//                         "title": "Web Development Fundamentals",
//                         "topics": [
//                             {
//                                 "title": "Module Intro Call",
//                                 "url": "abc"
//                             },
//                             {
//                                 "title": "Basic Command Line",
//                                 "url": "abc"
//                             }
//                             // Add more topics as needed
//                         ]
//                     },
//                     {
//                         "number": 5,
//                         "title": "JavaScript Mastery",
//                         "topics": [
//                             {
//                                 "title": "Module Intro Call",
//                                 "url": "abc"
//                             },
//                             {
//                                 "title": "Basic Command Line",
//                                 "url": "abc"
//                             }
//                             // Add more topics as needed
//                         ]
//                     },
//                     {
//                         "number": 6,
//                         "title": "ReactJS",
//                         "topics": [
//                             {
//                                 "title": "Module Intro Call",
//                                 "url": "abc"
//                             },
//                             {
//                                 "title": "Basic Command Line",
//                                 "url": "abc"
//                             }
//                             // Add more topics as needed
//                         ]
//                     }
//                     // Add more modules as needed
//                 ]
//             }
//             // Add more sections as needed
//         ]
//     }
//     // Add more courses as needed
// ]