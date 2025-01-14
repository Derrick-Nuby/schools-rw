import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.js";
import categoryRoutes from "./routes/category.js";
import combinationRoutes from "./routes/combination.js";
import schoolRoutes from "./routes/school.js";

import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();

const PORT: number = Number(process.env.PORT) || 3210;
const URL: string = process.env.BACKEND_URL || `http://localhost:${PORT}`;


app.use(cors({
    origin: ['http://localhost:5173', 'https://amashuri.thehuye.com', 'https://thehuye.com'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/combination', combinationRoutes);
app.use('/api/school', schoolRoutes);
app.get('/', (req, res) => {
    res.send('welcome to base app');
});

const uri = process.env.MONGODB_URI || `mongodb://localhost:27017/ProjectInit`;

const startServer = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Database connected successfully');

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on ${URL}`);
        });
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

startServer();

export default app;