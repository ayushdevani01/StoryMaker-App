// src/routes/imageRoutes.ts
import { Router } from "express";
import { generateImage } from "../utils/freepik";

const router = Router();

router.post('/image', async (req, res, next) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Image text is required" });
        }

        const imageUrl = await generateImage(prompt);
        res.json({ imageUrl });
    } catch (error) {
        next(error);
    }
});

export default router;