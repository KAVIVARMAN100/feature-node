// app.js
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import db from "./config/database.js";
import router from "./routes/mainRoutes.js";
import globalErrorHandler from "./modules/vendor/errorController.js";
import { initializeModels } from "./models/index.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5000", credentials: true }));

app.use(express.static(path.join(__dirname, "dist")));

// Database connection and model initialization
async function connectSequelize() {
    try {
        await db.authenticate();
        console.log('Database Connected...');
        initializeModels(db);
        await db.sync();
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

connectSequelize();

app.use(router);

// Catch-all route for serving the frontend
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist/index.html"));
});

// Global error handler middleware
// 

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
