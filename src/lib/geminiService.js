import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("Gemini API Key is not configured. Please check your .env.local file.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// --- PROMPT FOR STRUCTURING DATA (Unchanged) ---
const STRUCTURE_SYSTEM_PROMPT = `You are an expert data analyst. Your task is to analyze the user's input and convert it into a structured JSON table format. The JSON output MUST follow this exact schema: {"headers": ["..."], "rows": [["..."]]}. If the input is already structured (like JSON or CSV), represent ALL of its columns and data accurately. If the input is unstructured text, identify the main entities. For any missing information, use '—' as a placeholder.`;

// --- REVERTED TO THE SIMPLER, WORKING PROMPT ---
const INSIGHTS_SYSTEM_PROMPT = `You are a world-class data scientist. Your task is to analyze the user's data (like business logs) and provide valuable insights by summarizing the information.

You MUST respond with a single, valid JSON array of "insight" objects. Each object should represent a summary of a specific category of activity (e.g., "Sales Activities", "IT Department Summary").

The JSON schema you must follow is:
[
  {
    "title": "A concise title for the insight summary",
    "summary": "A short, one-sentence summary of the key finding.",
    "headers": ["Header1", "Header2"],
    "rows": [["Row1Cell1", "Row1Cell2"]]
  }
]

CRITICAL: Ensure all strings in the JSON are properly terminated with a closing quote. Your entire response should only be the JSON array and nothing else.`;


// This helper function remains the same
function sanitizeAndParseJson(rawText) {
  const match = rawText.match(/```json\s*([\s\S]*?)\s*```|({[\s\S]*}|\[[\s\S]*])/);
  if (!match) {
    console.error("Raw response from AI:", rawText);
    throw new Error("Could not find a valid JSON object or array in the AI's response.");
  }
  const jsonString = match[1] || match[2];
  return JSON.parse(jsonString);
}

async function callGemini(text, prompt) {
  try {
    const generationConfig = {
      responseMimeType: "application/json",
    };
    const fullPrompt = `${prompt}\n\nData:\n${text}`;
    const result = await model.generateContent(fullPrompt, generationConfig);
    const response = await result.response;

    return sanitizeAndParseJson(response.text());

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("An error occurred while communicating with the AI.");
  }
}

export function getStructuredDataFromGemini(text) {
  return callGemini(text, STRUCTURE_SYSTEM_PROMPT);
}

export function getInsightsFromGemini(text) {
  return callGemini(text, INSIGHTS_SYSTEM_PROMPT);
}

