
import { GoogleGenAI, Type } from "@google/genai";
import { SmartTip } from "../types";

export const getSmartInsight = async (itemName: string): Promise<SmartTip | null> => {
  // Wir erstellen die Instanz hier, um sicherzustellen, dass der Key aktuell ist
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Kurz-Analyse für: "${itemName}". Antworte NUR als JSON.
      Felder: "category" (Gattung), "safetyNote" (Warnung, du-Form), "quickGuide" (Tipp, du-Form).`,
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
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson) as SmartTip;
    }
    return null;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
