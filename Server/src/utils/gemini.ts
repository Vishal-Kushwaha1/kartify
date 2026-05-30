import {GoogleGenAI} from "@google/genai"
import {ApiError} from "./ApiError.js";

const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY!})


export const geminiModel = async (prompt: string)=>{
    try {
        const response =await genAI.models.generateContent({model: "gemini-2.5-flash", contents: prompt})
        return response.text
    }catch (e){
        console.error("Gemini API Error Detail:", e);
        throw new ApiError(500, "Failed to generate content", [e])
    }
}