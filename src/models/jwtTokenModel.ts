import mongoose, { Schema } from 'mongoose';
import { IJwtTokenModel } from '../types/types.js';

const jwtTokenSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true,
    }
});

const jwtTokenModel = mongoose.model<IJwtTokenModel>('jwtToken', jwtTokenSchema);

export default jwtTokenModel;
