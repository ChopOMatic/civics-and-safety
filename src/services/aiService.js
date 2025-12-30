import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateInsight(lessonTitle, moduleTitle) {
    const prompt = `
    You are a high-level legal scholar and civics educator specializing in debunking pseudolegal theories (specifically sovereign citizen ideologies).
    
    The user is currently studying the lesson: "${lessonTitle}" within the module: "${moduleTitle}".
    
    Provide a concise (2-3 sentences), authoritative "Deep Dive Analysis" that connects this lesson to actual U.S. jurisprudence. 
    Focus on WHY the pseudo-legal arguments (like the right to travel, the 1871 Organic Act, or the Strawman theory) fail in court.
    Use terms like "police power," "territorial jurisdiction," "statutory definition," and cite real concepts from Constitutional Law.
    
    Maintain a respectful, educational, but firm tone. Do not use placeholders.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return {
            text: response.text(),
            status: 'success'
        };
    } catch (error) {
        console.error("AI Generation Error:", error);
        return {
            text: "Jurisprudential analysis unavailable. Please refer to the core lesson content for factual guidance.",
            status: 'fallback'
        };
    }
}
