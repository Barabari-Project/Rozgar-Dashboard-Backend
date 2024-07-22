import { Document, Schema, Types } from "mongoose";

import { Gender,QuestionTypes } from './enums';

export interface IUserModel extends Document{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    gender: Gender;
    region?: string;
    university?: string;
    degree?: string;
    organization?: string;
    createdAt: Date;
    updatedAt: Date;
    createdAtIST: string; // Virtual field
    updatedAtIST: string; // Virtual field
}

export interface ITopicModel {
    title: string;
    url: string;
    questions: Types.ObjectId[];
}

export interface IModuleModel extends Document {
    number: number;
    title: string;
    topics: Types.ObjectId[];
}

export interface ISectionModel extends Document {
    title: string;
    number: number;
    modules: Types.ObjectId[];
}

export interface ICourseModel extends Document {
    title: string;
    sections: Types.ObjectId[];
}

export interface IJwtTokenModel extends Document {
    user: Schema.Types.ObjectId;
    token: string;
}

export interface ISubmission {
    link: string;
    user: Types.ObjectId;
}

export interface IQuestionModel extends Document {
    title: string;
    url: string;
    type: QuestionTypes;
}