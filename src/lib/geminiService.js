// This service handles calls to the Google Gemini API.

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`;
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// --- IMPROVED PROMPT FOR STRUCTURING DATA ---
const STRUCTURE_SYSTEM_PROMPT = `You are an expert data analyst. Your task is to analyze the user's input and convert it into a structured JSON table format. The JSON output MUST follow this exact schema: {"headers": ["..."], "rows": [["..."]]}.

- **If the input data is already structured (like JSON or CSV):** Your primary goal is to represent ALL of its columns and data accurately. Do not omit any columns.
- **If the input is unstructured text:** Identify the main entities from the text to create the table headers and extract the corresponding data for each row.

For any missing information in a row, use '—' as a placeholder.`;

export async function getStructuredDataFromGemini(text) {
  if (!API_KEY) {
    throw new Error("Gemini API Key is not configured. Please check your .env.local file.");
  }

  const requestBody = {
    systemInstruction: { parts: [{ text: STRUCTURE_SYSTEM_PROMPT }] },
    contents: [{ parts: [{ text }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          headers: { type: "ARRAY", items: { type: "STRING" } },
          rows: { type: "ARRAY", items: { type: "ARRAY", items: { type: "STRING" } } }
        }
      },
    },
  };

  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "An error occurred with the Gemini API.");
  }

  const data = await response.json();
  return JSON.parse(data.candidates[0].content.parts[0].text);
}


// --- PROMPT FOR GENERATING INSIGHTS ---
const INSIGHTS_SYSTEM_PROMPT = `You are a world-class data scientist. Your task is to analyze the user's data and provide valuable insights.
You MUST respond with a single, valid JSON array of "insight" objects. Do not include any text before or after the JSON array.

The JSON schema you must follow is:
[
  {
    "title": "A concise title for the insight",
    "summary": "A short, easy-to-understand summary of the key finding.",
    "headers": ["Header1", "Header2"],
    "rows": [["Row1Cell1", "Row1Cell2"], ["Row2Cell1", "Row2Cell2"]]
  }
]

CRITICAL: Ensure all strings in the JSON are properly terminated with a closing quote. If you need to include a quotation mark inside a string, you MUST escape it with a backslash, like this: \\".
Analyze the provided data to find meaningful patterns. For sales data, calculate totals. For student data, find averages. For unstructured text, identify key themes and summarize them.`;


export async function getInsightsFromGemini(text) {
  if (!API_KEY) {
    throw new Error("Gemini API Key is not configured. Please check your .env.local file.");
  }

  const requestBody = {
    systemInstruction: { parts: [{ text: INSIGHTS_SYSTEM_PROMPT }] },
    contents: [{ parts: [{ text }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            summary: { type: "STRING" },
            headers: { type: "ARRAY", items: { type: "STRING" } },
            rows: { type: "ARRAY", items: { type: "ARRAY", items: { type: "STRING" } } }
          },
         required: ["title", "summary", "headers", "rows"]
        }
      }
    },
  };

  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "An error occurred with the Gemini API.");
  }

  const data = await response.json();
  return JSON.parse(data.candidates[0].content.parts[0].text);
}