// /api/gemini-prompt/route.ts
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Define the expected structure of the request body from the frontend
interface RequestBody {
  contents: string; // The prompt coming from the frontend
}

// Define the expected structure of the Gemini API response, a JSON feedback
interface GeminiApiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  /*   Other properties like usageMetadata, modelVersion, responseId are not strictly needed for just extracting text, but are part of the full response. */ 
}

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GOOGLE_GEMINI_API_KEY environment variable is not set. Please check your .env.local file."
  );
}

const ai = new GoogleGenAI({ apiKey });

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { contents } = (await req.json()) as RequestBody;

    if (typeof contents !== "string" || contents.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty 'contents' provided." },
        { status: 400 }
      );
    }

    // Prepare the content structure as expected by the REST API and library
    const apiContents = {
      contents: [
        {
          parts: [
            {
              text: contents, // The prompt from the frontend
            },
          ],
        },
      ],
    };

// Make the content generation call to Gemini AI. The type assertion `as GeminiApiResponse` helps TypeScript understand the expected shape */
    const result = (await ai.models.generateContent({
      model: "gemini-2.0-flash",
      ...apiContents, // Spread the structured contents
      config: {
        candidateCount: 1,
        /* stopSequences: ["\n\n"], // Changed to stop at the end of a paragraph
        maxOutputTokens: 200,  */
        temperature: 1.0,
      },
    })) as GeminiApiResponse; // Assert the type of the result

    // --- FIX IS HERE ---
    // Safely extract the text from the nested 'candidates' array, 'content', and 'parts'
    const geminiResponseText =
      result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (
      typeof geminiResponseText !== "string" ||
      geminiResponseText.trim().length === 0
    ) {
      console.warn(
        "Gemini AI did not return a valid text response in candidates.",
        result
      );
      return NextResponse.json(
        { error: "Gemini AI generated an invalid or empty response." },
        { status: 500 }
      );
    }
    // --- END FIX ---

    // Return the extracted text to the frontend
    return NextResponse.json({ text: geminiResponseText }, { status: 200 });
  } catch (error: any) {
    console.error("Error in Gemini API route:", error);

    // Provide a generic, safe error message to the frontend
    return NextResponse.json(
      {
        error:
          "An error occurred while communicating with Gemini AI. Please try again.",
      },
      { status: 500 }
    );
  }
}
