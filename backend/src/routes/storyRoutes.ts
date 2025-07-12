// src/routes/storyRoutes.ts
import { Router } from "express";
import { generateStory } from "../utils/gemini";

const router = Router();

router.post('/story', async (req, res, next) => {
    try {
        const {
            childName,
            childAge,  
            storyTheme,
            customStoryTheme,
            desiredMoral,
            storyLength,
            customStoryLength,
            language,
            imageUrl,
            gender
        } = req.body;

        const result = await generateStory({
            childName,
            childAge,
            storyTheme,
            customStoryTheme,
            desiredMoral,
            storyLength,
            customStoryLength,
            language,
            imageUrl,
            gender
        });

        res.json(result);
    } catch (error) {
        next(error); // Pass error to the error handling middleware
    }
});

export default router;