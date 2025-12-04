import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export default async function generateResponse(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text;
}

export async function createEmbeddings(message) {
  const ai = new GoogleGenAI({});

  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: message,
    config: {
      outputDimensionality: 768,
    },
  });

  return response.embeddings[0].values;
}
