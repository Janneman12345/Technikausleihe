
import { GoogleGenAI, Type } from "@google/genai";
import { SmartTip } from "../types";

export const getSmartInsight = async (itemName: string): Promise<SmartTip | null> => {
  // Initialisierung direkt in der Funktion für maximale Aktualität des Keys
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analysiere kurz das Technik-Gerät: "${itemName}".
      Gib NUR ein JSON-Objekt zurück mit diesen Feldern:
      "category": (Kurze Gattung),
      "safetyNote": (Kurzer Sicherheitshinweis, du-Form),
      "quickGuide": (Ein praktischer Bedien-Tipp, du-Form).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "Kategorie des Geräts" },
            safetyNote: { type: Type.STRING, description: "Warnhinweis" },
            quickGuide: { type: Type.STRING, description: "Bedienungstipp" }
          },
          required: ["category", "safetyNote", "quickGuide"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    // Robuste Extraktion: Suche nach dem ersten { und dem letzten }
    const startIdx = text.indexOf('{');
    const endIdx = text.lastIndexOf('}');
    
    if (startIdx !== -1 && endIdx !== -1) {
      const jsonStr = text.substring(startIdx, endIdx + 1);
      const parsed = JSON.parse(jsonStr);
      return {
        category: parsed.category || "Technik",
        safetyNote: parsed.safetyNote || "Keine besonderen Warnhinweise.",
        quickGuide: parsed.quickGuide || "Normaler Betrieb."
      };
    }
    
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Rückgabe eines Fallbacks bei Fehlern, damit die UI nicht leer bleibt
    return {
      category: "Technik",
      safetyNote: "Bitte vorsichtig behandeln.",
      quickGuide: "Bei Fragen Jan kontaktieren."
    };
  }
};
