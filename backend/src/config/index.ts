// src/config/index.ts
import "dotenv/config";
import path from "path";
import fs from "fs";

interface AppConfig {
    PORT: number;
    API_KEY: string;
    FREEPIK_API_KEY: string;
    IMAGES_DIR: string;
}

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable is required");
}

const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY;
if (!FREEPIK_API_KEY) {
    throw new Error("FREEPIK_API_KEY environment variable is required");
}

const projectRoot = process.cwd();
const imagesDir = path.join(projectRoot, 'public', 'images');

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

const config: AppConfig = {
    PORT: parseInt(process.env.PORT || "5000", 10),
    API_KEY: API_KEY,
    FREEPIK_API_KEY: FREEPIK_API_KEY,
    IMAGES_DIR: imagesDir,
};

export default config;