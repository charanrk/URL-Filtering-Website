import { useState } from "react";

export default function URLChecker() {
  const [url, setUrl] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // In a real application, use environment variables:
  // For Vite: import.meta.env.VITE_GOOGLE_API_KEY
  // This key should be kept secret and not exposed in client-side code
  const API_KEY = "Your_Key";
  
  const isValidURL = (input: string): boolean => {
    try {
      new URL(input);
      return true;
    } catch (error) {
      return false;
    }
  };

  const checkURL = async (): Promise<void> => {
    if (!url) {
      setMessage("⚠ Please enter a URL.");
      return;
    }

    if (!isValidURL(url)) {
      setMessage("⚠ Please enter a valid URL with http:// or https://");
      return;
    }

    setIsLoading(true);
    setMessage("🔍 Checking URL...");

    try {
      // In a production app, this request should go through your backend
      // to keep the API key secure
      const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

      const requestBody = {
        client: {
          clientId: "url-filtering-app",
          clientVersion: "1.0",
        },
        threatInfo: {
          threatTypes: [
            "MALWARE",
            "SOCIAL_ENGINEERING",
            "UNWANTED_SOFTWARE",
            "POTENTIALLY_HARMFUL_APPLICATION",
          ],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url: url }],
        },
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.matches && data.matches.length > 0) {
        setMessage("❌ This URL is *Unsafe*! (Malware, Phishing, or Harmful Content Detected)");
      } else {
        setMessage("✅ This URL is *Safe*.");
      }
    } catch (error) {
      console.error("Error checking URL:", error);
      setMessage(`❌ Failed to analyze URL: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkURL();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">🔍 URL Filtering</h1>

      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex">
          <input
            type="text"
            placeholder="Enter a URL (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-2 mb-4 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={checkURL}
          disabled={isLoading}
          className={`w-full ${
            isLoading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white py-2 rounded-lg transition duration-300`}
        >
          {isLoading ? "Checking..." : "Check URL"}
        </button>

        {message && (
          <p
            className={`mt-4 text-lg font-semibold ${
              message.includes("Safe") ? "text-green-400" : 
              message.includes("Checking") ? "text-yellow-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
