import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import expressAsyncHandler from 'express-async-handler';
import { manageUserTokens } from '../utils/token';
import { compareHash } from '../utils/compareHash';
import userModel from '../models/userModel';
import { Schema } from 'mongoose';

export const signUp = expressAsyncHandler(async (req: Request, res: Response) => {
    const { phoneNumber, firstName, lastName, email, password, address } = req.body;

    let user = await userModel.findOne({ phoneNumber });

    if (user) {
        throw createHttpError(409, "You already have an account. Please SignIn.")
    } else {
        user = new userModel({ phoneNumber, firstName, lastName, email, password, address });
        user = await user.save();
        user = user.toObject();
    }

    let token = await manageUserTokens(user._id as Schema.Types.ObjectId);

    delete user._id;
    delete user.__v;
    res.status(200).json({
        user,
        token,
        message: 'Signup Successfully.'
    });
});

export const signIn = expressAsyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    let user = null;
    user = await userModel.findOne({ email }).select('+password');
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