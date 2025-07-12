// src/app.ts
import express from "express";
import cors from "cors";
import config from "./config";
import storyRoutes from "./routes/storyRoutes";
import imageRoutes from "./routes/imageRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static images
app.use('/images', express.static(config.IMAGES_DIR));

// API Routes
app.use('/api', storyRoutes);
app.use('/api', imageRoutes);

// Centralized error handling
app.use(errorHandler);

export default app;