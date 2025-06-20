// src/app/api/chat-message/route.ts
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { db } from "@/db/index"; // Your Drizzle DB client
import { c5chatMessage } from "@/db/schema"; // Your schema
import { eq, asc } from "drizzle-orm";

const apiKey = process.env.GOOGLE_GEMINI_API_KEY; // Ensure this is correctly set in .env.local

if (!apiKey) {
  throw new Error(
    "GOOGLE_API_KEY environment variable is not set. Please check your .env.local file."
  );
}

// Initialize the GoogleGenAI client with an object containing the API key
const ai = new GoogleGenAI({ apiKey });

interface RequestBody {
  sessionId: string;
  message: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { sessionId, message } = (await req.json()) as RequestBody;

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: "Session ID and message are required." },
        { status: 400 }
      );
    }

    // 1. Fetch existing chat history from Supabase
    const chatHistoryFromDb = await db
      .select()
      .from(c5chatMessage)
      .where(eq(c5chatMessage.sessionId, sessionId))
      .orderBy(asc(c5chatMessage.createdAt));

    // Convert DB history to Gemini's expected format for ai.chats.create
    // The history needs to be in the format { role: 'user' | 'model', parts: [{ text: string }] }
    const historyForGemini = chatHistoryFromDb.map((msg) => ({
      role: msg.role === "user" ? "user" : "model", // Ensure roles are 'user' or 'model'
      parts: [{ text: msg.content }],
    }));

    // 2. Initialize the Gemini chat model with this history using ai.chats.create
    const chat = ai.chats.create({
      model: "gemini-2.0-flash", // Specify your model here
      history: historyForGemini,
    });

    // 3. Send the user's new message to Gemini using chat.sendMessage({ message: ... })
    // This strictly follows your provided documentation snippet.
    const result = await chat.sendMessage({ message }); // Correct way to send message with new docs
    console.log(
      "Gemini AI full response object (from chat.sendMessage):",
      result
    );

    // --- CRUCIAL FIX HERE: Access .text directly as per your documentation ---
    const geminiResponseText = result.text; // Access .text directly
    // --- END CRUCIAL FIX ---

    if (
      typeof geminiResponseText !== "string" ||
      geminiResponseText.trim().length === 0
    ) {
      console.warn(
        "Gemini AI did not return a valid text response.",
        result // Log the whole result object for debugging
      );
      return NextResponse.json(
        { error: "Gemini AI generated an invalid or empty response." },
        { status: 500 }
      );
    }

    // 4. Save both the user's message and Gemini's response to Supabase
    await db.insert(c5chatMessage).values([
      {
        sessionId,
        role: "user",
        content: message,
      },
      {
        sessionId,
        role: "model",
        content: geminiResponseText,
      },
    ]);

    // 5. Return Gemini's response to the client
    return NextResponse.json({ response: geminiResponseText }, { status: 200 });
  } catch (error: any) {
    console.error("Error in chat message API route:", error);
    // Log the specific error message to help debug
    console.error("Error details:", error.message, error.stack);
    return NextResponse.json(
      {
        error:
          "An error occurred while processing your message. Please try again.",
      },
      { status: 500 }
    );
  }
}
