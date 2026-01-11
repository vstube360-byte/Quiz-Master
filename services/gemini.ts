import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuizQuestion = async (topic: string, difficulty: string, previousQuestions: string[] = []): Promise<QuizQuestion> => {
  const model = "gemini-3-flash-preview";

  const difficultyPrompt = difficulty === 'Mixed' 
    ? "The difficulty can be random (Easy, Medium, or Hard)." 
    : `The difficulty level must be specifically "${difficulty}".`;

  // Provide the last 15 questions to ensure variety without overloading context
  const historyContext = previousQuestions.length > 0
    ? `\nIMPORTANT: Do not repeat or rephrase any of the following previously asked questions:\n- ${previousQuestions.join("\n- ")}\n`
    : "";

  const prompt = `Generate a single multiple-choice question about "${topic}".
  ${difficultyPrompt}
  ${historyContext}
  The question should be engaging and educational.
  
  IMPORTANT FORMATTING INSTRUCTIONS:
  - If the question involves mathematics, physics, or chemistry formulas, YOU MUST use LaTeX formatting.
  - Use single dollar signs ($) for inline math (e.g. $E=mc^2$ or $\\frac{1}{2}$).
  - Use double dollar signs ($$) for block/display equations.
  - Do NOT use markdown code blocks for math.

  Provide 4 distinct options.
  Indicate the correct answer index (0-3).
  Provide a brief, helpful explanation for why the answer is correct (use LaTeX here too if needed).
  Provide a subtle hint that helps the user deduce the answer without explicitly stating it.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: {
              type: Type.STRING,
              description: "The text of the question"
            },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "An array of exactly 4 possible answers"
            },
            correctAnswerIndex: {
              type: Type.INTEGER,
              description: "The zero-based index of the correct option (0, 1, 2, or 3)"
            },
            explanation: {
              type: Type.STRING,
              description: "A short explanation of the correct answer"
            },
            hint: {
              type: Type.STRING,
              description: "A subtle hint that points towards the right answer without giving it away"
            },
            difficulty: {
              type: Type.STRING,
              description: "The difficulty level: Easy, Medium, or Hard"
            }
          },
          required: ["question", "options", "correctAnswerIndex", "explanation", "difficulty", "hint"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini");
    }

    const data = JSON.parse(text) as QuizQuestion;
    
    // Validate options length just in case
    if (!data.options || data.options.length !== 4) {
       throw new Error("Invalid number of options returned");
    }

    return data;

  } catch (error) {
    console.error("Error generating question:", error);
    throw error;
  }
};

export const generateTrendingTopics = async (): Promise<{ label: string; category: string }[]> => {
  const model = "gemini-3-flash-preview";
  // Prompt for currently trending or popular topics
  const prompt = `Generate 4 distinct, currently trending or universally popular quiz topics.
  Focus on a mix of current events, pop culture (movies, music), technology trends, and engaging history/science.
  Return a JSON array where each object has a 'label' (max 3 words, e.g. "Artificial Intelligence", "Oscars 2024", "Ancient Rome") and a 'category' (one of: 'Science', 'History', 'Technology', 'Entertainment', 'Sports', 'Geography', 'Arts', 'Literature').`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["label", "category"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as { label: string; category: string }[];
  } catch (error) {
    console.error("Error fetching trending topics:", error);
    // Return empty to let frontend handle fallback if needed
    return [];
  }
};