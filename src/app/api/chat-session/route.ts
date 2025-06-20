// src/app/api/chat-session/route.ts

/**
 * API Route: POST /api/chat-session
 *
 * Purpose:
 * This endpoint is used to initialize or verify a chat session.
 * The frontend sends a client-generated session ID (UUID).
 *
 * - If the session already exists in the database, it returns a 200 OK.
 * - If the session doesn't exist, it creates a new row in the `c5chat_session` table and returns 201 Created.
 * - This route ensures sessions are valid and avoids duplication.
 *
 * It is used by the frontend before sending any messages to guarantee that a valid session exists in the DB.
 */

import { NextResponse } from "next/server";
import { db } from "@/db/index"; // Drizzle client instance
import { c5chatSession } from "@/db/schema"; // Table schema for chat sessions
import { eq } from "drizzle-orm"; // Helper for building WHERE clause comparisons

// Shape of the expected request body
interface RequestBody {
  sessionId: string; // Client-generated unique session ID (UUID)
}

// API handler for POST /api/chat-session
export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Parse and extract sessionId from request body
    const { sessionId } = (await req.json()) as RequestBody;

    // Validate the presence of sessionId
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required." },
        { status: 400 } // Bad Request
      );
    }

    // Check if a session with the same ID already exists in the DB
    const existingSession = await db
      .select()
      .from(c5chatSession)
      .where(eq(c5chatSession.id, sessionId)) // WHERE id = sessionId
      .limit(1); // Optimization: we only need to know if one exists

    if (existingSession.length > 0) {
      // Session already exists, return 200 OK without duplicating
      console.log("Session already exists:", sessionId);
      return NextResponse.json(
        { message: "Session already exists." },
        { status: 200 }
      );
    }

    // Session doesn't exist — insert it into the DB
    await db.insert(c5chatSession).values({ id: sessionId });

    console.log("New session created in DB:", sessionId);
    return NextResponse.json(
      { message: "Session created successfully." },
      { status: 201 } // Created
    );
  } catch (error: any) {
    // Catch-all error handler — logs the error and returns a 500 response
    console.error("Error creating chat session:", error);
    return NextResponse.json(
      {
        error:
          "An error occurred while creating the chat session. Please try again.",
      },
      { status: 500 } // Internal Server Error
    );
  }
}
