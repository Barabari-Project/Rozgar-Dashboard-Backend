import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import userModel from '../models/userModel';
import createHttpError from 'http-errors';

export const updateProfile = expressAsyncHandler(async (req: Request, res: Response) => {
    const userId = req.id; // Assuming req.id contains the user ID
    const updatedUserData = req.body.user;

    if( updatedUserData.password ){
        throw createHttpError(400,"You cannot update your password");
    }

    // Find the user by ID and update with new data
    const updatedUser = await userModel.findOneAndUpdate(
        { _id: userId },
        updatedUserData,
        { new: true, runValidators: true } // Options: return the updated document, run schema validators
    );

    if (!updatedUser) {
        throw createHttpError(404, 'User not found');
    }

    res.status(200).json(updatedUser);

});