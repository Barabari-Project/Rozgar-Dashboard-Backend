import mongoose, { Document, Schema } from 'mongoose';
import { ICourseModel } from '../types';

const TopicSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

const ModuleSchema: Schema = new Schema({
    number: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    topics: {
        type: [TopicSchema],
        required: true
    }
});

const SectionSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    modules: {
        type: [ModuleSchema],
        required: true
    }
});

const CourseSchema: Schema<ICourseModel> = new Schema({
    title: {
        type: String,
        required: true
    },
    sections: {
        type: [SectionSchema],
        required: true
    }
});

const CourseModel = mongoose.model<ICourseModel>('Course', CourseSchema);

export default CourseModel;
