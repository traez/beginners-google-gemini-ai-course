// src/app/api/chat-create/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db/index"; // Your Drizzle DB client
import { c5chatSession } from "@/db/schema"; // Your schema
import { eq } from "drizzle-orm";

interface RequestBody {
  sessionId: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { sessionId } = (await req.json()) as RequestBody;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required." },
        { status: 400 }
      );
    }

    // Check if the session already exists
    const existingSession = await db
      .select()
      .from(c5chatSession)
      .where(eq(c5chatSession.id, sessionId))
      .limit(1);

    if (existingSession.length > 0) {
      console.log("Session already exists:", sessionId);
      return NextResponse.json(
        { message: "Session already exists." },
        { status: 200 }
      );
    }

    // Insert new session into the database
    await db.insert(c5chatSession).values({ id: sessionId });

    console.log("New session created in DB:", sessionId);
    return NextResponse.json(
      { message: "Session created successfully." },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating chat session:", error);
    return NextResponse.json(
      {
        error:
          "An error occurred while creating the chat session. Please try again.",
      },
      { status: 500 }
    );
  }
}