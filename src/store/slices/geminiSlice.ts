// src/store/slices/geminiSlice.ts
import { StateCreator } from "zustand";
import { v4 as uuidv4 } from "uuid";

export interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export interface GeminiSliceType {
  sessionId: string | null;
  setSessionId: (id: string) => void;
  initializeSession: () => Promise<void>;
  sendMessage: (message: string) => Promise<string | null>;
  chatHistory: ChatMessage[];
  isLoadingChat: boolean;
  chatError: string | null;
  clearChat: () => void;
}

export const createGeminiSlice: StateCreator<GeminiSliceType> = (set, get) => ({
  sessionId: null,
  setSessionId: (id: string) => set({ sessionId: id }),

  initializeSession: async () => {
    const currentSessionId = get().sessionId;
    if (!currentSessionId) {
      const newSessionId = uuidv4();
      console.log("Attempting to create new session:", newSessionId);

      try {
        const response = await fetch("/api/chat-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId: newSessionId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to create session in DB:", errorData.error);
          set({
            chatError: "Failed to initialize chat session: " + errorData.error,
          });
          throw new Error(
            "Failed to initialize chat session: " + errorData.error
          );
        }

        // Only set sessionId AFTER successful DB creation
        set({ sessionId: newSessionId, chatError: null });
        console.log("Session successfully created in DB:", newSessionId);
      } catch (error) {
        console.error("Network error creating session in DB:", error);
        set({
          chatError: "Network error during session initialization.",
        });
        throw error;
      }
    } else {
      console.log("Existing session ID:", currentSessionId);
      // Verify the session still exists in the database
      try {
        const response = await fetch("/api/chat-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId: currentSessionId }),
        });

        if (!response.ok) {
          console.warn(
            "Existing session verification failed, creating new session"
          );
          // Clear the invalid session and create a new one
          set({ sessionId: null });
          await get().initializeSession();
        }
      } catch {
        console.warn(
          "Session verification failed, will create new session on next message"
        );
        set({ sessionId: null, chatError: null });
      }
    }
  },

  sendMessage: async (message: string) => {
    set({ isLoadingChat: true, chatError: null });

    try {
      // CRITICAL: Always ensure session exists before sending message
      let sessionId = get().sessionId;

      if (!sessionId) {
        console.log("No session ID found, initializing session...");
        await get().initializeSession();
        sessionId = get().sessionId;

        if (!sessionId) {
          throw new Error(
            "Failed to initialize session before sending message"
          );
        }
      }

      // Verify session exists by attempting to create it (will return 200 if exists)
      const sessionVerification = await fetch("/api/chat-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!sessionVerification.ok) {
        console.warn("Session verification failed, creating new session");
        await get().initializeSession();
        sessionId = get().sessionId;

        if (!sessionId) {
          throw new Error(
            "Failed to create new session after verification failure"
          );
        }
      }

      // Add user message to history immediately for better UX
      set((state) => ({
        chatHistory: [...state.chatHistory, { role: "user", content: message }],
      }));

      const response = await fetch("/api/chat-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId, message }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // If it's a foreign key constraint error, clear session and retry once
        if (
          errorData.error?.includes("foreign key constraint") ||
          errorData.error?.includes("session_id") ||
          response.status === 500
        ) {
          console.warn(
            "Foreign key constraint error detected, clearing session and retrying..."
          );

          // Remove the optimistically added user message
          set((state) => ({
            chatHistory: state.chatHistory.filter(
              (msg) => !(msg.role === "user" && msg.content === message)
            ),
          }));

          // Clear session and retry once
          set({ sessionId: null });
          await get().initializeSession();

          const newSessionId = get().sessionId;
          if (!newSessionId) {
            throw new Error("Failed to create new session for retry");
          }

          // Re-add user message and retry the API call
          set((state) => ({
            chatHistory: [
              ...state.chatHistory,
              { role: "user", content: message },
            ],
          }));

          const retryResponse = await fetch("/api/chat-message", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId: newSessionId, message }),
          });

          if (!retryResponse.ok) {
            const retryErrorData = await retryResponse.json();
            throw new Error(
              `Retry failed: ${retryResponse.statusText} - ${retryErrorData.error}`
            );
          }

          const retryData = await retryResponse.json();
          set((state) => ({
            chatHistory: [
              ...state.chatHistory.slice(0, -1), // Remove the temporary user message
              { role: "user", content: message }, // Re-add user message
              { role: "model", content: retryData.response },
            ],
            isLoadingChat: false,
          }));
          return retryData.response;
        }

        throw new Error(
          `Chat API error: ${response.statusText} - ${errorData.error}`
        );
      }

      const data = await response.json();
      set((state) => ({
        chatHistory: [
          ...state.chatHistory.slice(0, -1), // Remove the temporary user message
          { role: "user", content: message }, // Re-add user message to ensure correct order
          { role: "model", content: data.response },
        ],
        isLoadingChat: false,
      }));
      return data.response;
    } catch (error: unknown) {
      console.error("Error sending message:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred while sending message.";
      set((state) => ({
        chatHistory: state.chatHistory.filter(
          (msg) => !(msg.role === "user" && msg.content === message)
        ),
        chatError: errorMessage,
        isLoadingChat: false,
      }));
      return null;
    }
  },

  chatHistory: [],
  isLoadingChat: false,
  chatError: null,
  clearChat: () => {
    set({
      chatHistory: [],
      chatError: null,
      isLoadingChat: false,
      sessionId: null,
    });

    // Reload the page after state has been cleared
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  },
});
