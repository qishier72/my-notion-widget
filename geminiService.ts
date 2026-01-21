
import { GoogleGenAI } from "@google/genai";
import { Quote } from "./types";

export const generateAIQuote = async (): Promise<Quote | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "请生成一个富有哲理、治愈且充满力量的短句子，字数在30字以内。返回格式为 JSON: { \"text\": \"句子内容\", \"author\": \"作者名或\'匿名\'\" }。确保只返回JSON字符串。",
      config: {
        responseMimeType: "application/json"
      }
    });

    const data = JSON.parse(response.text || '{}');
    if (data.text && data.author) {
      return { text: data.text, author: data.author };
    }
    return null;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
