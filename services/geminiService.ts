
import { GoogleGenAI, Type } from "@google/genai";
import { SmartTip } from "../types";

export const getSmartInsight = async (itemName: string): Promise<SmartTip | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analysiere das Gerät: "${itemName}".
      Antworte STRENG im JSON-Format.
      Felder:
      "category": (Gattung des Geräts, max 2 Worte),
      "safetyNote": (Ein wichtiger Sicherheitshinweis in der Du-Form),
      "quickGuide": (Ein kurzer Profi-Tipp für die Bedienung in der Du-Form).`,
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
    if (!text) throw new Error("Keine Antwort von Gemini");

    const parsed = JSON.parse(text);
    return {
      category: parsed.category || "Technik",
      safetyNote: parsed.safetyNote || "Keine besonderen Hinweise.",
      quickGuide: parsed.quickGuide || "Normaler Betrieb."
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      category: "Gerät",
      safetyNote: "Bitte vorsichtig handhaben.",
      quickGuide: "Standard-Bedienung."
    };
  }
};
