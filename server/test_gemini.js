import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

console.log("Checking Gemini API key...");
const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || process.env.GOOGLE_API_KEY;
console.log("Gemini API key loaded:", Boolean(apiKey));
console.log("AI_MODEL in env:", process.env.AI_MODEL);

const ai = new GoogleGenAI({ apiKey });

async function test() {
  const modelsToTry = [process.env.AI_MODEL, "gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"].filter(Boolean);
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`\nTesting Gemini API with model: ${modelName}...`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: "Hello, respond with exactly: Gemini is working",
      });
      console.log(">>> SUCCESS! Response text:");
      console.log(response.text);
      return;
    } catch (err) {
      console.error(`? Failed with model ${modelName}:`, err.message);
    }
  }
}

test();

