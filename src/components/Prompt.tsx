"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const Prompt = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [geminiResponse, setGeminiResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setGeminiResponse("");

    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contents: prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Something went wrong with the API call."
        );
      }

      const data = await response.json();
      setGeminiResponse(data.text);
    } catch (err: any) {
      console.error("Error fetching from Gemini API:", err);
      setError(
        err.message || "Failed to get a response from Gemini. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-12 p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
      <h1 className="text-center text-2xl font-semibold text-gray-800 mb-6">
        Gemini AI Chat
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          rows={5}
          className="p-3 text-base rounded-md border border-gray-300 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className={`py-3 px-5 text-lg text-white rounded-md transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Thinking..." : "Get Gemini Response"}
        </button>
      </form>

      {error && <p className="text-red-600 text-center mt-5">Error: {error}</p>}

      {geminiResponse && (
        <div className="mt-8 p-5 bg-gray-50 border border-gray-200 rounded-md">
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            Gemini's Response:
          </h2>
          <div className="whitespace-pre-wrap leading-none text-gray-800 ">
            <ReactMarkdown>{geminiResponse}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prompt;
