import { useState } from "react";

export default function URLChecker() {
  const [url, setUrl] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultType, setResultType] = useState<"none" | "safe" | "unsafe" | "warning" | "loading">("none");

  // In a production app, this should be in an environment variable
  // and accessed through a backend service to keep it secure
  const API_KEY = "your_Key";
  
  // Fixed error #1: Improved URL validation function
  const isValidURL = (input: string): boolean => {
    // Simple regex to validate URL format
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', // fragment locator
      'i'
    );
    return urlPattern.test(input);
  };

  const checkURL = async (): Promise<void> => {
    // Clear previous messages
    setMessage("");
    
    // Validate input
    if (!url.trim()) {
      setMessage("⚠ Please enter a URL.");
      setResultType("warning");
      return;
    }

    // Make sure URL has protocol
    let urlToCheck = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      urlToCheck = 'https://' + url;
    }

    if (!isValidURL(urlToCheck)) {
      setMessage("⚠ Please enter a valid URL.");
      setResultType("warning");
      return;
    }

    // Set loading state
    setIsLoading(true);
    setMessage("🔍 Checking URL...");
    setResultType("loading");

    try {
      // Fixed error #2: Properly structured API request
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
          threatEntries: [{ url: urlToCheck }],
        },
      };

      // Make API request
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // Handle non-200 responses
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      // Parse response
      const data = await response.json();
      console.log("API Response:", data);

      // Update UI based on response
      if (data.matches && data.matches.length > 0) {
        setMessage("❌ This URL is Unsafe! (Malware, Phishing, or Harmful Content Detected)");
        setResultType("unsafe");
      } else {
        setMessage("✅ This URL is Safe.");
        setResultType("safe");
      }
    } catch (error) {
      console.error("Error checking URL:", error);
      setResultType("warning");
      
      // Provide user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
          setMessage("❌ Network error. Please check your internet connection.");
        } else if (error.message.includes("API error: 403")) {
          setMessage("❌ API access denied. The API key may be invalid or restricted.");
        } else if (error.message.includes("API error: 429")) {
          setMessage("❌ Too many requests. Please try again later.");
        } else {
          setMessage(`❌ Error: ${error.message}`);
        }
      } else {
        setMessage("❌ An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed error #3: Properly typed event handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      checkURL();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            URL Shield
          </h1>
          <p className="text-gray-300">Check if a website is safe to visit</p>
        </div>

        <div className="bg-gray-800 bg-opacity-70 p-8 rounded-2xl shadow-2xl border border-gray-700">
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Enter website URL (e.g., example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 bg-opacity-50 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                aria-label="URL to check"
              />
            </div>
          </div>

          <button
            onClick={checkURL}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
              isLoading 
                ? "bg-gray-600 cursor-not-allowed" 
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
            }`}
            aria-label="Check URL safety"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </div>
            ) : (
              "Check Security"
            )}
          </button>

          {message && (
            <div className="mt-6 rounded-xl overflow-hidden transition-all duration-500">
              <div className={`p-4 flex items-center ${
                resultType === "safe" ? "bg-green-900/30 border-l-4 border-green-500" : 
                resultType === "unsafe" ? "bg-red-900/30 border-l-4 border-red-500" : 
                resultType === "loading" ? "bg-blue-900/30 border-l-4 border-blue-500" :
                "bg-yellow-900/30 border-l-4 border-yellow-500"
              }`}>
                <div className="mr-4">
                  {resultType === "safe" && (
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  )}
                  {resultType === "unsafe" && (
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  )}
                  {resultType === "warning" && (
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  )}
                  {resultType === "loading" && (
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="animate-spin h-6 w-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{message}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 text-xs text-gray-400 bg-gray-800/50 p-3 rounded-lg">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Powered by Google Safe Browsing API to detect malware, phishing, and harmful content.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2025 URL Shield | Stay Safe Online</p>
        </div>
      </div>
    </div>
  );
}
