import React, { useState } from 'react';
import { Recipe, Language } from '../types';
import { NutritionRadial } from './NutritionRadial';
import { Button } from './Button';
import { TRANSLATIONS } from '../constants';

interface Props {
  recipe: Recipe;
  onReset: () => void;
  language: Language;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const RecipeDisplay: React.FC<Props> = ({ recipe, onReset, language, isFavorite, onToggleFavorite }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'cooking'>('details');
  const [currentStep, setCurrentStep] = useState(0);
  const t = TRANSLATIONS[language];

  const handleNextStep = () => {
    if (currentStep < recipe.instructions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Button variant="outline" onClick={onReset} className="text-sm px-4 py-2">
            &larr; {t.newOrder}
        </Button>
        <div className="flex gap-2">
            <button 
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 font-serif ${activeTab === 'details' ? 'text-gold-500 border-b-2 border-gold-500' : 'text-gray-400 hover:text-white'}`}
            >
                {t.theMenu}
            </button>
            <button 
                onClick={() => setActiveTab('cooking')}
                className={`px-4 py-2 font-serif ${activeTab === 'cooking' ? 'text-gold-500 border-b-2 border-gold-500' : 'text-gray-400 hover:text-white'}`}
            >
                {t.cookingMode}
            </button>
        </div>
      </div>

      <div className="bg-charcoal-900 border border-gold-500/20 rounded-xl p-8 shadow-2xl relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        {/* Title and Favorite Row */}
        <div className="flex justify-between items-start mb-2 relative z-10">
            <h2 className="text-4xl md:text-5xl font-serif text-gold-400 leading-tight pr-4">{recipe.title}</h2>
            <button 
                onClick={onToggleFavorite}
                className="group p-2 rounded-full hover:bg-white/5 transition-all"
                title={isFavorite ? "Remove from Loved Ones" : "Add to Loved Ones"}
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill={isFavorite ? "#D4AF37" : "none"} 
                    stroke={isFavorite ? "#D4AF37" : "#6B7280"} 
                    className="w-8 h-8 transition-transform duration-300 group-hover:scale-110"
                    strokeWidth="1.5"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
            </button>
        </div>
        
        <p className="text-gray-400 italic mb-6 font-serif text-lg">{recipe.description}</p>
        
        {/* Meta Data */}
        <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-300">
            <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                ⏱ {t.prep}: {recipe.prepTime}
            </span>
            <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                🔥 {t.cook}: {recipe.cookTime}
            </span>
            <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                👨‍🍳 {t.difficulty}: {recipe.difficulty}
            </span>
        </div>

        {activeTab === 'details' ? (
            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Col: Ingredients */}
                <div>
                    <h3 className="text-2xl font-serif text-white mb-4 border-b border-gold-500/30 pb-2 inline-block">{t.ingredients}</h3>
                    <ul className="space-y-3">
                        {recipe.ingredients.map((ing, idx) => (
                            <li key={idx} className="flex justify-between items-center text-gray-300 border-b border-gray-800 pb-2 last:border-0">
                                <span>{ing.name}</span>
                                <span className="text-gold-500 font-mono text-sm">{ing.amount}</span>
                            </li>
                        ))}
                    </ul>
                    
                    <div className="mt-8 bg-gold-500/10 p-4 rounded-lg border border-gold-500/20">
                        <h4 className="text-gold-400 font-bold mb-2 text-sm uppercase tracking-widest">{t.chefNotes}</h4>
                        <p className="text-gray-300 text-sm italic">"{recipe.chefNotes}"</p>
                    </div>
                </div>

                {/* Right Col: Nutrition & Overview */}
                <div className="flex flex-col gap-6">
                    <NutritionRadial data={recipe.nutrition} language={language} />
                    
                    <div>
                        <h3 className="text-2xl font-serif text-white mb-4">{t.summary}</h3>
                        <p className="text-gray-400 leading-relaxed">
                            {t.summaryText}
                        </p>
                    </div>
                    <Button onClick={() => setActiveTab('cooking')} className="w-full mt-auto">
                        {t.startCooking}
                    </Button>
                </div>
            </div>
        ) : (
            // Cooking Mode
            <div className="flex flex-col h-full min-h-[400px]">
                <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
                    <span className="text-gold-500 font-bold tracking-widest uppercase mb-4">{t.step} {currentStep + 1} / {recipe.instructions.length}</span>
                    <h3 className="text-2xl md:text-3xl font-serif text-white leading-tight mb-6">
                        {recipe.instructions[currentStep].instruction}
                    </h3>
                    {recipe.instructions[currentStep].duration && (
                        <div className="text-xl text-gray-400 font-mono bg-black/30 px-4 py-2 rounded">
                            ⏳ {recipe.instructions[currentStep].duration}
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
                    <Button 
                        variant="secondary" 
                        onClick={handlePrevStep} 
                        disabled={currentStep === 0}
                    >
                        {t.previous}
                    </Button>
                    <div className="flex gap-1">
                        {recipe.instructions.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`h-1 w-6 rounded-full transition-all ${idx === currentStep ? 'bg-gold-500' : 'bg-gray-700'}`}
                            />
                        ))}
                    </div>
                    <Button 
                        variant={currentStep === recipe.instructions.length - 1 ? "outline" : "primary"}
                        onClick={handleNextStep}
                        disabled={currentStep === recipe.instructions.length - 1}
                    >
                        {currentStep === recipe.instructions.length - 1 ? t.bonAppetit : t.nextStep}
                    </Button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};