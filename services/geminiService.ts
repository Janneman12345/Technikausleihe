
import { GoogleGenAI, Type } from "@google/genai";
import { SmartTip } from "../types";

/**
 * Hilfsfunktion um potentielle Markdown-Formatierungen aus der KI-Antwort zu entfernen
 */
const sanitizeJson = (text: string): string => {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
};

export const getSmartInsight = async (itemName: string): Promise<SmartTip | null> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === 'undefined') {
    console.warn("Gemini API Key fehlt!");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Du bist ein Technik-Experte. Analysiere dieses Gerät: "${itemName}".
      Erstelle hilfreiche Informationen für einen Verleih-Service.
      Antworte AUSSCHLIESSLICH im JSON-Format.
      
      Struktur:
      {
        "category": "Gattung (z.B. Audio, Foto, Licht)",
        "safetyNote": "Ein kurzer, kritischer Sicherheitshinweis (Du-Form)",
        "quickGuide": "Ein Profi-Bedien-Tipp für beste Ergebnisse (Du-Form)"
      }`,
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

    const rawText = response.text;
    if (!rawText) throw new Error("Keine Antwort erhalten");

    const cleanJson = sanitizeJson(rawText);
    const parsed = JSON.parse(cleanJson);

    return {
      category: parsed.category || "Technik",
      safetyNote: parsed.safetyNote || "Keine besonderen Sicherheitsrisiken bekannt.",
      quickGuide: parsed.quickGuide || "Gerät gemäß Standard-Handbuch verwenden."
    };
  } catch (error) {
    console.error("Gemini Fehler Details:", error);
    // Fallback bei Fehlern, damit die UI nicht leer bleibt
    return {
      category: "Gerät",
      safetyNote: "Bitte auf allgemeine elektrische Sicherheit achten.",
      quickGuide: "Bei Fragen zur Bedienung bitte Jan kontaktieren."
    };
  }
};
