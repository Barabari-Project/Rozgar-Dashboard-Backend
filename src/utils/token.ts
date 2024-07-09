import jwt from 'jsonwebtoken';
import jwtTokenModel from '../models/jwtTokenModel.js';
import { Schema } from 'mongoose';

export const tokenGenerator = (payload: any) => {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRATION_TIME! });
}

export const manageUserTokens = async (id: Schema.Types.ObjectId) => {
    let userToken = await jwtTokenModel.findOne({ user: id });
    if (userToken) {
        try {
            await verifyJwtToken(userToken.token);
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                userToken.token = tokenGenerator({ id });
                await userToken.save();
            }
        }
        return userToken.token;
    } else {
        const token = tokenGenerator({ id });

        // If user does not exist, create a new entry with the token array
        userToken = new jwtTokenModel({
            user: id,
            token: token
        });
        await userToken.save();
        return token;
    }
}

export const verifyJwtToken = async (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET) as { [key: string]: any };
}

export const decodeJwtToken = (token: string) => {
    return jwt.decode(token) as { [key: string]: any };
}