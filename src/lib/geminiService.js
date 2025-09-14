// --- PROMPT FOR STRUCTURING DATA ---
const STRUCTURE_SYSTEM_PROMPT = `You are an expert data analyst. Your task is to analyze the user's input and convert it into a structured JSON table format. The JSON output MUST follow this exact schema: {"headers": ["..."], "rows": [["..."]]}. If the input is already structured (like JSON or CSV), represent ALL of its columns and data accurately. If the input is unstructured text, identify the main entities. For any missing information, use '—' as a placeholder.`;

// --- PROMPT FOR GENERATING INSIGHTS ---
const INSIGHTS_SYSTEM_PROMPT = `You are a world-class data scientist. Analyze the user's data and provide valuable insights. You MUST respond with a single, valid JSON array of "insight" objects. The JSON schema you must follow is: [{"title": "Insight Title", "summary": "A brief summary.", "headers": ["..."], "rows": [["..."]]}] Ensure all strings in the JSON are properly terminated and escaped.`;

// Helper function to call our new Vercel Serverless Function
async function callVercelProxy(text, prompt) {
  try {
    const response = await fetch('/api/processData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Something went wrong');
    }

    return await response.json();
  } catch (error) {
    console.error("Vercel function call failed:", error);
    throw new Error(`An error occurred: ${error.message}`);
  }
}

// Update the two functions to use the helper
export function getStructuredDataFromGemini(text) {
  return callVercelProxy(text, STRUCTURE_SYSTEM_PROMPT);
}

export function getInsightsFromGemini(text) {
  return callVercelProxy(text, INSIGHTS_SYSTEM_PROMPT);
}