// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err instanceof Error ? err.message : String(err));
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: err.message || "An unexpected error occurred",
    });
};