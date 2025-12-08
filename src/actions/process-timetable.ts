"use server";

import { extractTimetableFromImage } from "@/lib/ocr-service";

/**
 * Server action to process timetable image using Groq Vision API
 * This ensures the API key stays on the server side
 */
export async function processUploadedTimetable(formData: FormData) {
    try {
        const file = formData.get('timetable') as File;

        if (!file) {
            return { error: "No file provided" };
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return { error: "Please upload an image file (PNG, JPG)" };
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return { error: "Image size must be less than 5MB" };
        }

        console.log('[Server] Processing timetable image:', file.name, file.type);

        // Extract timetable data using Groq Vision
        const extractedSlots = await extractTimetableFromImage(file);

        return { timeSlots: extractedSlots };

    } catch (error: any) {
        console.error('[Server] Timetable processing error:', error);
        return { error: error.message || "Failed to process timetable image" };
    }
}
