// custom.d.ts
import { Schema } from 'mongoose';
import { Request } from 'express';

declare module 'express-serve-static-core' {
    interface Request {
        id? : Schema.Types.ObjectId
    }
}
