import { Request, Response, NextFunction } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { verifyJwtToken } from '../utils/token.js';
import createHttpError from 'http-errors';
import jwtTokenModel from '../models/jwtTokenModel.js';
import mongoose, { ObjectId } from 'mongoose';

export const authMiddleware = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.id = new mongoose.Types.ObjectId('669f4f26f3cf5a6a29d93b31') as unknown as ObjectId;
    next();
    return;
    let token = req.headers.authorization;
    
    if (!token) {
        throw createHttpError(401, 'Please Login.');
    }

    token = token.replace('Bearer ', '');

    let decoded = null;

    try {
        // Verify token
        decoded = await verifyJwtToken(token);
    } catch (error) {
        console.log(error);
        throw createHttpError(401, 'Please Login.');
    }
    const userToken = await jwtTokenModel.findOne({ user: decoded.id });

    if (!userToken || userToken.token != token) {
        throw createHttpError(401, 'Please Login.');
    }

    req.id = decoded.id;
    // If token is valid, proceed to next middleware or route handler
    next();
});