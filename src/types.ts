import { Document } from "mongoose";

export interface IStudentModel extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: number;
    password: string;
    address?: {
        line1: string;
        line2?: string;
        city: string;
        pincode: number;
    };
    creationTime: string;
    creationDate: string;
}

export interface ITopic {
    title: string;
    url: string;
}

export interface IModule {
    number: number;
    title: string;
    topics: ITopic[];
}

export interface ISection {
    title: string;
    number: number;
    modules: IModule[];
}

export interface ICourseModel extends Document {
    title: string;
    sections: ISection[];
}

export interface IJwtTokenModel extends Document {
    phoneNumber: string;
    token: string[];
}