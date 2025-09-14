import { GoogleGenerativeAI } from "@google/generative-ai";

// This is the main function that Vercel will run
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get the secret Gemini API key from Vercel's environment variables
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    return res.status(500).json({ error: "API key is not configured on the server." });
  }

  try {
    const { text, prompt } = req.body;

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const generationConfig = {
      responseMimeType: "application/json",
    };

    const fullPrompt = `${prompt}\n\nData:\n${text}`;
    const result = await model.generateContent(fullPrompt, generationConfig);
    const response = await result.response;

    const jsonResult = JSON.parse(response.text());

    // Send the successful result back to the frontend
    res.status(200).json(jsonResult);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
}