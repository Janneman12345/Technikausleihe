
import { GoogleGenAI, Type } from "@google/genai";
import { SmartTip } from "../types";

export const getSmartInsight = async (itemName: string): Promise<SmartTip | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Erstelle technische Kurzinformationen für das Gerät: "${itemName}".
      Anforderungen:
      1. Sprache: Deutsch, informell ("du").
      2. Format: Strenges JSON.
      3. Felder: "category" (z.B. Audio, Video), "safetyNote" (ein kurzer Warnhinweis), "quickGuide" (ein praktischer Bedien-Tipp).`,
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
      // Entferne potentielle Markdown-Code-Blöcke, falls das Modell sie trotz JSON-Modus liefert
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson) as SmartTip;
    }
    return null;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
