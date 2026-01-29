import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, Language } from "../types";

// Helper to clean Markdown code blocks if model returns raw string
const cleanJsonString = (str: string): string => {
  let clean = str.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json/, '').replace(/```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```/, '').replace(/```$/, '');
  }
  return clean;
};

// Simple ID generator
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export const generateRecipeFromIngredients = async (
  ingredients: string,
  diet: string,
  language: Language,
  apiKey: string,
  imageFile?: File
): Promise<Recipe> => {
  if (!apiKey) {
    throw new Error(language === 'pt' ? "Chave de API ausente." : "API Key is missing.");
  }
  
  const ai = new GoogleGenAI({ apiKey: apiKey });

  const langInstruction = language === 'pt' ? "Portuguese (Brazil)" : "English";

  const systemPrompt = `You are a world-renowned Michelin-star chef, known for creativity and elegance. 
  Create a gourmet recipe based on the provided ingredients. 
  The recipe should adhere to the '${diet}' diet. 
  If the ingredients are scarce, be creative and suggest a "Chef's Special" with pantry staples.
  
  IMPORTANT: The content of the recipe (Title, Description, Instructions, Ingredients, Notes) MUST be written in ${langInstruction}.
  
  Tone: Sophisticated, encouraging, and professional.`;

  // SCHEMA DEFINITION
  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      prepTime: { type: Type.STRING },
      cookTime: { type: Type.STRING },
      difficulty: { type: Type.STRING },
      ingredients: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            amount: { type: Type.STRING },
          }
        }
      },
      instructions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            stepNumber: { type: Type.INTEGER },
            instruction: { type: Type.STRING },
            duration: { type: Type.STRING },
          }
        }
      },
      nutrition: {
        type: Type.OBJECT,
        properties: {
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fat: { type: Type.NUMBER },
        }
      },
      chefNotes: { type: Type.STRING },
    },
    required: ["title", "ingredients", "instructions", "nutrition"]
  };

  try {
    let recipe: Recipe;

    if (imageFile) {
      // MULTIMODAL FLOW: Image + Text -> Gemini 2.5 Flash Image
      const base64Data = await fileToBase64(imageFile);
      
      const prompt = `
        ${systemPrompt}
        Analyze this image of ingredients/fridge contents. 
        Also consider these user notes: "${ingredients}".
        
        IMPORTANT: Return ONLY valid JSON matching this structure:
        {
          "title": "Recipe Name (${langInstruction})",
          "description": "Short appetizing description (${langInstruction})",
          "prepTime": "e.g. 15 mins",
          "cookTime": "e.g. 30 mins",
          "difficulty": "Easy/Medium/Hard",
          "ingredients": [{"name": "Item", "amount": "Qty"}],
          "instructions": [{"stepNumber": 1, "instruction": "Do this", "duration": "5 mins"}],
          "nutrition": {"calories": 500, "protein": 20, "carbs": 30, "fat": 15},
          "chefNotes": "A tip from the chef (${langInstruction})"
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { mimeType: imageFile.type, data: base64Data } },
            { text: prompt }
          ]
        }
      });

      const text = response.text || "";
      const cleanedText = cleanJsonString(text);
      recipe = JSON.parse(cleanedText) as Recipe;

    } else {
      // TEXT FLOW: Gemini 3 Flash Preview (Supports Schema)
      const prompt = `User ingredients: ${ingredients}. Diet: ${diet}. Create a full recipe in ${langInstruction}.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });
      
      const text = response.text || "{}";
      recipe = JSON.parse(text) as Recipe;
    }

    // Assign ID
    recipe.id = generateId();
    return recipe;

  } catch (error) {
    console.error("Chef AI Error:", error);
    throw new Error(language === 'pt' 
      ? "O Chef está com problemas na cozinha. Por favor, tente novamente." 
      : "The Chef is having trouble in the kitchen. Please try again.");
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};