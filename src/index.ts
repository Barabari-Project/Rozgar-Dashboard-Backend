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
app.use(cors({
    origin: process.env.FRONTEND_BASE_URL
}));
app.use(morgan(process.env.ENV!));

// connectDB();

app.use(routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Server Error');
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
