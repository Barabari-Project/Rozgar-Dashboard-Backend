import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { emailRegex, nameRegex, passwordRegex, phoneRegex, pincodeRegex } from '../constants/regexPatterns';

// Middleware function to validate name
export const validateName = (req: Request, res: Response, next: NextFunction) => {
    let { user: { firstName, lastName } } = req.body;
    if (!firstName || !lastName) {
        throw createHttpError(400, 'Please Provide a Name');
    } else if (!firstName.match(nameRegex) || !lastName.match(nameRegex)) {
        throw createHttpError(400, 'First Name and Last Name should only contain alphabets and it should be between 2 and 50.');
    }
    next();
}

export const phoneNumberRequired = (req: Request, res: Response, next: NextFunction) => {
    let { user: { phoneNumber } } = req.body;
    if (!phoneNumber) {
        throw createHttpError(400, 'Please Provide a Phone Number');
    }
    next();
}

// Middleware function to validate phone number
export const validatePhoneNumber = (req: Request, res: Response, next: NextFunction) => {
    let { user: { phoneNumber } } = req.body;
    if (phoneNumber && !phoneNumber.match(phoneRegex)) {
        throw createHttpError(400, 'Invalid phone number format.')
    }
    next();
}

export const validateEmail = (req: Request, res: Response, next: NextFunction) => {
    let { user: { email } } = req.body;
    if (email && !email.match(emailRegex)) {
        throw createHttpError(400, 'Invalid email format.');
    }
    next();
}

export const validatePassword = (req: Request, res: Response, next: NextFunction) => {
    let { user: { password } } = req.body;
    if (!password) {
        throw createHttpError(400, 'Please Provide a password');
    } else if (!password.match(passwordRegex)) {
        throw createHttpError(400, 'Password must be between 4 and 20 characters long');
    }
    next();
}

// export const validateAddress = (req: Request, res: Response, next: NextFunction) => {
//     const { address } = req.body;
//     if (!address) {
//         throw createHttpError(400, 'Please Provide an address');
//     } else {
//         let { line1, line2, city, pincode } = address;

//         line1 = line1 ? line1.trim() : line1;
//         line2 = line2 ? line2.trim() : line2;
//         city = city ? city.trim() : city;
//         pincode = pincode ? pincode.trim() : pincode;
//         if (!line1) {
//             throw createHttpError(400, 'Please provide line1 of your address');
//         } else if (!line1.match(addressRegex)) {
//             throw createHttpError(400, 'line1 of address must be between 2 and 51 characters long');
//         } else if (line2 && !line2.match(addressRegex)) {
//             throw createHttpError(400, 'line2 of address must be between 2 and 51 characters long');
//         } else if (!city) {
//             throw createHttpError(400, 'Please provide name of your City.');
//         } else if (!city.match(addressRegex)) {
//             throw createHttpError(400, 'City name must be between 2 and 51 characters long');
//         } else if (!pincode) {
//             throw createHttpError(400, 'Please provide pincode of your city.');
//         } else if (!pincode.match(pincodeRegex)) {
//             throw createHttpError(400, 'Invalid Pincode format');
//         }
//     }
//     next();
// }