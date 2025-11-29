
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { InsuranceLesson, ClaimResult, SimulationResult, Policy } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const JP_FORMAT_INSTRUCTION = `
IMPORTANT FOR JAPANESE OUTPUT:
You MUST use the format "Kanji(kana)" for ANY word containing Kanji to support ruby annotation in the UI. 
Example: "保険(ほけん)に入(はい)る必要(ひつよう)があります。"
Do NOT use this format for Katakana or Hiragana-only words.
`;

// --- 1. Insurance Lesson Generation ---

export const generateInsuranceLesson = async (topic: string, context?: string, relatedProductId?: string): Promise<InsuranceLesson> => {
  try {
    const prompt = `
      You are an expert bilingual insurance instructor in Japan.
      User Query: "${topic}"
      ${context ? `Context Product: ${context}` : ''}

      Please generate a comprehensive lesson/explanation about this topic.
      1. Create a "Visual Prompt" (in English) to generate an image that explains this concept (e.g., a diagram of a car accident, a hospital checkout scene).
      2. Generate the content in 3 languages (Chinese, English, Japanese).
      3. Structure the content into 3-5 logical chapters (e.g., Definition, Examples, Important Points).
      4. ${JP_FORMAT_INSTRUCTION}
      
      Output JSON format.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            visualPrompt: { type: Type.STRING },
            mainTitle: {
               type: Type.OBJECT,
               properties: { cn: { type: Type.STRING }, en: { type: Type.STRING }, jp: { type: Type.STRING } },
               required: ["cn", "en", "jp"]
            },
            chapters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: {
                    type: Type.OBJECT,
                    properties: { cn: { type: Type.STRING }, en: { type: Type.STRING }, jp: { type: Type.STRING } },
                    required: ["cn", "en", "jp"]
                  },
                  content: {
                     type: Type.OBJECT,
                     properties: { cn: { type: Type.STRING }, en: { type: Type.STRING }, jp: { type: Type.STRING } },
                     required: ["cn", "en", "jp"]
                  }
                },
                required: ["id", "title", "content"]
              }
            }
          },
          required: ["visualPrompt", "mainTitle", "chapters"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text response");
    
    const data = JSON.parse(text);
    
    return {
      id: Date.now().toString(),
      timestamp: Date.now(),
      topic,
      visualPrompt: data.visualPrompt,
      mainTitle: data.mainTitle,
      chapters: data.chapters,
      relatedProductId
    };

  } catch (error) {
    console.error("Lesson Generation Error:", error);
    throw error;
  }
};

// --- 2. Simulation / Quote Analysis ---

export const generateSimulation = async (productName: string, age: number, gender: string, concerns?: string): Promise<SimulationResult> => {
   try {
    const prompt = `
      The user (Age: ${age}, Gender: ${gender}) is simulating a quote for the Japanese insurance product: "${productName}".
      ${concerns ? `User's specific needs/concerns: "${concerns}"` : ''}
      
      1. Estimate a monthly premium in JPY (just a realistic number based on age/gender/risks).
      2. Provide a "Plan Name" that sounds professional.
      3. Provide a brief analysis of why this plan is suitable for them in 3 languages${concerns ? ', specifically addressing their concerns' : ''}.
      4. Create a visual prompt showing a happy person of that age/gender enjoying life protected by insurance.
      5. ${JP_FORMAT_INSTRUCTION}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            monthlyPremium: { type: Type.NUMBER },
            planName: {
               type: Type.OBJECT,
               properties: { cn: { type: Type.STRING }, en: { type: Type.STRING }, jp: { type: Type.STRING } },
               required: ["cn", "en", "jp"]
            },
            analysis: {
               type: Type.OBJECT,
               properties: { cn: { type: Type.STRING }, en: { type: Type.STRING }, jp: { type: Type.STRING } },
               required: ["cn", "en", "jp"]
            },
            visualPrompt: { type: Type.STRING }
          }
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return data as SimulationResult;
   } catch (e) {
     console.error(e);
     throw e;
   }
}

// --- 3. Claim Assessment ---

export const assessClaim = async (incident: string, policy: Policy): Promise<ClaimResult> => {
   try {
    const prompt = `
      User reported an insurance incident: "${incident}".
      
      The user holds this policy:
      - Product: ${policy.productName.en}
      - Plan: ${policy.planName.en}
      - Premium: ${policy.premium} JPY
      - Period: ${policy.period}
      
      Act as a strict but fair claims adjuster AI.
      
      Determine the status based on these rules:
      - APPROVED: The incident is clearly covered by the policy logic.
      - DENIED: The incident is clearly NOT covered (e.g., claiming for car accident on life insurance, or intentional damage).
      - NEED_MORE_INFO: The description is too vague (e.g., "I got hurt" without details) or requires documents (police report, medical cert).
      - UNDER_REVIEW: The claim looks valid but is complex and needs manual human review (e.g., high value claims).

      1. Determine status (APPROVED, DENIED, UNDER_REVIEW, NEED_MORE_INFO).
      2. Provide a Title for the result.
      3. Explanation of the decision.
      4. Next steps for the user (e.g., "Upload Police Report", "Wait for bank transfer").
      5. ${JP_FORMAT_INSTRUCTION}
      6. Return content in CN, EN, JP.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ["APPROVED", "DENIED", "UNDER_REVIEW", "NEED_MORE_INFO"] },
            title: {
               type: Type.OBJECT,
               properties: { cn: { type: Type.STRING }, en: { type: Type.STRING }, jp: { type: Type.STRING } },
               required: ["cn", "en", "jp"]
            },
            explanation: {
               type: Type.OBJECT,
               properties: { cn: { type: Type.STRING }, en: { type: Type.STRING }, jp: { type: Type.STRING } },
               required: ["cn", "en", "jp"]
            },
            nextSteps: {
               type: Type.OBJECT,
               properties: { cn: { type: Type.STRING }, en: { type: Type.STRING }, jp: { type: Type.STRING } },
               required: ["cn", "en", "jp"]
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return data as ClaimResult;
   } catch (e) {
     console.error(e);
     throw e;
   }
}

// --- 4. Visual Aid Generation ---

export const generateVisualAid = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt + " , educational style, clear illustration, high quality, soft colors" }] },
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Visual Aid Error:", error);
    return "https://placehold.co/600x400?text=Visual+Generation+Failed";
  }
};

// --- 5. Text-to-Speech (TTS) ---

export const generateSpeech = async (text: string, lang: 'cn' | 'en' | 'jp'): Promise<AudioBuffer | null> => {
  try {
    let promptText = text;
    let voiceName = 'Aoede'; 

    if (lang === 'cn') {
      promptText = `Read this Chinese text clearly and professionally: ${text}`;
      voiceName = 'Puck'; 
    } else if (lang === 'jp') {
      promptText = `Read this Japanese text naturally and politely: ${text}`;
      voiceName = 'Kore'; 
    } else {
      voiceName = 'Fenrir';
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: promptText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return null;

    // Decode base64 to Uint8Array
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Manual PCM Decoding
    // Gemini 2.5 Flash TTS outputs raw PCM data: 24kHz, 1 channel, 16-bit integer (Little Endian)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = 24000;
    const numChannels = 1;
    
    const dataInt16 = new Int16Array(bytes.buffer);
    const frameCount = dataInt16.length / numChannels;
    
    const buffer = audioContext.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
       const channelData = buffer.getChannelData(channel);
       for (let i = 0; i < frameCount; i++) {
          channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
       }
    }

    return buffer;

  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};
