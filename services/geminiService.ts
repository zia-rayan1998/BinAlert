import { UrgencyLevel } from "../types";

// This module now proxies requests to a backend endpoint instead of
// importing the Google GenAI SDK in the frontend. The server holds
// the API key and performs the actual AI call.

export interface AIAnalysisResult {
  overflowLevel: number;
  wasteTypes: string[];
  urgency: UrgencyLevel;
  description: string;
  isHazardous: boolean;
}

export const analyzeBinImage = async (base64Image: string): Promise<AIAnalysisResult> => {
  try {
    // Send the base64 image to the backend API which will call Gemini.
    const resp = await fetch(`/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image })
    });

    if (!resp.ok) throw new Error(`Server error: ${resp.status} ${resp.statusText}`);

    const result = await resp.json();

    // Convert incoming urgency string to enum
    let urgencyEnum = UrgencyLevel.LOW;
    switch (result.urgency) {
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