
import { GoogleGenAI, Type } from "@google/genai";
import { SmartTip } from "../types";

export const getSmartInsight = async (itemName: string): Promise<SmartTip | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analysiere kurz: "${itemName}". Antworte NUR im JSON-Format.
      JSON Felder: 
      "category": (z.B. Audio, Licht, Kamera),
      "safetyNote": (Ein kurzer Warnhinweis, du-Form),
      "quickGuide": (Ein praktischer Bedien-Tipp, du-Form).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            safetyNote: { type: Type.STRING },
            quickGuide: { type: Type.STRING }
          },
          required: ["category", "safetyNote", "quickGuide"]
        }
      }
    });

    const text = response.text;
    if (text) {
      // Robustes Parsing
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        category: parsed.category || "Technik",
        safetyNote: parsed.safetyNote || "",
        quickGuide: parsed.quickGuide || ""
      };
    }
    return null;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return null;
  }
};
