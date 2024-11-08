import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import { CourseModel, ModuleModel, QuestionModel, SectionModel, TopicModel } from '../models/courseModel';
import mongoose from 'mongoose';
import { ICourseModel } from '../types/types';
import { QuestionTypes } from '../types/enums';

export const getAllCourses = expressAsyncHandler(async (req: Request, res: Response) => {
    const courses = await CourseModel.find({}, 'title');
    res.status(200).json(courses);
});

export const getCourse = async (id: string): Promise<ICourseModel> => {

    const data = await storeData(jsonData);
    console.log(data);

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

});

async function storeData(data: any) {
    try {
        // Iterate over each course in the JSON data
        for (const courseData of data) {
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
                            topic.questions.push(savedQuestion._id);
                        }

                        // Save the topic and get its ObjectId
                        const savedTopic = await topic.save();

                        // Push the topic's ObjectId to the module's topics array
                        module.topics.push(savedTopic._id);
                    }

                    // Save the module and get its ObjectId
                    const savedModule = await module.save();

                    // Push the module's ObjectId to the section's modules array
                    section.modules.push(savedModule._id);
                }

                // Save the section and get its ObjectId
                const savedSection = await section.save();

                // Push the section's ObjectId to the course's sections array
                course.sections.push(savedSection._id);
            }

            // Save the course
            let courses = await course.save();
            console.log(courses)
        }

        console.log('Data saved successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// // Example usage with your JSON data
const jsonData =[
    {
        "title": "Design Pathways",
        "sections": [
            {
                "title": "Building E-commerce Website Using Wix",
                "number": 1,
                "modules": [
                    {
                        "number": 1,
                        "title": "Introduction to No-code",
                        "topics": [
                            {
                                "title": "What is No Code",
                                "url": "https://victorious-bean-c06.notion.site/What-is-No-code-12b9f935f2cf8068b742f30cf35f3a36",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-12b9f935f2cf80b99df8fa3200395cd1",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Different Types of NoCode",
                                "url": "https://victorious-bean-c06.notion.site/Different-types-of-NoCode-12b9f935f2cf802f83e3e05662ad3530",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-12b9f935f2cf80b99df8fa3200395cd1",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "The benefit of No Code",
                                "url": "https://victorious-bean-c06.notion.site/Benefits-of-No-Code-12b9f935f2cf80a3bdf1d876e4fb8360",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-12b9f935f2cf80b99df8fa3200395cd1",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Getting Started with Wix",
                                "url": "https://victorious-bean-c06.notion.site/Getting-started-with-Wix-12b9f935f2cf80c2832ec5d4311dda0b",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-12b9f935f2cf80b99df8fa3200395cd1",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "number": 2,
                        "title": "Designing a Wix website from scratch.",
                        "topics": [
                            {
                                "title": "Getting started",
                                "url": "https://victorious-bean-c06.notion.site/Getting-started-12b9f935f2cf808aa3abfe6f6a9cbb5d",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-12b9f935f2cf80e184ccf39feac55b1f",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Setting site theme",
                                "url": "https://victorious-bean-c06.notion.site/Setting-site-theme-12b9f935f2cf8071ba8ce40d592fa754",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-12b9f935f2cf80e184ccf39feac55b1f",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Header,Footer & Sections",
                                "url": "https://victorious-bean-c06.notion.site/Header-Footer-Sections-12b9f935f2cf80588bb6ff75192d6dd5",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-12b9f935f2cf80e184ccf39feac55b1f",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Pages and Menus",
                                "url": "https://victorious-bean-c06.notion.site/Pages-and-Menus-12b9f935f2cf804493b6cc8da7acc6fa",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-12b9f935f2cf80e184ccf39feac55b1f",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Sections, Columns and strips",
                                "url": "https://victorious-bean-c06.notion.site/Sections-Columns-and-strips-12b9f935f2cf80d2a8f9f34ed3412989",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-12b9f935f2cf80e184ccf39feac55b1f",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "number": 3,
                        "title": "Advanced Wix elements - Carousels, Boxes, Pop-ups and Repeaters",
                        "topics": [
                            {
                                "title": "How to add carousels",
                                "url": "https://victorious-bean-c06.notion.site/How-to-add-Carousels-12b9f935f2cf8073a64bc112231f22c8",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-12b9f935f2cf8091a1f3d1fbc683df41",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Using Containers",
                                "url": "https://victorious-bean-c06.notion.site/Using-Containers-12b9f935f2cf80ba98bed9890d3c1baa",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-12b9f935f2cf8091a1f3d1fbc683df41",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "How to use Repeaters/ Components",
                                "url": "https://victorious-bean-c06.notion.site/How-to-use-Repeaters-Components-12b9f935f2cf80259b68f35c018a88ab",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-12b9f935f2cf8091a1f3d1fbc683df41",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Setting up Pop-ups",
                                "url": "https://victorious-bean-c06.notion.site/Setting-up-Pop-ups-12b9f935f2cf801fac91de8656dec507",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-12b9f935f2cf8091a1f3d1fbc683df41",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "number": 4,
                        "title": "Understanding content management and creating forms",
                        "topics": [
                            {
                                "title": "Using CMS/Dynamic pages for - Notices / Blogs / News section",
                                "url": "https://victorious-bean-c06.notion.site/Using-CMS-Dynamic-pages-for-Notices-Blogs-News-section-12b9f935f2cf80c4891bde67e195ff84",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-12b9f935f2cf8090b4d4fce065301a08",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Designing a custom form",
                                "url": "https://victorious-bean-c06.notion.site/Designing-a-custom-form-12b9f935f2cf80a99f0ad3aa505a15e0",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-12b9f935f2cf8090b4d4fce065301a08",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "title": "Building E-commerce Website Using Figma",
                "number": 1,
                "modules": [
                    {
                        "number": 1,
                        "title": "Introduction to Figma",
                        "topics": [
                            {
                                "title": "What is Figma",
                                "url": "https://victorious-bean-c06.notion.site/What-is-Figma-1359f935f2cf804ea50fcdd7fc9943c7",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf803d9858f9ca2d3bc5a9",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Working in Figma Design",
                                "url": "https://victorious-bean-c06.notion.site/Working-in-Figma-Design-1359f935f2cf807cb65bdbb4f7641104",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf803d9858f9ca2d3bc5a9",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "What are the benefits of using Figma",
                                "url": "https://victorious-bean-c06.notion.site/What-are-the-benefits-of-using-Figma-1359f935f2cf80fbaf94e7cca5bd4f22",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf803d9858f9ca2d3bc5a9",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Getting started with Figma",
                                "url": "https://victorious-bean-c06.notion.site/Getting-started-with-Figma-1359f935f2cf8052b58fe8822116e859",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf803d9858f9ca2d3bc5a9",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "number": 2,
                        "title": "Basic Figma Elements",
                        "topics": [
                            {
                                "title": "Using Basic Tools & Exploring Figma",
                                "url": "https://victorious-bean-c06.notion.site/Using-Basic-Tools-Exploring-Figma-1359f935f2cf8006a0f1d6b8d2fdbc64",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf807aabdad3f1c2edabeb",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Design Tools",
                                "url": "https://victorious-bean-c06.notion.site/Design-Tools-1359f935f2cf80ed917df4bba3b06cc1",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf807aabdad3f1c2edabeb",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Pages & Layers",
                                "url": "https://victorious-bean-c06.notion.site/Pages-Layers-1359f935f2cf80288e64c45fc78959f9",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf807aabdad3f1c2edabeb",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Collaboration Features",
                                "url": "https://victorious-bean-c06.notion.site/Collaboration-Features-1359f935f2cf802e9bf1e1b23ec2e2d0",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf807aabdad3f1c2edabeb",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "number": 3,
                        "title": "Basic Elements of a Website",
                        "topics": [
                            {
                                "title": "Buttons",
                                "url": "https://victorious-bean-c06.notion.site/Buttons-1359f935f2cf80a49c99f129e23f7d6c",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf80fa91fdfa44d47b809b",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Text Box",
                                "url": "https://victorious-bean-c06.notion.site/Text-Box-1359f935f2cf806aaa0ee03e8b59fb70",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf80fa91fdfa44d47b809b",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Dropdown Menu",
                                "url": "https://victorious-bean-c06.notion.site/Dropdown-Menu-1359f935f2cf80d79814c1ec30cec748",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf80fa91fdfa44d47b809b",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Navigation Bar",
                                "url": "https://victorious-bean-c06.notion.site/Navigation-Bar-1359f935f2cf809db713eddf93820684",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf80fa91fdfa44d47b809b",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "number": 4,
                        "title": "Colours and Visual Design",
                        "topics": [
                            {
                                "title": "Introduction to Colour Theory",
                                "url": "https://victorious-bean-c06.notion.site/Introduction-to-Colour-Theory-1359f935f2cf801da534d602ea370eca",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf807ca67cf9cdf6f97e6f",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Applying Colours in Figma",
                                "url": "https://victorious-bean-c06.notion.site/Applying-Colours-in-Figma-1359f935f2cf80fe83a2e8cf11815a7a",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf807ca67cf9cdf6f97e6f",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "CRAP Principles in Visual Design",
                                "url": "https://victorious-bean-c06.notion.site/CRAP-Principles-in-Visual-Design-1359f935f2cf80b3b8b9c667103c3836",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf807ca67cf9cdf6f97e6f",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Case Studies and Examples",
                                "url": "https://victorious-bean-c06.notion.site/Case-Studies-and-Examples-1359f935f2cf807b87d6fc01f929234f",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf807ca67cf9cdf6f97e6f",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "number": 5,
                        "title": "Organising Information (1)",
                        "topics": [
                            {
                                "title": "Grid of Information",
                                "url": "https://victorious-bean-c06.notion.site/Grid-of-Information-1359f935f2cf8013b2edd6d19022db4b",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf807c9147d8e2ed01dc5b",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Cards",
                                "url": "https://victorious-bean-c06.notion.site/Cards-1359f935f2cf802eae8fda1da9f09d08",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf807c9147d8e2ed01dc5b",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Carousels",
                                "url": "https://victorious-bean-c06.notion.site/Carousels-1359f935f2cf80548424ef554d1ec62b",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf807c9147d8e2ed01dc5b",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Filters",
                                "url": "https://victorious-bean-c06.notion.site/Filters-1359f935f2cf80aaa493f25817c95a6a",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf807c9147d8e2ed01dc5b",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Accordions",
                                "url": "https://victorious-bean-c06.notion.site/Accordions-1359f935f2cf805680f9c0792a10f512",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf807c9147d8e2ed01dc5b",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Search Bar",
                                "url": "https://victorious-bean-c06.notion.site/Search-Bar-1359f935f2cf8035a83aeefc2c0d948f",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf807c9147d8e2ed01dc5b",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Advanced Visual Hierarchy",
                                "url": "https://victorious-bean-c06.notion.site/Advanced-Visual-Hierarchy-1359f935f2cf8089b30bd65b07e90cf9",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf807c9147d8e2ed01dc5b",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "number": 6,
                        "title": "Complex Information and Usability (1)",
                        "topics": [
                            {
                                "title": "Designing for Information Cards",
                                "url": "https://victorious-bean-c06.notion.site/Designing-for-Information-Cards-1359f935f2cf80ae978fd7c1c1882239",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf80669146f0fa740b71e1",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Best Practices",
                                "url": "https://victorious-bean-c06.notion.site/Best-Practices-1359f935f2cf8034b8caf2723f3148d3",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf80669146f0fa740b71e1",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "UX Laws",
                                "url": "https://victorious-bean-c06.notion.site/UX-Laws-1359f935f2cf8048a517d5e038544749",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf80669146f0fa740b71e1",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Improving Readability & Usability",
                                "url": "https://victorious-bean-c06.notion.site/Improving-Readability-Usability-1359f935f2cf80b6b693ef97e77b3493",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf80669146f0fa740b71e1",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "number": 7,
                        "title": "Information Architecture & Navigation",
                        "topics": [
                            {
                                "title": "Introduction to Information Architecture",
                                "url": "https://victorious-bean-c06.notion.site/Introduction-to-Information-Architecture-1359f935f2cf80b6b9b7dfe26fea9155",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf8087900bd41de66146a9",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Structuring a website in Figma",
                                "url": "https://victorious-bean-c06.notion.site/Structuring-a-website-in-Figma-1359f935f2cf80b99335ce24fa595045",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf8087900bd41de66146a9",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Designing website navigation",
                                "url": "https://victorious-bean-c06.notion.site/Designing-website-navigation-1359f935f2cf8084873ac4eee7966b86",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf8087900bd41de66146a9",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Mobile Navigation Design",
                                "url": "https://victorious-bean-c06.notion.site/Mobile-Navigation-Design-1359f935f2cf80509165fba94ea293b8",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf8087900bd41de66146a9",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "number": 8,
                        "title": "Prototyping and Interactions",
                        "topics": [
                            {
                                "title": "Introduction to Prototyping",
                                "url": "https://victorious-bean-c06.notion.site/Introduction-to-Prototyping-1359f935f2cf8073be1eed9cbf4cc3df",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf80ac8250c3424afb8d32",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Creating Interactive Prototypes in Figma",
                                "url": "https://victorious-bean-c06.notion.site/Creating-Interactive-Prototypes-in-Figma-1359f935f2cf805a9bc0d2e44c30b20c",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf80ac8250c3424afb8d32",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Designing User Flows",
                                "url": "https://victorious-bean-c06.notion.site/Designing-User-Flows-1359f935f2cf800690c4c911bb1fb998",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf80ac8250c3424afb8d32",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Adding Interactions and Animations",
                                "url": "https://victorious-bean-c06.notion.site/Adding-Interactions-and-Animations-1359f935f2cf806bac1ac7e343a42154",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf80ac8250c3424afb8d32",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Testing & Gathering Feedback",
                                "url": "https://victorious-bean-c06.notion.site/Testing-Gathering-Feedback-1359f935f2cf800f923ff811afc84ef2",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf80ac8250c3424afb8d32",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "number": 9,
                        "title": "Collaboration & Feedback",
                        "topics": [
                            {
                                "title": "Collaboration in Figma",
                                "url": "https://victorious-bean-c06.notion.site/Collaboration-in-Figma-1359f935f2cf8036b924eb6072ec2c16",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf8052a063e9924bf2cb14",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            },
                            {
                                "title": "Developer Handoff",
                                "url": "https://victorious-bean-c06.notion.site/Developer-Handoff-1359f935f2cf80c1a851c25a13621ef5",
                                "questions": [
                                    {
                                        "title": "Assignment",
                                        "url": "https://victorious-bean-c06.notion.site/Assignment-1359f935f2cf8052a063e9924bf2cb14",
                                        "number": 1,
                                        "type": QuestionTypes.ASSIGNMENT
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
]


