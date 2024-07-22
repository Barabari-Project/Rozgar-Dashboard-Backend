import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUserModel } from '../types/types';
import { emailRegex, nameRegex, passwordRegex, phoneRegex, pincodeRegex, string50CharRegex } from '../constants/regexPatterns';
import { Gender } from '../types/enums';

// Define the schema for the user
const userSchema: Schema<IUserModel> = new Schema({
    firstName: {
        type: String,
        required: true,
        validate: {
            validator: (v: string) => nameRegex.test(v),
            message: (props) => `${props.value} should only contain alphabets and should be between 2 and 51 characters long.`,
        },
    },
    lastName: {
        type: String,
        required: true,
        validate: {
            validator: (v: string) => nameRegex.test(v),
            message: (props) => `${props.value} should only contain alphabets and should be between 2 and 51 characters long.`,
        },
    },
    email: {
        type: String,
        // required: true,
        unique: true,
        validate: {
            validator: (v: string) => emailRegex.test(v),
            message: (props) => `${props.value} is not a valid email address.`,
        },
    },
    phoneNumber: {
        type: String,
        // required: true,
        unique: true,
        validate: {
            validator: (v: string) => phoneRegex.test(v),
            message: (props) => `${props.value} should be a 10-digit number.`,
        },
    },
    password: {
        type: String,
        required: true,
        select: false,
        validate: {
            validator: (v: string) => passwordRegex.test(v),
            message: (props) => `${props.value} should be between 4 and 20 characters long.`,
        }
    },
    gender:{
        type: String,
        enum: Gender,
    },
    region: {
        type: String,
        validate: {
            validator: (v: string) => string50CharRegex.test(v),
            message: (props) => `${props.value} should not be more than 50 characters.`,
        }
    },
    university:{
        type: String,
        validate: {
            validator: (v: string) => string50CharRegex.test(v),
            message: (props) => `${props.value} should not be more than 50 characters.`,
        }
    },
    degree:{
        type: String,
        validate: {
            validator: (v: string) => string50CharRegex.test(v),
            message: (props) => `${props.value} should not be more than 50 characters.`,
        }
    },
    organization:{
        type: String,
        validate: {
            validator: (v: string) => string50CharRegex.test(v),
            message: (props) => `${props.value} should not be more than 50 characters.`,
        }
    },
    creationTime: {
        type: String,
        select: false,
    },
    creationDate: {
        type: String,
        select: false,
    },
});

// Helper functions to get the current date and time in IST
const getCurrentISTDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
};

const getCurrentISTTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
};

// Pre-save hook to set the date and time in IST format
userSchema.pre('save', function (next) {
    if (!this.creationDate) {
        this.creationDate = getCurrentISTDate();
    }
    if (!this.creationTime) {
        this.creationTime = getCurrentISTTime();
    }
    // it means this is first time we are storing user data into the database at this point we want to hash the password
    if (this.__v === undefined) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

// Create the model using the schema
const userModel = mongoose.model<IUserModel>('User', userSchema);

export default userModel;
