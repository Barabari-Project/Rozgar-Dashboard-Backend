import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

// Middleware function to validate name
export const validateName = (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName } = req.body;
    if (!firstName || !lastName) {
        throw createHttpError(400, 'Please Provide a Name');
    } else if (!firstName.match(/^[a-zA-Z]+$/) || !lastName.match(/^[a-zA-Z]+$/)) {
        throw createHttpError(400, 'Name should only contain alphabets and spaces.');
    }
    next();
}

// Middleware function to validate phone number
export const validatePhoneNumber = (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber } = req.body;
    // Check if the phone number matches the required pattern
    if (!phoneNumber) {
        throw createHttpError(400, 'Please Provide a phone number');
    } else if (!phoneNumber.match(/^(\+91)?\d{10}$/)) {
        throw createHttpError(400, 'Invalid phone number format.')
    }
    next();
}

export const validateEmail = (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
        throw createHttpError(400, 'Please Provide an email address');
    } else if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        throw createHttpError(400, 'Invalid email format.');
    }
    next();
}

export const validatePassword = (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;
    if (!password) {
        throw createHttpError(400, 'Please Provide a password');
    } else if (password.length > 3 && password.length < 10) {
        throw createHttpError(400, 'Password must be between 4 and 10 characters long');
    }
    next();
}

export const validateAddress = (req: Request, res: Response, next: NextFunction) => {
    const { address } = req.body;
    if (!address) {
        throw createHttpError(400, 'Please Provide an address');
    } else {
        const { line1, city, pincode } = address;
        if (!line1) {
            throw createHttpError(400, 'Please provide line1 of your address');
        } else if (!city) {
            throw createHttpError(400, 'Please provide name of your City is required');
        } else if (!pincode) {
            throw createHttpError(400, 'Please provide pincode of your city');
        } else if (!pincode.match(/^\d{6}$/)) {
            throw createHttpError(400, 'Invalid Pincode format');
        }
    }
    next();
}