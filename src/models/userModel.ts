import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUserModel } from '../types';

// Define the schema for the user
const userSchema: Schema<IUserModel> = new Schema({
    firstName: {
        type: String,
        required: true,
        validate: {
            validator: (v: string) => /^[a-zA-Z]{2,50}$/.test(v),
            message: (props) => `${props.value} should only contain alphabets and should be between 2 and 51 characters long.`,
        },
    },
    lastName: {
        type: String,
        required: true,
        validate: {
            validator: (v: string) => /^[a-zA-Z]{2,50}$/.test(v),
            message: (props) => `${props.value} should only contain alphabets and should be between 2 and 51 characters long.`,
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v: string) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v), // found on website(more tested)
            // validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), // provided by gpt
            message: (props) => `${props.value} is not a valid email address.`,
        },
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true,
        validate: {
            validator: (v: number) => /^(\+91)?\d{10}$/.test(v.toString()),
            message: (props) => `${props.value} should be a 10-digit number.`,
        },
    },
    password: {
        type: String,
        required: true,
        select: false,
        validate: {
            validator: (v: string) => /^.{4,9}$/.test(v),
            message: (props) => `${props.value} should be between 4 and 10 characters long.`,
        }
    },
    address: {
        line1: {
            type: String,
            required: true,
            validate: {
                validator: (v: string) => /^[a-zA-Z]{2,50}$/.test(v),
                message: (props) => `${props.value} should be between 2 and 50 characters long.`,
            }
        },
        line2: {
            type: String,
            validate: {
                validator: (v: string) => (!v || /^[a-zA-Z]{2,50}$/.test(v)),
                message: (props) => `${props.value} should be between 2 and 50 characters long.`,
            },
            required: false
        },
        city: {
            type: String,
            required: true,
            validate: {
                validator: (v: string) => /^[a-zA-Z]{2,50}$/.test(v),
                message: (props) => `${props.value} should be between 2 and 50 characters long.`,
            }
        },
        pincode: {
            type: Number,
            validate: {
                validator: (v: number) => /^\d{6}$/.test(v.toString()),
                message: (props) => `${props.value} should be a 6-digit number.`,
            },
            required: true
        },
        required: true
    },
    creationTime: { type: String },
    creationDate: { type: String },
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
