# URL Filtering Application

## Overview
The **URL Filtering Application** is a web-based tool that helps users check if a URL is safe or potentially harmful. It utilizes Google's Safe Browsing API to detect threats such as malware, phishing, and unwanted software.

## Features
- **URL Validation**: Ensures that the input is a properly formatted URL.
- **Threat Detection**: Checks URLs against Google's Safe Browsing database.
- **User-Friendly Interface**: Displays real-time results.
- **Loading Indicator**: Shows a status message while checking the URL.
- **Security Awareness**: Educates users on potential web-based threats.

## Prerequisites
Ensure you have the following dependencies installed:
- **Node.js** (for running the application)
- **NPM** (to manage dependencies)

## Installation
Clone the repository and navigate into the project directory:

```sh
git clone https://github.com/your-username/url-filtering.git
cd url-filtering
```

Install required dependencies:

```sh
npm install
```

Set up your environment variable:
- Create a `.env` file in the root directory and add:
  ```env
  VITE_GOOGLE_API_KEY=your_google_api_key_here
  ```

Run the application:

```sh
npm run dev
```

## Usage
1. Open the application in your browser:
   ```sh
   http://localhost:5173
   ```
2. Enter a URL (e.g., `https://example.com`).
3. Click the **Check URL** button.
4. The application will display one of the following messages:
   - ✅ **Safe**: No threats detected.
   - ❌ **Unsafe**: The URL is flagged for malware, phishing, or harmful content.
   - ⚠ **Invalid URL**: If the input is not a valid URL format.

## Ethical Considerations & Legal Awareness
This tool is intended for *educational and security awareness* purposes only. Always ensure you have *explicit permission* before checking URLs related to an organization’s security policies.

### *Responsible Use Guidelines:*
- *Only check URLs that you own or have permission to analyze.*
- *Do not use this tool for malicious purposes.*
- Be aware of data privacy laws such as *GDPR* when handling URL data.

## Logging
The application logs activities such as URL checks and their results to enhance security awareness and debugging.

## License
This project is licensed under the MIT License. See LICENSE for details.

## Author
Developed by **Charan** as part of the **URL Filtering** project.

## Contribution
Contributions are welcome! Feel free to submit a pull request or open an issue.

---
*Disclaimer: This tool is for educational and authorized security awareness purposes only.*
