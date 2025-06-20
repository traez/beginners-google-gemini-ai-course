// src/components/Chat.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import { useAppStore } from "@/store/StoreProvider";
import { ChatMessage } from "@/store/slices/geminiSlice";
import ReactMarkdown from "react-markdown";

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
    <div className="container mx-auto mt-12 p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
      <h1 className="text-center text-2xl font-semibold text-gray-800 mb-6">
        Gemini AI Chat
      </h1>

      {/* Chat History Container */}
      <div
        className="mb-6 p-5 bg-gray-50 border border-gray-200 rounded-md h-auto overflow-y-auto"
        ref={chatHistoryRef}
      >
        {chatHistory.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            Start a conversation with Gemini!
          </p>
        )}
        {chatHistory.map((msg: ChatMessage, index: number) => (
          <div
            key={index}
            className={`mb-4 p-3 rounded-lg max-w-[800px] ${
              msg.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-white text-gray-800 mr-auto border border-gray-200"
            }`}
          >
            <div className="font-medium text-sm mb-1">
              {msg.role === "user" ? "You" : "Gemini"}
            </div>
            <div className="whitespace-pre-wrap leading-relaxed">
              {msg.role === "user" ? (
                msg.content
              ) : (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        {isLoadingChat && (
          <div className="mb-4 p-3 rounded-lg bg-white text-gray-800 mr-auto border border-gray-200">
            <div className="font-medium text-sm mb-1">Gemini</div>
            <div className="text-gray-600">Thinking...</div>
          </div>
        )}
        {chatError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-800 mr-auto border border-red-200">
            <div className="font-medium text-sm mb-1">Error</div>
            <div>{chatError}</div>
          </div>
        )}
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage} className="flex flex-col gap-4">
        <textarea
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type your message here..."
          rows={3}
          className="p-3 text-base rounded-md border border-gray-300 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoadingChat}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoadingChat || !currentMessage.trim()}
            className={`flex-grow py-3 px-5 text-lg text-white rounded-md transition-colors ${
              isLoadingChat || !currentMessage.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoadingChat ? "Sending..." : "Send Message"}
          </button>
          <button
            type="button"
            onClick={clearChat}
            disabled={isLoadingChat}
            className={`py-3 px-5 text-lg rounded-md border transition-colors ${
              isLoadingChat
                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                : "border-blue-600 text-blue-600 hover:bg-blue-50"
            }`}
          >
            Clear Chat
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
