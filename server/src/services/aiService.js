import { generateAIResponse } from "./geminiService.js";

export const generateAIChatResponse = async (messages, options = {}) => {
  const lastUserMsg = messages.filter(m => m.role === "user").pop();
  const promptText = lastUserMsg ? lastUserMsg.content : "Hello";
  const history = messages.slice(0, messages.length - 1);

  return await generateAIResponse(promptText, history);
};

export const explainCodeAI = async (code, language = "javascript") => {
  const prompt = `Please explain the following ${language} code line-by-line in a clear, beginner-friendly way:\n\n\`\`\`${language}\n${code}\n\`\`\``;
  return await generateAIResponse(prompt);
};

export const debugCodeAI = async (code, errorMessage = "") => {
  const prompt = `Debug and fix errors in this code:\n\n\`\`\`\n${code}\n\`\`\`${errorMessage ? `\nError Log / Output:\n${errorMessage}` : ""}`;
  return await generateAIResponse(prompt);
};

export const optimizeCodeAI = async (code, language = "javascript") => {
  const prompt = `Optimize the following ${language} code for better performance, memory usage, readability, and modern best practices:\n\n\`\`\`${language}\n${code}\n\`\`\``;
  return await generateAIResponse(prompt);
};

export const convertCodeAI = async (code, fromLang, toLang) => {
  const prompt = `Convert the following code from ${fromLang} to ${toLang}. Provide clean code and note any framework or standard library differences:\n\n\`\`\`${fromLang}\n${code}\n\`\`\``;
  return await generateAIResponse(prompt);
};

export const generateCodeAI = async (prompt, language = "javascript") => {
  const fullPrompt = `Write clean, efficient ${language} code for the following specification: ${prompt}`;
  return await generateAIResponse(fullPrompt);
};

