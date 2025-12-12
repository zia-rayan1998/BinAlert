import { GoogleGenAI, Type } from "@google/genai";
import { UrgencyLevel } from "../types";

const getGeminiClient = () => {
  // Vite exposes env variables via import.meta.env
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    console.error("API Key is missing. Ensure VITE_API_KEY is set in .env");
    throw new Error("API Key is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

export interface AIAnalysisResult {
  overflowLevel: number;
  wasteTypes: string[];
  urgency: UrgencyLevel;
  description: string;
  isHazardous: boolean;
}

export const analyzeBinImage = async (base64Image: string): Promise<AIAnalysisResult> => {
  try {
    const client = getGeminiClient();
    
    // Clean base64 string if it contains metadata header
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const prompt = `
      Analyze this image of a garbage bin. 
      Determine if it is overflowing, estimate the fill percentage (0-100), identify visible waste types (plastic, organic, paper, metal, hazardous), and assess urgency.
      If you see fire, smoke, or leaking chemicals, mark as CRITICAL urgency and hazardous.
    `;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overflowLevel: { type: Type.NUMBER, description: "Percentage full from 0 to 100" },
            wasteTypes: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of waste types detected"
            },
            urgency: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
            description: { type: Type.STRING, description: "Short summary of the situation" },
            isHazardous: { type: Type.BOOLEAN }
          },
          required: ["overflowLevel", "wasteTypes", "urgency", "description", "isHazardous"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text);
    
    // Map string enum from JSON to TypeScript Enum
    let urgencyEnum = UrgencyLevel.LOW;
    switch(result.urgency) {
      case "MEDIUM": urgencyEnum = UrgencyLevel.MEDIUM; break;
      case "HIGH": urgencyEnum = UrgencyLevel.HIGH; break;
      case "CRITICAL": urgencyEnum = UrgencyLevel.CRITICAL; break;
    }

    return {
      overflowLevel: result.overflowLevel,
      wasteTypes: result.wasteTypes,
      urgency: urgencyEnum,
      description: result.description,
      isHazardous: result.isHazardous
    };

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback for demo if API fails
    return {
      overflowLevel: 85,
      wasteTypes: ["General Waste", "Plastic"],
      urgency: UrgencyLevel.MEDIUM,
      description: "AI analysis unavailable (Check API Key). Defaulting to medium urgency.",
      isHazardous: false
    };
  }
};