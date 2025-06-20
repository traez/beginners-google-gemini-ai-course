// /api/gemini-prompt/route.ts

import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// --------------------
// Type Declarations
// --------------------

// Shape of request expected from the frontend
interface RequestBody {
  contents: string; // User's input prompt
}

// Shape of the Gemini API response, only the part we're interested in
interface GeminiApiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string; // Gemini's generated text lives here
      }>;
    };
  }>;
}

// --------------------
// API Setup
// --------------------

// Get the Gemini API key from environment variables
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

// Exit early if the API key is missing
if (!apiKey) {
  throw new Error(
    "GOOGLE_GEMINI_API_KEY environment variable is not set. Check your .env.local file."
  );
}

// Initialize the Gemini client using the API key
const ai = new GoogleGenAI({ apiKey });

// --------------------
// POST Request Handler
// --------------------

// Handles POST requests to /api/gemini-prompt
export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Parse the incoming JSON body
    const { contents } = (await req.json()) as RequestBody;

    // Validate input: must be a non-empty string
    if (typeof contents !== "string" || contents.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty 'contents' provided." },
        { status: 400 }
      );
    }

    // Format the prompt to match Gemini's expected input structure
    const apiContents = {
      contents: [
        {
          parts: [
            {
              text: contents, // Pass in user's prompt
            },
          ],
        },
      ],
    };

    // Send the prompt to Gemini for content generation
    const result = (await ai.models.generateContent({
      model: "gemini-2.0-flash", // Fast, lightweight Gemini model
      ...apiContents,
      config: {
        candidateCount: 1, // Ask Gemini to return 1 suggestion
        temperature: 1.0, // Controls randomness/creativity (0 = deterministic)
      },
    })) as GeminiApiResponse; // Help TypeScript understand what we're working with

    // Safely pull the generated text from the nested response structure
    const geminiResponseText =
      result.candidates?.[0]?.content?.parts?.[0]?.text;

    // Handle empty or malformed responses
    if (
      typeof geminiResponseText !== "string" ||
      geminiResponseText.trim().length === 0
    ) {
      console.warn(
        "Gemini AI returned an empty or unexpected response structure:",
        result
      );
      return NextResponse.json(
        { error: "Gemini AI generated an invalid or empty response." },
        { status: 500 }
      );
    }

    // Send the generated text back to the frontend
    return NextResponse.json({ text: geminiResponseText }, { status: 200 });
  } catch (error: any) {
    // Catch unexpected errors and log them
    console.error("Error in Gemini API route:", error);

    // Send a generic error message to the frontend
    return NextResponse.json(
      {
        error:
          "An error occurred while communicating with Gemini AI. Please try again.",
      },
      { status: 500 }
    );
  }
}
