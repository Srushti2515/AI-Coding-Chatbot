import dotenv from "dotenv";

dotenv.config();

const SYSTEM_PROMPT = `You are CodeSphere AI, an expert AI Coding Assistant and Senior Software Engineer.
Help users write, debug, explain, optimize, and convert code efficiently.
Format all code snippets cleanly with standard markdown code blocks and programming language tags.`;
const MODEL_NAME = "gemini-3.6-flash";

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

  // Keep system instructions separate from the user's conversation.
  const contents = [];

  // Add conversation history (last 6 messages for context)
  if (Array.isArray(history) && history.length > 0) {
    const recentHistory = history.slice(-6);
    for (const msg of recentHistory) {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
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
    const ai = await getGeminiClient();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    const text = response?.text?.trim();
    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    return text;
  } catch (error) {
    const status = error?.status ?? error?.code ?? "unknown";
    const message = error?.message || "Unknown Gemini error";
    console.error("[Gemini Error]", {
      status,
      message,
      model: MODEL_NAME,
    });
    throw new Error("Gemini request failed. Please try again.");
  }
}

