import { GoogleGenAI } from "@google/genai";

// Initialize the client
// Note: API key must be provided via environment variable in a real app.
// For this demo, we assume process.env.API_KEY is populated.
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

export const generatePlanContent = async (
  topic: string, 
  templateType: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const prompt = `
    أنت مساعد تخطيط ذكي. قم بإنشاء خطة تفصيلية ومنظمة بتنسيق Markdown للموضوع التالي: "${topic}".
    نوع التخطيط المطلوب: ${templateType}.
    
    الرجاء استخدام:
    - عناوين واضحة (##).
    - قوائم نقاط (-).
    - مربعات اختيار للمهام (- [ ]).
    - جداول إذا لزم الأمر.
    - اجعل اللغة عربية فصحى واضحة ومشجعة.
    - لا تضف أي مقدمات أو خاتمات خارج محتوى الخطة.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "عذراً، لم أتمكن من إنشاء الخطة. حاول مرة أخرى.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};