
import { GoogleGenAI, Type } from "@google/genai";

export const getSmartInsight = async (itemName: string): Promise<string | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') return null;

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analysiere dieses Technik-Gerät: "${itemName}".
      Gib mir einen kurzen, professionellen Tipp (max. 15 Wörter), wie man dieses Gerät am Film-Set behandeln muss, damit es möglichst langlebig bleibt (z.B. Schutz vor Hitze, Kabelmanagement, Sensorreinigung). 
      Schreibe in der Du-Form.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            handlingTip: { 
              type: Type.STRING,
              description: "Ein kurzer Tipp zur Schonung der Technik."
            }
          },
          required: ["handlingTip"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    const result = JSON.parse(text);
    return result.handlingTip || null;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
