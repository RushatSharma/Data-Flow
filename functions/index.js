const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const {GoogleGenerativeAI} = require("@google/generative-ai");

// Define the Gemini API key as a secret that Firebase will manage
const geminiApiKey = defineSecret("GEMINI_API_KEY");

// This is our main Cloud Function, named 'processDataWithGemini'
exports.processDataWithGemini = onCall(
    {secrets: [geminiApiKey]},
    async (request) => {
      // Security check: Ensure the user is logged into your app
      if (!request.auth) {
        throw new HttpsError(
            "unauthenticated",
            "You must be logged in to use this feature.",
        );
      }

      // Get the data sent from your React app
      const {text, prompt} = request.data;
      if (!text || !prompt) {
        throw new HttpsError(
            "invalid-argument",
            "The function must be called with 'text' and 'prompt' arguments.",
        );
      }

      try {
      // Initialize the Gemini AI with the secret key
        const genAI = new GoogleGenerativeAI(geminiApiKey.value());
        const model = genAI.getGenerativeModel({model: "gemini-1.5-flash-latest"});

        const generationConfig = {
          responseMimeType: "application/json",
        };

        // Combine the instructions and the user's data into a single prompt
        const fullPrompt = `${prompt}\n\nData:\n${text}`;

        // Call the Gemini API
        const result = await model.generateContent(fullPrompt, generationConfig);
        const response = await result.response;

        // Send the JSON result back to your React app
        return {json: response.text()};
      } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new HttpsError(
            "internal",
            "An error occurred while processing your request.",
        );
      }
    },
);