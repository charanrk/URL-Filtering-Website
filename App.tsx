import { useState, useEffect } from "react";

export default function URLChecker() {
  const [url, setUrl] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultType, setResultType] = useState<"none" | "safe" | "unsafe" | "warning" | "loading">("none");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Initialize theme from localStorage or system preference on component mount
  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Update body class and localStorage when theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Known malicious patterns for local checking
  const MALICIOUS_PATTERNS = [
    "malware", "phishing", "virus", "trojan", "worm", "spyware", "ransomware",
    "hack", "crack", "keygen", "pirate", "warez", "xxx", "porn", "adult",
    "free-iphone", "free-gift", "win-prize", "you-won", "lottery"
  ];

  const isValidURL = (input: string): boolean => {
    try {
      new URL(input);
      return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  };

  // Basic check for suspicious URLs
  const isSuspiciousURL = (urlToCheck: string): boolean => {
    const lowerUrl = urlToCheck.toLowerCase();
    
    // Check for suspicious keywords
    for (const pattern of MALICIOUS_PATTERNS) {
      if (lowerUrl.includes(pattern)) {
        return true;
      }
    }
    
    // Check for IP address URLs (often suspicious)
    const ipPattern = /^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
    if (ipPattern.test(urlToCheck)) {
      return true;
    }
    
    return false;
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
      // First check locally for suspicious patterns
      if (isSuspiciousURL(urlToCheck)) {
        setMessage("❌ This URL appears to be unsafe! It contains suspicious patterns.");
        setResultType("unsafe");
        setIsLoading(false);
        return;
      }

      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll mark URLs containing "test" as safe
      // and URLs containing "example" as unsafe
      if (urlToCheck.toLowerCase().includes("example")) {
        setMessage("❌ This URL is Unsafe! (Malware, Phishing, or Harmful Content Detected)");
        setResultType("unsafe");
      } else {
        setMessage("✅ This URL appears to be Safe.");
        setResultType("safe");
      }
    } catch {
      setResultType("warning");
      setMessage("❌ An error occurred while checking the URL.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      checkURL();
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 transition-colors duration-500 ${
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-[#1a1040] to-[#0f172a] text-white" 
        : "bg-gradient-to-br from-[#f0f4ff] via-[#f5f0ff] to-[#fff0f9] text-gray-800"
    }`}>
      {/* Centered shield background with improved visibility */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-[30rem] w-[30rem] ${
            isDarkMode 
              ? "text-purple-500 opacity-[0.08]" 
              : "text-violet-500 opacity-[0.08]"
          }`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={0.8} 
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
          />
        </svg>
      </div>

      {/* Enhanced animated background elements for dark mode - using standard Tailwind animations */}
      {isDarkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Vibrant glowing orbs - using standard opacity */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl"></div>
            <div className="absolute top-2/3 left-1/3 w-80 h-80 rounded-full bg-fuchsia-500/15 blur-3xl"></div>
            <div className="absolute top-1/3 right-1/3 w-72 h-72 rounded-full bg-cyan-400/15 blur-3xl"></div>
            
            {/* Enhanced grid lines */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(168,85,247,0.07)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-blue-900/5"></div>
          </div>
        </div>
      )}

      {/* Enhanced background elements for light mode - using standard Tailwind */}
      {!isDarkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Vibrant gradient shapes - using standard opacity */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-pink-300/40 to-purple-300/40 blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-gradient-to-r from-blue-300/40 to-cyan-300/40 blur-3xl"></div>
            <div className="absolute top-2/3 right-1/3 w-64 h-64 rounded-full bg-gradient-to-r from-violet-300/40 to-indigo-300/40 blur-3xl"></div>
            <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-fuchsia-300/30 to-rose-300/30 blur-3xl"></div>
            
            {/* Enhanced pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/30 via-transparent to-pink-100/30"></div>
          </div>
        </div>
      )}

      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
          isDarkMode 
            ? "bg-gradient-to-r from-amber-300 to-yellow-400 text-gray-900 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] hover:scale-105" 
            : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] hover:scale-105"
        }`}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className={`text-5xl font-bold mb-2 ${
            isDarkMode 
              ? "text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400" 
              : "text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500"
          }`}>
            URL Shield
          </h1>
          <p className={isDarkMode ? "text-purple-200" : "text-violet-700"}>
            Check if a website is safe to visit
          </p>
        </div>

        <div className={`p-8 rounded-2xl shadow-2xl transition-all duration-300 ${
          isDarkMode 
            ? "bg-gray-900/70 border border-purple-900/50 shadow-[0_0_25px_rgba(147,51,234,0.15)]" 
            : "bg-white/80 border border-violet-200 shadow-[0_10px_50px_-12px_rgba(139,92,246,0.25)]"
        }`}>
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isDarkMode ? "text-purple-400" : "text-violet-500"}`} viewBox="0 0 20 20" fill="currentColor">
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
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 ${
                  isDarkMode 
                    ? "bg-gray-800/70 text-white border-purple-800 focus:ring-purple-500 focus:border-transparent placeholder-gray-500" 
                    : "bg-violet-50/70 text-gray-900 border-violet-200 focus:ring-violet-500 focus:border-violet-300 placeholder-violet-400"
                }`}
                aria-label="URL to check"
              />
            </div>
          </div>

          <button
            onClick={checkURL}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
              isLoading 
                ? isDarkMode ? "bg-gray-700 cursor-not-allowed" : "bg-violet-200 cursor-not-allowed text-violet-400"
                : isDarkMode 
                  ? "bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-700 hover:via-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-[0_5px_20px_rgba(147,51,234,0.4)] text-white" 
                  : "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 hover:from-violet-600 hover:via-fuchsia-600 hover:to-pink-600 shadow-lg hover:shadow-[0_5px_20px_rgba(139,92,246,0.3)] text-white"
            }`}
            aria-label="Check URL safety"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className={`animate-spin -ml-1 mr-2 h-5 w-5 ${isDarkMode ? "text-white" : "text-violet-200"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
            <div className="mt-6 rounded-xl overflow-hidden transition-all duration-300">
              <div className={`p-4 flex items-center ${
                resultType === "safe" 
                  ? isDarkMode ? "bg-green-900/30 border-l-4 border-green-400 shadow-[0_0_10px_rgba(74,222,128,0.2)]" : "bg-green-50 border-l-4 border-green-500 shadow-md"
                : resultType === "unsafe" 
                  ? isDarkMode ? "bg-red-900/30 border-l-4 border-red-400 shadow-[0_0_10px_rgba(248,113,113,0.2)]" : "bg-red-50 border-l-4 border-red-500 shadow-md"
                : resultType === "loading" 
                  ? isDarkMode ? "bg-purple-900/30 border-l-4 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]" : "bg-violet-50 border-l-4 border-violet-500 shadow-md"
                : isDarkMode ? "bg-yellow-900/30 border-l-4 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.2)]" : "bg-yellow-50 border-l-4 border-yellow-500 shadow-md"
              }`}>
                <div className="mr-4">
                  {resultType === "safe" && (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDarkMode ? "bg-green-500/20" : "bg-green-100"
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDarkMode ? "text-green-400" : "text-green-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  )}
                  {resultType === "unsafe" && (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDarkMode ? "bg-red-500/20" : "bg-red-100"
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDarkMode ? "text-red-400" : "text-red-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  )}
                  {resultType === "warning" && (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDarkMode ? "bg-yellow-500/20" : "bg-yellow-100"
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  )}
                  {resultType === "loading" && (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDarkMode ? "bg-purple-500/20" : "bg-violet-100"
                    }`}>
                      <svg className={`animate-spin h-6 w-6 ${isDarkMode ? "text-purple-400" : "text-violet-600"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>{message}</p>
                </div>
              </div>
            </div>
          )}

          <div className={`mt-6 text-xs p-3 rounded-lg transition-colors duration-300 ${
            isDarkMode ? "text-purple-300 bg-gray-800/50 border border-purple-900/30" : "text-violet-700 bg-violet-50/70 border border-violet-100"
          }`}>
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${isDarkMode ? "text-purple-400" : "text-violet-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Powered by advanced security checks to detect malware, phishing, and harmful content.
            </p>
          </div>
        </div>

        <div className={`mt-8 text-center text-sm ${isDarkMode ? "text-purple-300/60" : "text-violet-500/70"}`}>
          <p>© 2025 URL Shield | Stay Safe Online</p>
        </div>
      </div>
    </div>
  );
}
