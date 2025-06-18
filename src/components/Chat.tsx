// src/components/Chat.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import { useAppStore } from "@/store/StoreProvider";
import { ChatMessage } from "@/store/slices/geminiSlice";

const Chat = () => {
  const {
    sessionId,
    initializeSession,
    sendMessage,
    chatHistory,
    isLoadingChat,
    chatError,
    clearChat,
  } = useAppStore((state) => state);
  const [currentMessage, setCurrentMessage] = useState("");
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  // Initialize session on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      initializeSession();
    }
  }, [initializeSession]);

  // Log session ID once available
  useEffect(() => {
    if (sessionId) {
      console.log("Current Session ID available:", sessionId);
      // You can now use this sessionId when making API calls to your Next.js API routes
    }
  }, [sessionId]);

  // Scroll to the bottom of the chat history when it updates
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMessage.trim() && sessionId && !isLoadingChat) {
      await sendMessage(currentMessage);
      setCurrentMessage(""); // Clear the input field after sending
    }
  };

  return (
    <div className="flex flex-col h-auto bg-gray-100">
      <header className="bg-blue-600 text-white p-4 text-center text-2xl font-bold">
        <h1>Gemini AI Chat</h1>
      </header>

      <div className="flex-grow p-4 overflow-y-auto" ref={chatHistoryRef}>
        {chatHistory.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            Start a conversation with Gemini!
          </p>
        )}
        {chatHistory.map((msg: ChatMessage, index: number) => (
          <div
            key={index}
            className={`mb-4 p-3 rounded-lg max-w-lg ${
              msg.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-300 text-gray-800 mr-auto"
            }`}
          >
            <strong>{msg.role === "user" ? "You" : "Gemini"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
        {isLoadingChat && (
          <div className="mb-4 p-3 rounded-lg bg-gray-300 text-gray-800 mr-auto">
            <strong>Gemini:</strong> Typing...
          </div>
        )}
        {chatError && (
          <div className="mb-4 p-3 rounded-lg bg-red-200 text-red-800 mr-auto">
            <strong>Error:</strong> {chatError}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white border-t border-gray-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoadingChat}
        />
        <button
          type="submit"
          className={`py-3 px-6 rounded-lg text-white font-semibold ${
            isLoadingChat || !currentMessage.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isLoadingChat || !currentMessage.trim()}
        >
          Send
        </button>
        <button
          type="button"
          onClick={clearChat}
          className="py-3 px-6 rounded-lg text-blue-600 border border-blue-600 hover:bg-blue-50"
          disabled={isLoadingChat}
        >
          Clear Chat
        </button>
      </form>
    </div>
  );
};

export default Chat;
