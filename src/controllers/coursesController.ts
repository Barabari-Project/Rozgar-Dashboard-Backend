import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import { CourseModel } from '../models/courseModel';
import mongoose from 'mongoose';
import { ICourseModel } from '../types/types';

export const getAllCourses = expressAsyncHandler(async (req: Request, res: Response) => {
    const courses = await CourseModel.find({}, 'title');
    res.status(200).json(courses);
});

export const getCourse = async (id: string): Promise<ICourseModel> => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createHttpError(400, 'Invalid Course ID.');
    }

    return CourseModel
        .findById(id).select('-__v')
        .populate(
            {
                path: 'sections',
                populate: {
                    path: 'modules',
                    populate: {
                        path: 'topics',
                        populate: {
                            path: 'questions',
                            select: { __v: 0 }
                        },
                        select: { __v: 0 }
                    },
                    select: { __v: 0 }
                },
                select: { __v: 0 }
            }
        );
}

export const getCourseById = expressAsyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    const course = await getCourse(id);

    if (!course) {
        throw createHttpError(404, 'Course not found.');
    } else {
        res.status(200).json(course);
    }

    // const data = await storeData(jsonData);
    // console.log(data);

});

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
//                             url: topicData.url,
//                             questions: []
//                         });

//                         for (const questionData of topicData.questions) {
//                             const question = new QuestionModel({
//                                 title: questionData.title,
//                                 url: questionData.url,
//                                 type: questionData.type,
//                                 number: questionData.number,
//                             });
//                             const savedQuestion = await question.save();
//                             topic.questions.push(savedQuestion._id);
//                         }

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
//         "title": "Design Pathways",
//         "sections": [
//             {
//                 "title": "Building E-commerce Website Using Wix",
//                 "number": 1,
//                 "modules": [
//                     {
//                         "number": 1,
//                         "title": "Introduction to No-code Tools & Getting Started with Wix.",
//                         "topics": [
//                             {
//                                 "title": "What is No Code",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             {
//                                 "title": "Different Types of NoCode",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             {
//                                 "title": "The benefit of No Code",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title Question Title Question Title Question Title Question Title Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title Question Title Question Title Question Title Question Title Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     },
//                                     {
//                                         "title": "Question Title Question Title Question Title Question Title Question Title Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title Question Title Question Title Question Title Question Title Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     },
//                                     {
//                                         "title": "Question Title Question Title Question Title Question Title Question Title Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title Question Title Question Title Question Title Question Title Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     },
//                                     {
//                                         "title": "Question Title Question Title Question Title Question Title Question Title Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     },
//                                     {
//                                         "title": "Question Title Question Title Question Title Question Title Question Title Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             {
//                                 "title": "Getting Started with Wix",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": " What are the benefits of no code development over the conventional method",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": " Give examples of some popular No-code tools.",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Give some examples of types of websites which can ideally be built on a no code platform",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "https://piquant-failing-249.notion.site/Assignment-1-Requirements-and-Images-c627b5cbddcc40e0b5cd1f1c9e3abe24",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                         ]
//                     },
//                     {
//                         "number": 2,
//                         "title": "Designing a Wix website from scratch.",
//                         "topics": [
//                             {
//                                 "title": "Creating header menu and pages ",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             {
//                                 "title": "Setting site theme",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             {
//                                 "title": "Sections, Columns, and Strips",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             {
//                                 "title": "Working with gridlines",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             {
//                                 "title": "Aligning text, images, and other elements on the page",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             // Add more topics as needed
//                         ]
//                     },
//                     {
//                         "number": 3,
//                         "title": "Advanced Wix elements - Carousels, Boxes, Pop-ups and Repeaters",
//                         "topics": [
//                             {
//                                 "title": "How to add carousels",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             {
//                                 "title": "How to add information cards (TEXT+IMAGE+CTA)",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             {
//                                 "title": "Light-boxes",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             {
//                                 "title": "Repeaters / Components",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             // Add more topics as needed
//                         ]
//                     },
//                     {
//                         "number": 4,
//                         "title": "Forms & CMS",
//                         "topics": [
//                             {
//                                 "title": "Using CMS/Dynamic pages for - Notices / Blogs / News section",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             {
//                                 "title": "Design a custom form for vacancies",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             {
//                                 "title": "Publishing wix website",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             // Add more topics as needed
//                         ]
//                     },
//                     {
//                         "number": 5,
//                         "title": "Understanding the Elements of an E-commerce Website",
//                         "topics": [
//                             {
//                                 "title": "What is inventory",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             {
//                                 "title": "Adding products - Image, description, CTA, Labels, Pricing",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             {
//                                 "title": "User flow of buying a product",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             // Add more topics as needed
//                         ]
//                     }
//                     // Add more modules as needed
//                 ]
//             },
//             {
//                 "title": "Building School Website on Canva",
//                 "number": 2,
//                 "modules": [
//                     {
//                         "number": 6,
//                         "title": "interaction with information on websites",
//                         "topics": [
//                             {
//                                 "title": "Basic elements of the website",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             {
//                                 "title": "Typography",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             {
//                                 "title": "Color",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             {
//                                 "title": "Basics of Visual Hierarchy",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             }
//                             // Add more topics as needed
//                         ]
//                     },
//                     {
//                         "number": 7,
//                         "title": "Organize and group information",
//                         "topics": [
//                             {
//                                 "title": "Additional Elements in UI",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             {
//                                 "title": "Advanced Visual Hierarchy",
//                                 "url": "abc",
//                                 'questions': []
//                             }
//                             // Add more topics as needed
//                         ]
//                     },
//                     {
//                         "number": 8,
//                         "title": "Grouping of complex information and usability guidelines",
//                         "topics": [
//                             {
//                                 "title": "How to design information cards",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             {
//                                 "title": "sizing of elements",
//                                 "url": "abc",
//                                 'questions': []
//                             },
//                             {
//                                 "title": "Improving readability and usability",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             {
//                                 "title": " learning basic interactions on hover/scroll",
//                                 "url": "abc",
//                                 'questions': []
//                             }
//                             // Add more topics as needed
//                         ]
//                     },
//                     {
//                         "number": 8,
//                         "title": "Structure and link pages",
//                         "topics": [
//                             {
//                                 "title": "Designing the structure of the website",
//                                 "url": "abc",
//                                 "questions": [
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 2,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Question Title",
//                                         "url": "Abc",
//                                         "number": 3,
//                                         "type": QuestionTypes.QUESTION
//                                     },
//                                     {
//                                         "title": "Assignment Title",
//                                         "url": "Abc",
//                                         "number": 1,
//                                         "type": QuestionTypes.ASSIGNMENT
//                                     }
//                                 ]
//                             },
//                             {
//                                 "title": "sizing of elements",
//                                 "url": "abc",
//                                 'questions': []
//                             },
//                         ]
//                     },
//                     // Add more modules as needed
//                 ]
//             },
//         ]
//     }
//     // Add more courses as needed
// ]