import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const SYSTEM_INSTRUCTION = `You are "Yellow Bot", the advanced AI assistant for Yellow Mart, a high-performance e-commerce platform in Bangladesh. 
Your goal is to help customers find products, explain features, and assist with store policies.
You have access to a list of products in the store context.
Be concise, friendly, and professional. Use emojis sparingly.
If a user asks about a product not in the context, suggest similar items or apologize.
Always emphasize the "Yellow Mart" guarantee of speed and quality.
Prices are in Bangladeshi Taka (BDT/৳).
`;

export const sendMessageToGemini = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  products: Product[]
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "I'm sorry, I cannot connect to the server right now (Missing API Key).";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Create a context string with current product info
    const productContext = products.map(p => 
      `- ${p.name} (৳${p.price}): ${p.description} (Stock: ${p.stock})`
    ).join('\n');

    const specializedInstruction = `${SYSTEM_INSTRUCTION}\n\nCurrent Product Inventory:\n${productContext}`;

    const model = 'gemini-2.5-flash';
    
    const contents = [
        ...history.map(h => ({
            role: h.role,
            parts: h.parts
        })),
        {
            role: 'user',
            parts: [{ text: message }]
        }
    ];

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: specializedInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I didn't catch that. Could you please rephrase?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble thinking right now. Please try again later.";
  }
};