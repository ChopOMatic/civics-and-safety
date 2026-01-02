import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateInsight(lessonTitle, moduleTitle) {
    const prompt = `
    You are a patient, logic-based civics educator specializing in helping individuals reconcile pseudolegal theories with established U.S. jurisprudence.
    
    The user is currently studying the lesson: "${lessonTitle}" within the module: "${moduleTitle}".
    
    Provide a concise (2-3 sentences) "Legal Reality Check" that uses careful logic to bridge the gap between common misinterpretations and actual law. 
    
    Guidelines:
    1. DO NOT be confrontational or dismissive.
    2. Use logical deconstruction (e.g., "While it is true that X, the legal application of Y requires Z because...").
    3. Focus on established principles like the Police Power, Territorial Jurisdiction, and the Supremacy Clause.
    4. Help the student see the internal logical consistency of the actual legal system.
    
    Tone: Patient, educational, authoritative but helpful.
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
            text: "Logical analysis unavailable. Please refer to the core lesson content for factual guidance on established legal principles.",
            status: 'fallback'
        };
    }
}
