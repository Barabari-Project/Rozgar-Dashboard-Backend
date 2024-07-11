import mongoose, { Document, Schema, Types } from 'mongoose';
import { ICourseModel, IModuleModel, ISectionModel, ITopicModel } from '../types';

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
    topics: [{
        type: Types.ObjectId,
        ref: 'Topic',
        required: true
    }]
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
    modules: [{
        type: Types.ObjectId,
        ref: 'Module',
        required: true
    }]
});

const CourseSchema: Schema<ICourseModel> = new Schema({
    title: {
        type: String,
        required: true
    },
    sections: [{
        type: Types.ObjectId,
        ref: 'Section',
        required: true
    }]
});

const CourseModel = mongoose.model<ICourseModel>('Course', CourseSchema);
const TopicModel = mongoose.model<ITopicModel>('Topic', TopicSchema);
const ModuleModel = mongoose.model<IModuleModel>('Module', ModuleSchema);
const SectionModel = mongoose.model<ISectionModel>('Section', SectionSchema);



export { CourseModel, TopicModel, ModuleModel, SectionModel };
