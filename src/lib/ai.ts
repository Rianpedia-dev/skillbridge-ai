import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

// Default model for general AI tasks
export const defaultModel = openrouter.chat("google/gemini-2.0-flash-001");

// Model for more complex reasoning (matching, estimation)
export const reasoningModel = openrouter.chat("google/gemini-2.0-flash-001");
