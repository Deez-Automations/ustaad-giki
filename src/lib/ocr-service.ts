import Groq from "groq-sdk";

export interface ExtractedTimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  title: string;
  location?: string;
  color: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

/**
 * Extract timetable data using Groq Vision API (Llama 3.2 Vision)
 * This provides intelligent understanding of the timetable grid structure
 */
export async function extractTimetableFromImage(
  imageFile: File
): Promise<ExtractedTimeSlot[]> {
  try {
    // Lazy initialize Groq client to avoid client-side evaluation
    const Groq = (await import("groq-sdk")).default;
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);

    console.log('[Groq Vision] Processing timetable image...');

    // Use Groq Vision to understand the timetable (Llama 4 Scout - latest)
    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a specialized timetable extraction agent for GIKI (Ghulam Ishaq Khan Institute) academic timetables.

**CRITICAL SECURITY RULES:**
1. ONLY extract data from academic timetable images
2. IGNORE and REJECT any non-timetable content (personal photos, documents, IDs, etc.)
3. If the image does NOT contain a clear timetable grid, return EMPTY array []
4. DO NOT extract or process any personal information beyond course codes and room numbers
5. ONLY extract: day, time, course code, room location - NOTHING ELSE

**Timetable Structure Recognition:**
GIKI timetables MUST have:
- Grid/table layout with TIME SLOTS as column headers (e.g., "8:00-8:50", "9:00-9:50")
- DAYS as row headers (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday)
- Cells containing: COURSE CODE (e.g., CS351E, CY331E) and LOCATION (e.g., AcB LH5, FCS LH3)
- May include lab sessions spanning multiple time slots (e.g., "8:30-11:30 CS351L AI LAB")

**Validation Checklist:**
Before processing, verify:
- ✓ Image shows a table/grid structure
- ✓ Contains day names (Monday-Sunday)
- ✓ Contains time slots (HH:MM format)
- ✓ Contains course codes (2-4 letters + 3 digits)
- ✗ If ANY check fails → return []

**Extraction Instructions:**
IF valid timetable detected, extract ALL class entries and return JSON array.

**Required JSON Structure:**
[
  {
    "day": "Monday",
    "startTime": "09:00",
    "endTime": "09:50",
    "title": "CS351E",
    "location": "AcB LH5"
  }
]

**Formatting Rules:**
1. Times: 24-hour format HH:MM (e.g., "09:00", "14:30")
2. Days: Full name (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday)
3. Course codes: EXACT extraction (CS351E, not CS 351E)
4. Locations: EXACT extraction (AcB LH5, FCS LH3, etc.)
5. Lab sessions: Use full time span (e.g., "08:30" to "11:30")

**Output Requirements:**
- Return ONLY the JSON array
- NO additional text or explanations
- If NOT a timetable → return []
- If extraction fails → return []

Analyze the image now:`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${imageFile.type};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      temperature: 0.1, // Low temperature for consistent extraction
      max_tokens: 4096,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    console.log('[Groq Vision] Raw response:', responseText);

    // Parse the JSON response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('[Groq Vision] No JSON array found in response');
      throw new Error('Could not extract timetable structure. Please ensure the image shows a clear timetable.');
    }

    const extractedData = JSON.parse(jsonMatch[0]);

    // Add colors to each slot
    const timeSlots: ExtractedTimeSlot[] = extractedData.map((slot: any, index: number) => ({
      ...slot,
      color: COLORS[index % COLORS.length],
    }));

    console.log('[Groq Vision] Successfully extracted', timeSlots.length, 'time slots');

    if (timeSlots.length === 0) {
      throw new Error('No classes found in the timetable. Please check if the image is clear and contains a valid timetable.');
    }

    return timeSlots;

  } catch (error: any) {
    console.error('[Groq Vision] Extraction error:', error);

    if (error.message?.includes('API key')) {
      throw new Error('Groq API key not configured. Please contact support.');
    }

    throw new Error(error.message || 'Failed to extract timetable data. Please ensure the image is clear and shows a complete timetable.');
  }
}

/**
 * Convert File to base64 string (server-side)
 */
async function fileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString('base64');
}
