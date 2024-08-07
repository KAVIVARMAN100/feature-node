import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import db from "./config/database.js"; // Sequelize instance
import router from "./routes/mainRoutes.js";
import crypto from "crypto"
import { initializeModels } from "./models/index.js"; // Import the initialize function
import { fileURLToPath } from 'url';
import path from "path";
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();


const app = express();
app.use(express.static(path.join(__dirname, "dist")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

// Session middleware
app.set('trust proxy', 1);
// Generate a random secret key

// CORS options
const corsOptions = {
    origin: "http://localhost:5000",
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle database connection for Sequelize (PostgreSQL, MySQL, etc.)
async function connectSequelize() {
    try {
        await db.authenticate();
        console.log('Database Connected...');
        // Initialize models and associations
        initializeModels(db);
        // Sync database after connection is authenticated and associations are set
        await db.sync();
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

connectSequelize();

app.use(router);
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist/index.html"));
  });
const PORT = 5000;
app.listen(PORT, () => console.log('Server running at port ' + PORT));
