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
  const modelName = process.env.AI_MODEL || "gemini-2.5-flash";

  // Build prompt with system instruction and history if available
  let fullPrompt = `${SYSTEM_PROMPT}\n\n`;

  if (Array.isArray(history) && history.length > 0) {
    const recentHistory = history.slice(-6);
    for (const msg of recentHistory) {
      const roleLabel = msg.role === "user" ? "User" : "Assistant";
      fullPrompt += `${roleLabel}: ${msg.content}\n\n`;
    }
  }

  fullPrompt += `User: ${message}\n\nAssistant:`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: fullPrompt,
    });

    if (!response || !response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    return response.text;
  } catch (error) {
    console.error(`[Gemini Error - Model: ${modelName}]:`, error.message);
    
    // Fallback model retry if modelName fails
    if (modelName !== "gemini-1.5-flash") {
      try {
        console.log("Retrying with fallback model gemini-1.5-flash...");
        const fallbackResponse = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: fullPrompt,
        });
        return fallbackResponse.text;
      } catch (fallbackError) {
        console.error("[Gemini Fallback Error]:", fallbackError.message);
        throw fallbackError;
      }
    }
    throw error;
  }
}

