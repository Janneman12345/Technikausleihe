
import { GoogleGenAI, Type } from "@google/genai";
import { SmartTip } from "../types";

export const getSmartInsight = async (itemName: string): Promise<SmartTip | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key nicht konfiguriert.");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gib mir kurze Technik-Tipps für folgendes Gerät: "${itemName}". 
      WICHTIG: Sprich den Nutzer immer mit "du" an (informell), niemals mit "Sie". Beantworte in Deutsch.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "Kategorie des Geräts (z.B. Kamera, Laptop)" },
            safetyNote: { type: Type.STRING, description: "Ein kurzer Sicherheitshinweis in Du-Form" },
            quickGuide: { type: Type.STRING, description: "Ein 1-Satz Quick-Start Tipp in Du-Form" }
          },
          required: ["category", "safetyNote", "quickGuide"]
        }
      }
    });

    // Behebung von error TS18048: 'response.text' is possibly 'undefined'.
    const generatedText = response.text;
    if (generatedText) {
      return JSON.parse(generatedText.trim()) as SmartTip;
    }
    
    return null;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
