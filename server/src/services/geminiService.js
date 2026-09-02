import dotenv from "dotenv";

dotenv.config();

const SYSTEM_PROMPT = `You are CodeSphere AI, an expert AI Coding Assistant and Senior Software Engineer.
Help users write, debug, explain, optimize, and convert code efficiently.
Format all code snippets cleanly with standard markdown code blocks and programming language tags.`;

async function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in server .env file.");
  }
  const { GoogleGenAI } = await import("@google/genai");
  return new GoogleGenAI({ apiKey });
}

export async function generateAIResponse(message, history = []) {
  if (!message || !message.trim()) {
    throw new Error("Message cannot be empty");
  }

  const ai = await getGeminiClient();
  const modelName = process.env.AI_MODEL || "gemini-2.0-flash";

  // Build proper message format for Gemini API
  const contents = [];

  // Add system context as user message
  contents.push({
    role: "user",
    parts: [{ text: SYSTEM_PROMPT }],
  });

  // Add model response to acknowledge system prompt
  contents.push({
    role: "model",
    parts: [{ text: "I understand. I'm CodeSphere AI, your expert coding assistant." }],
  });

  // Add conversation history (last 6 messages for context)
  if (Array.isArray(history) && history.length > 0) {
    const recentHistory = history.slice(-6);
    for (const msg of recentHistory) {
      contents.push({
        role: msg.role === "user",
        parts: [{ text: msg.content }],
      });
    }
  }

  // Add current user message
  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
    });

    if (!response || !response.candidates || !response.candidates[0]) {
      throw new Error("Gemini returned an empty response.");
    }

    const text = response.candidates[0].content.parts[0].text;
    if (!text) {
      throw new Error("No text in Gemini response.");
    }

    return text;
  } catch (error) {
    console.error(`[Gemini Error - Model: ${modelName}]:`, error.message);
    
    // Fallback model retry if modelName fails
    if (modelName !== "gemini-1.5-flash") {
      try {
        console.log("Retrying with fallback model gemini-1.5-flash...");
        const fallbackResponse = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: contents,
        });
        return fallbackResponse.candidates[0].content.parts[0].text;
      } catch (fallbackError) {
        console.error("[Gemini Fallback Error]:", fallbackError.message);
        throw fallbackError;
      }
    }
    throw error;
  }
}

