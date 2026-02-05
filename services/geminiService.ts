
import { GoogleGenAI, Type } from "@google/genai";
import { SmartTip } from "../types";

export const getSmartInsight = async (itemName: string): Promise<SmartTip | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gib mir kurze Technik-Tipps für folgendes Gerät: "${itemName}". 
      WICHTIG: Sprich den Nutzer immer mit "du" an (informell). Beantworte in Deutsch.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "Kategorie (z.B. Kamera)" },
            safetyNote: { type: Type.STRING, description: "Ein kurzer Sicherheitshinweis" },
            quickGuide: { type: Type.STRING, description: "Ein 1-Satz Quick-Start Tipp" }
          },
          required: ["category", "safetyNote", "quickGuide"]
        }
      }
    });

    let generatedText = response.text;
    if (generatedText) {
      // Falls das Modell Markdown-Code-Blocks zurückgibt, diese entfernen
      generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(generatedText) as SmartTip;
    }
    
    return null;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
