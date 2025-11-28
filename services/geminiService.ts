
import { GoogleGenAI, Type } from "@google/genai";
import { Policy } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';

// Helper to enforce language format
const LANGUAGE_INSTRUCTION = `
IMPORTANT OUTPUT FORMAT:
All text fields sent to the user MUST be provided in three languages separated by slashes or newlines:
1. Chinese (Simplified)
2. English
3. Japanese (with Furigana/Reading for Kanji in parentheses immediately following the Kanji).

Example Format: 
"终身保险 / Whole Life Insurance / 終身保険(しゅうしんほけん)"
"保费 / Premium / 保険料(ほけんりょう)"
`;

// 1. Generate Product Knowledge
export const getInsuranceExplanation = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `You are a Japanese Insurance Expert. Explain the concept of "${topic}" in the context of the Japanese insurance market.
      
      ${LANGUAGE_INSTRUCTION}
      
      Structure the response as valid Markdown.
      Use clear sections. 
      Explain key terms like "Hokenryo" (Premium), "Hokenkin" (Benefit), "Kaiyaku Henreikin" (Surrender Value) if applicable in the trilingual format.
      Keep it educational and concise (under 400 words total).
      `,
    });
    return response.text || "Unable to generate explanation.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI Service temporarily unavailable / AI服务暂时不可用 / AIサービスは一時的(いちじてき)に利用(りよう)できません";
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
      
      ${LANGUAGE_INSTRUCTION}

      Generate:
      1. planName: A creative name in "Chinese / English / Japanese(Kana)" format.
      2. premium: Estimated monthly premium in JPY (number only).
      3. coverageDetails: Bullet points of benefits. Each point must be "CN / EN / JP(Kana)".
      4. advice: Why this fits. Must be "CN / EN / JP(Kana)".
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planName: { type: Type.STRING },
            premium: { type: Type.INTEGER, description: "Monthly premium in JPY" },
            coverageDetails: { type: Type.STRING, description: "Trilingual Summary of benefits" },
            advice: { type: Type.STRING, description: "Trilingual Advice" },
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
      planName: "标准计划 / Standard Plan / 標準(ひょうじゅん)プラン",
      premium: 5000,
      coverageDetails: "基础保障 / Basic coverage / 基本保障(きほんほしょう)",
      advice: "请稍后重试 / Please retry later / 後(あと)で再試行(さいしこう)してください",
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
      If Denied, explain why.

      ${LANGUAGE_INSTRUCTION}
      The 'reasoning' field MUST be in "CN / EN / JP(Kana)" format.
      
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
      reasoning: "系统错误 / System error / システムエラー",
    };
  }
};
