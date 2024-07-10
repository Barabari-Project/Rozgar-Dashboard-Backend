import { Document, Schema } from "mongoose";

export interface IUserModel extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    address: {
        line1: string;
        line2?: string;
        city: string;
        pincode: string;
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
    user: Schema.Types.ObjectId;
    token: string;
}