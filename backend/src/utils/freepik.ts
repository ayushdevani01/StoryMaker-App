// src/utils/freepik.ts
import fs from "fs";
import path from "path";
import config from "../config";

export async function generateImage(prompt: string) {
    const negative_prompt = "other humans, background people, extra characters, blurry, low quality, bad anatomy, deformed, ugly, disfigured, poor composition, out of focus";

    const options: RequestInit = {
        method: 'POST',
        headers: {
            'x-freepik-api-key': config.FREEPIK_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            guidance_scale: 1,
            image: { size: "square_1_1" },
            num_images: 1,
            prompt: prompt,
            negative_prompt: negative_prompt
        })
    };

    const response = await fetch('https://api.freepik.com/v1/ai/text-to-image', options);
    const data = await response.json();

    const base64Image = data.data?.[0]?.base64;
    const hasNsfw = data.data?.[0]?.has_nsfw;

    if (!base64Image) {
        throw new Error("Failed to generate image from Freepik API.");
    }

    if (hasNsfw) {
        throw new Error("Generated image contains unsafe content.");
    }

    const filename = `image-${Date.now()}.png`;
    const filepath = path.join(config.IMAGES_DIR, filename);
    const imageBuffer = Buffer.from(base64Image, 'base64');
    fs.writeFileSync(filepath, imageBuffer);

    return `/images/${filename}`;
}