// /api/count-tokens/route.ts
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Define the expected structure of the request body from the frontend
interface RequestBody {
  contents: string; // The prompt coming from the frontend
}

// Define the expected structure of the Gemini API countTokens response
interface CountTokensApiResponse {
  totalTokens?: number;
  // Other properties like model, usageMetadata might be present but not strictly needed for this task
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

    // Make the countTokens call to Gemini AI.
    const result = (await ai.models.countTokens({
      model: "gemini-2.0-flash", // Use the same model as your generateContent route
      ...apiContents, // Spread the structured contents
    })) as CountTokensApiResponse;

    const totalTokens = result.totalTokens;

    if (typeof totalTokens === "undefined") {
      console.warn(
        "Gemini AI did not return a valid totalTokens response.",
        result
      );
      return NextResponse.json(
        { error: "Gemini AI failed to count tokens." },
        { status: 500 }
      );
    }

    // Return the total token count to the frontend
    return NextResponse.json({ totalTokens }, { status: 200 });
  } catch (error: unknown) {
    // Changed 'any' to 'unknown'
    console.error("Error in Gemini count-tokens API route:", error);

    // It's good practice to log more details about the error if it's an Error instance
    if (error instanceof Error) {
      console.error("Error details:", error.message, error.stack);
    }

    // Provide a generic, safe error message to the frontend
    return NextResponse.json(
      {
        error:
          "An error occurred while communicating with Gemini AI to count tokens. Please try again.",
      },
      { status: 500 }
    );
  }
    }