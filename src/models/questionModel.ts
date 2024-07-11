import mongoose, { Document, Schema, Types } from 'mongoose';
import { IQuestionModel } from '../types';

// Define the Submission Schema
const SubmissionSchema: Schema = new Schema({
    link: {
        type: String,
        required: true,
        maxlength: 500
    },
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// Define the Question Schema
const QuestionSchema: Schema = new Schema({
    topic: {
        type: Types.ObjectId,
        ref: 'Topic',
        required: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 500
    },
    desc: {
        type: String,
        required: true,
        maxlength: 5000
    },
    submission: {
        type: [SubmissionSchema],
        required: true
    }
});

const QuestionModel = mongoose.model<IQuestionModel>('Question', QuestionSchema);

export default QuestionModel;