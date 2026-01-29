export interface Ingredient {
  name: string;
  amount: string;
}

export interface Step {
  stepNumber: number;
  instruction: string;
  duration?: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Michelin Star';
  ingredients: Ingredient[];
  instructions: Step[];
  nutrition: Nutrition;
  chefNotes: string;
}

export enum DietType {
  NONE = "Standard",
  VEGAN = "Vegan",
  VEGETARIAN = "Vegetarian",
  KETO = "Keto",
  GLUTEN_FREE = "Gluten Free",
  PALEO = "Paleo"
}

export type LoadingState = 'idle' | 'analyzing_image' | 'generating_recipe' | 'complete' | 'error';

export type Language = 'en' | 'pt';