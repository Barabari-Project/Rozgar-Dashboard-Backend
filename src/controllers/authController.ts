import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import expressAsyncHandler from 'express-async-handler';
import { manageUserTokens } from '../utils/token';
import { compareHash } from '../utils/compareHash';
import userModel from '../models/userModel';
import { Schema } from 'mongoose';
import jwtTokenModel from '../models/jwtTokenModel';
import { IUserModel } from '../types/types';

export const signUp = expressAsyncHandler(async (req: Request, res: Response) => {
    const { user } = req.body;
    let newUser: IUserModel | null = null;

    let exsitingUser = await userModel.findOne({
        $or: [
            { phoneNumber: user.phoneNumber },
            { email: new RegExp(`^${user.email}$`, 'i') }
        ]
    });

    if (exsitingUser) {
        throw createHttpError(409, "You already have an account. Please SignIn.")
    } else {
        newUser = new userModel({ ...user });
        newUser = await newUser.save();
        newUser = newUser.toObject();
    }

    let token = await manageUserTokens(newUser._id as Schema.Types.ObjectId);

    delete newUser._id;
    delete newUser.__v;
    delete newUser.password;
    delete newUser.creationDate;
    delete newUser.creationTime;
    res.status(200).json({
        newUser,
        token,
        message: 'Signup Successfully.'
    });
});

export const signIn = expressAsyncHandler(async (req: Request, res: Response) => {
    const { user: { phoneNumber, password } } = req.body;
    let user = null;
    user = await userModel.findOne({ phoneNumber }).select('+password');
    console.log(user);
    if (!user) {
        throw createHttpError(401, "Invalid Credentials.");
    }
    if (compareHash(password, user.password)) {
        let token = await manageUserTokens(user._id as Schema.Types.ObjectId);
        user = user.toObject();
        delete user._id;
        delete user.__v;
        delete user.password;
        res.status(200).json({
            token,
            user,
            message: 'Login Successfully.'
        });
    } else {
        throw createHttpError(401, "Invalid Credentials.");
    }
});

export const signOut = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req;

    await jwtTokenModel.findOneAndUpdate(
        { user: id },
        { token: null }
    );

    res.status(200).json({ message: 'Signout Successfully.' });

});