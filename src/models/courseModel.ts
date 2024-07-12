import mongoose, { Document, Schema, Types } from 'mongoose';
import { ICourseModel, IModuleModel, IQuestionModel, ISectionModel, ITopicModel, QuestionTypes } from '../types';

const QuestionSchema: Schema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        maxlength: [500, 'Title cannot be more than 500 characters']
    },
    url: {
        type: String,
        required: [true, 'Url is required'],
        maxlength: [500, 'URL cannot be more than 500 characters']
    },
    number: {
        type: Number,
        required: [true, 'Number is required'],
    },
    type: {
        type: String,
        required: [true, 'Type is required'],
        enum: Object.values(QuestionTypes),
        validate: {
            validator: function (v: string) {
                return (Object.values(QuestionTypes) as string[]).includes(v);
            },
            message: (props: { value: string }) => `${props.value} is not a valid type!`
        }
    }
});

const TopicSchema: Schema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        maxlength: [500, 'Title cannot be more than 500 characters']
    },
    url: {
        type: String,
        required: [true, 'Url is required'],
        maxlength: [500, 'URL cannot be more than 500 characters']
    },
    questions: [{
        type: Types.ObjectId,
        ref: 'Question',
        required: true
    }]
});

const ModuleSchema: Schema = new Schema({
    number: {
        type: Number,
        required: [true, 'Number is required'],
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        maxlength: [500, 'Title cannot be more than 500 characters']
    },
    topics: [{
        type: Types.ObjectId,
        ref: 'Topic',
        required: [true, 'Topics is required']
    }]
});

const SectionSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: [500, 'Title cannot be more than 500 characters']
    },
    number: {
        type: Number,
        required: [true, 'Number is required'],
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
        required: [true, 'Title is required'],
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
const QuestionModel = mongoose.model<IQuestionModel>('Question', QuestionSchema);

export { CourseModel, TopicModel, ModuleModel, SectionModel, QuestionModel };