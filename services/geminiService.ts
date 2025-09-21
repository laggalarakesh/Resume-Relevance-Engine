
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    relevanceScore: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 representing how well the resume matches the job description.",
    },
    verdict: {
      type: Type.STRING,
      description: "A verdict of 'High Suitability', 'Medium Suitability', or 'Low Suitability'.",
    },
    matchedSkills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of key skills from the job description that are successfully found in the resume."
    },
    missingSkills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of key skills from the job description that are missing from the resume.",
    },
    missingProjects: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of project types or experiences mentioned in the JD that are absent in the resume.",
    },
    missingCertifications: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of relevant certifications from the JD that are not found in the resume.",
    },
    improvementSuggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Actionable suggestions for the candidate to improve their resume for this specific role.",
    },
  },
  required: ["relevanceScore", "verdict", "matchedSkills", "missingSkills", "missingProjects", "missingCertifications", "improvementSuggestions"],
};

export const analyzeResume = async (jobDescription: string, resumeText: string): Promise<AnalysisResult> => {
  const prompt = `
    As an expert HR Tech Analyst, analyze the provided resume against the job description.
    Provide a detailed analysis based on skills, experience, projects, and overall semantic fit.
    
    Job Description:
    ---
    ${jobDescription}
    ---
    
    Resume Text:
    ---
    ${resumeText}
    ---
    
    Calculate a relevance score from 0-100.
    Provide a suitability verdict (High, Medium, or Low).
    Identify and list the key skills that are present in BOTH the job description and the resume.
    Identify missing skills, project types, and certifications mentioned in the job description but not in the resume.
    Offer specific, constructive suggestions for how the candidate can improve their resume to better match this job description.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const parsedResult: AnalysisResult = JSON.parse(jsonText);
    return parsedResult;

  } catch (error) {
    console.error("Gemini API call failed:", error);
    // Re-throw the original error so the UI layer can inspect its message
    throw error;
  }
};