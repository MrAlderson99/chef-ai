import React from 'react';
import { Recipe, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Button } from './Button';

interface Props {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onRemoveRecipe: (id: string, e: React.MouseEvent) => void;
  language: Language;
}

export const FavoritesList: React.FC<Props> = ({ recipes, onSelectRecipe, onRemoveRecipe, language }) => {
  const t = TRANSLATIONS[language];

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-24 h-24 text-gray-700 mb-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        <h3 className="text-2xl font-serif text-white mb-2">{t.myLovedOnes}</h3>
        <p className="text-gray-400 max-w-sm">{t.noFavorites}</p>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in">
      <h2 className="text-3xl font-serif text-gold-500 mb-8 flex items-center gap-2">
        <span className="text-4xl">♥</span> {t.myLovedOnes}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div 
            key={recipe.id} 
            className="group bg-charcoal-800 border border-white/5 rounded-xl overflow-hidden hover:border-gold-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] flex flex-col"
          >
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-serif text-white group-hover:text-gold-400 transition-colors line-clamp-2">
                  {recipe.title}
                </h3>
              </div>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3 italic">
                {recipe.description}
              </p>
              
              <div className="mt-auto flex flex-wrap gap-2 text-xs text-gray-500 font-mono mb-6">
                <span className="bg-black/30 px-2 py-1 rounded">{recipe.prepTime}</span>
                <span className="bg-black/30 px-2 py-1 rounded">{recipe.difficulty}</span>
              </div>

              <div className="flex gap-3">
                <Button 
                    className="flex-1 text-sm py-2" 
                    onClick={() => onSelectRecipe(recipe)}
                >
                    {t.viewRecipe}
                </Button>
                <button 
                    onClick={(e) => onRemoveRecipe(recipe.id, e)}
                    className="p-2 border border-red-900/50 rounded hover:bg-red-900/20 text-red-700 hover:text-red-500 transition-colors"
                    title={t.remove}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};