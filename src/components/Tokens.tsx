"use client"; 
import { useState } from "react"; 

const Tokens = () => {
  const [prompt, setPrompt] = useState<string>(""); // Stores the user's input text
  const [tokenCount, setTokenCount] = useState<number | null>(null); // Stores the returned token count
  const [loading, setLoading] = useState<boolean>(false); // Indicates if an API call is in progress
  const [error, setError] = useState<string | null>(null); // Stores any error messages

  // Function to handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior (page reload)
    setError(null); // Clear any previous errors
    setLoading(true); // Set loading state to true
    setTokenCount(null); // Clear any previous token count

    // Basic validation: check if the prompt is empty
    if (!prompt.trim()) {
      setError("Please enter some text to count tokens."); // Set an error message
      setLoading(false); // Stop loading
      return; // Exit the function
    }

    try {
      // Make a POST request to your API route
      const response = await fetch("/api/count-tokens", {
        method: "POST", // Specify the HTTP method
        headers: {
          "Content-Type": "application/json", // Inform the server that we're sending JSON
        },
        // Send the user's prompt in the 'contents' field of the JSON body
        body: JSON.stringify({ contents: prompt }),
      });

      // Check if the response was not successful (e.g., HTTP status 4xx or 5xx)
      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        // Throw an error with a message from the API or a generic one
        throw new Error(
          errorData.error || "Something went wrong with the token count API."
        );
      }

      // Parse the successful JSON response
      const data = await response.json();
      console.log(data)
      setTokenCount(data.totalTokens);
    } catch (err: any) {
      // Catch and log any errors that occur during the fetch operation
      console.error("Error fetching token count:", err);
      // Set an error message for the user
      setError(err.message || "Failed to count tokens. Please try again.");
    } finally {
      setLoading(false); // Always set loading to false after the operation completes
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
      <h1 className="text-center text-2xl font-semibold text-gray-800 mb-6">
        Gemini Token Counter
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={prompt} // Bind the textarea value to the 'prompt' state
          onChange={(e) => setPrompt(e.target.value)} // Update 'prompt' state on change
          placeholder="Enter text to count its tokens..."
          rows={5}
          className="p-3 text-base rounded-md border border-gray-300 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading} // Disable textarea when loading
        />
        <button
          type="submit"
          disabled={loading} // Disable button when loading
          className={`py-3 px-5 text-lg text-white rounded-md transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed" // Styling for loading state
              : "bg-blue-600 hover:bg-blue-700" // Styling for normal state
          }`}
        >
          {loading ? "Counting..." : "Count Tokens"}{" "}
          {/* Button text changes based on loading state */}
        </button>
      </form>
      {error && <p className="text-red-600 text-center mt-5">Error: {error}</p>}{" "}
      {/* Display error message if present */}
      {/* Display the token count if it has been successfully fetched */}
      {tokenCount !== null && (
        <div className="mt-8 p-5 bg-gray-50 border border-gray-200 rounded-md text-center">
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            Total Tokens:
          </h2>
          <p className="text-3xl font-bold text-blue-700">{tokenCount}</p>
        </div>
      )}
    </div>
  );
};

export default Tokens; // Export the component for use in other parts of your app
