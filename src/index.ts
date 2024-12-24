// src/index.ts
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import routes from './routes/index.js';
// import errorHandler from './controllers/errorHandler';

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || '3000');

app.use(express.json());
var allowlist = [process.env.FRONTEND_BASE_URL1, process.env.FRONTEND_BASE_URL2]

var corsOptionsDelegate = function (req, callback) {
    var corsOptions: { origin: boolean } = { origin: false };
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true }
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate));

connectDB();

app.use('/rozgar/api', routes);

app.get('/rozgar/health', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('Ok');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (!err.statusCode) {
        console.log(err);
    }
    // if statusCode is there it means that message will also be created by me
    // if statusCode is not there it means that message is not created by me its something else in this situation we want to send internal server error.
    res.status(err.statusCode ? err.statusCode : 500).json({ error: err.statusCode ? err.message : 'Internal Server Error.Please try again later.' });
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    server.close(() => {
        process.exit(1);
    });
});
