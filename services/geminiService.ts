import { GoogleGenAI, Type } from "@google/genai";
import { Policy } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';

// 1. Generate Product Knowledge
export const getInsuranceExplanation = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `You are a Japanese Insurance Expert. Explain the concept of "${topic}" in the context of the Japanese insurance market. 
      Use clear, professional markdown. 
      Explain key terms like "Hokenryo" (Premium), "Hokenkin" (Benefit), "Kaiyaku Henreikin" (Surrender Value) if applicable.
      Keep it educational and concise (under 300 words).
      Output language: Chinese (Simulating a learning site for Chinese speakers learning Japanese insurance).`,
    });
    return response.text || "Unable to generate explanation.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI Service temporarily unavailable.";
  }
};

// 2. Simulate Underwriting (Proposal)
export const generateProposal = async (
  age: number,
  gender: string,
  category: string,
  needs: string
): Promise<{
  planName: string;
  premium: number;
  coverageDetails: string;
  advice: string;
}> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Create a simulated Japanese insurance product proposal.
      User Profile: Age ${age}, Gender ${gender}.
      Interested in: ${category}.
      Specific Needs: ${needs}.
      
      Generate a realistic plan name (e.g., "Future Yell", "Medical Prime").
      Estimate a monthly premium in JPY.
      Describe coverage (Death benefit, Hospitalization per day, Surgery, etc.).
      Provide short advice on why this fits.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planName: { type: Type.STRING },
            premium: { type: Type.INTEGER, description: "Monthly premium in JPY" },
            coverageDetails: { type: Type.STRING, description: "Summary of benefits" },
            advice: { type: Type.STRING },
          },
          required: ["planName", "premium", "coverageDetails", "advice"],
        },
      },
    });
    
    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Proposal Error:", error);
    return {
      planName: "Standard Plan",
      premium: 5000,
      coverageDetails: "Basic coverage due to error.",
      advice: "Please retry later.",
    };
  }
};

// 3. Adjudicate Claim (The Assessment Dept)
export const adjudicateClaim = async (
  policy: Policy,
  incidentDescription: string
): Promise<{
  status: 'Approved' | 'Denied';
  amount: number;
  reasoning: string;
}> => {
  try {
    const prompt = `
      Act as a strict Claims Assessor (Satei-bu) for a Japanese Insurance Company.
      
      Policy Details:
      - Product: ${policy.productName} (${policy.category})
      - Coverage: ${policy.coverageAmount}
      - Special Conditions: ${policy.specialConditions}
      - Status: ${policy.status}

      Incident Report:
      ${incidentDescription}

      Task:
      Determine if this incident is covered by the policy.
      If Approved, determine a realistic payout amount in JPY based on the coverage string.
      If Denied, explain why based on standard exclusions (e.g., intentional act, pre-existing condition, not covered category).
      
      Output JSON.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ["Approved", "Denied"] },
            amount: { type: Type.INTEGER },
            reasoning: { type: Type.STRING },
          },
          required: ["status", "amount", "reasoning"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Claim Error:", error);
    return {
      status: 'Denied',
      amount: 0,
      reasoning: "System error during assessment. Please contact support.",
    };
  }
};
