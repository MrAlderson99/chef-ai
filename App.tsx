import React, { useState, useEffect } from 'react';
import { generateRecipeFromIngredients } from './services/geminiService';
import { Recipe, LoadingState, DietType, Language } from './types';
import { RecipeDisplay } from './components/RecipeDisplay';
import { FavoritesList } from './components/FavoritesList';
import { SettingsModal } from './components/SettingsModal';
import { Button } from './components/Button';
import { DIET_OPTIONS, TRANSLATIONS, DIET_LABELS } from './constants';

export default function App() {
  const [ingredients, setIngredients] = useState('');
  const [diet, setDiet] = useState<string>(DietType.NONE);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  // API Key Management
  const [apiKey, setApiKey] = useState(process.env.API_KEY || '');
  const [showSettings, setShowSettings] = useState(false);

  // Favorites System
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  // Load data from local storage
  useEffect(() => {
    const saved = localStorage.getItem('chef_gourmet_favorites');
    if (saved) {
        try {
            setSavedRecipes(JSON.parse(saved));
        } catch (e) {
            console.error("Failed to parse favorites", e);
        }
    }
    
    // Check local storage for API key override (useful for GH Pages)
    const storedKey = localStorage.getItem('chef_gourmet_api_key');
    if (storedKey) {
        setApiKey(storedKey);
    }
  }, []);

  // Save favorites to local storage
  useEffect(() => {
    localStorage.setItem('chef_gourmet_favorites', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('chef_gourmet_api_key', key);
  };

  const t = TRANSLATIONS[language];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'pt' : 'en');
  };

  const handleSubmit = async () => {
    if (!apiKey) {
        setShowSettings(true);
        setError(language === 'pt' ? "Por favor, configure sua chave API." : "Please configure your API Key.");
        return;
    }

    if (!ingredients && !selectedFile) {
        setError(t.errorMissing);
        return;
    }

    setShowFavorites(false);
    setLoadingState('analyzing_image'); 
    setError(null);

    try {
      const generatedRecipe = await generateRecipeFromIngredients(
        ingredients, 
        diet, 
        language, 
        apiKey,
        selectedFile || undefined
      );
      setRecipe(generatedRecipe);
      setLoadingState('complete');
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred in the kitchen.");
      setLoadingState('error');
    }
  };

  const reset = () => {
    setRecipe(null);
    setIngredients('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setLoadingState('idle');
    setError(null);
    setShowFavorites(false);
  };

  const toggleFavorite = () => {
    if (!recipe) return;

    const exists = savedRecipes.find(r => r.id === recipe.id);
    if (exists) {
        setSavedRecipes(prev => prev.filter(r => r.id !== recipe.id));
    } else {
        setSavedRecipes(prev => [...prev, recipe]);
    }
  };

  const removeFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedRecipes(prev => prev.filter(r => r.id !== id));
  };

  const selectFavorite = (favRecipe: Recipe) => {
    setRecipe(favRecipe);
    setShowFavorites(false);
    setLoadingState('complete');
  };

  const isCurrentRecipeFavorite = recipe ? savedRecipes.some(r => r.id === recipe.id) : false;

  return (
    <div className="min-h-screen bg-charcoal-900 text-gray-100 font-sans selection:bg-gold-500 selection:text-black">
      
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        language={language}
        apiKey={apiKey}
        onSaveKey={handleSaveKey}
      />

      {/* Navbar */}
      <nav className="w-full border-b border-white/5 bg-charcoal-900/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 
                className="text-2xl font-serif font-bold text-gold-500 tracking-wider flex items-center gap-2 cursor-pointer"
                onClick={reset}
            >
                👨‍🍳 {t.navTitle}
            </h1>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowSettings(true)}
                className="text-gray-400 hover:text-white transition-colors"
                title={t.settings}
              >
                ⚙️
              </button>
              <button 
                onClick={() => setShowFavorites(!showFavorites)}
                className={`text-sm font-medium transition-colors ${showFavorites ? 'text-gold-500' : 'text-gray-400 hover:text-white'}`}
              >
                ♥ {t.myLovedOnes}
              </button>
              <div className="h-4 w-px bg-gray-700 hidden sm:block"></div>
              <button 
                onClick={toggleLanguage}
                className="px-3 py-1 rounded border border-gold-500/50 text-gold-500 text-xs font-bold hover:bg-gold-500/10 transition-colors"
              >
                {t.langToggle}
              </button>
            </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {showFavorites ? (
            <FavoritesList 
                recipes={savedRecipes} 
                onSelectRecipe={selectFavorite} 
                onRemoveRecipe={removeFavorite}
                language={language}
            />
        ) : (
            <>
                {(loadingState === 'idle' || loadingState === 'error') ? (
                    <div className="flex flex-col items-center max-w-2xl mx-auto">
                        {/* Hero Section */}
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4 leading-tight">
                                {t.heroTitlePart1} <span className="text-gold-500 italic">{t.heroTitlePart2}</span> {t.heroTitlePart3}
                            </h2>
                            <p className="text-gray-400 text-lg">
                                {t.heroSubtitle}
                            </p>
                        </div>

                        {/* Input Card */}
                        <div className="w-full bg-charcoal-800 p-8 rounded-2xl border border-white/5 shadow-2xl">
                            
                            {/* File Upload */}
                            <div className="mb-6">
                                <label className="block text-gold-500 text-sm font-bold mb-2 uppercase tracking-wide">
                                    {t.visualInspection}
                                </label>
                                <div className="relative group cursor-pointer">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${previewUrl ? 'border-gold-500 bg-black/50' : 'border-gray-700 hover:border-gold-500/50 bg-black/20'}`}>
                                        {previewUrl ? (
                                            <div className="relative h-48 w-full">
                                                <img src={previewUrl} alt="Preview" className="h-full w-full object-contain" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-white font-medium">{t.uploadPlaceholderActive}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-gray-400">
                                                <svg className="w-12 h-12 mb-3 text-gray-600 group-hover:text-gold-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <p>{t.uploadPlaceholder}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Text Input */}
                            <div className="mb-6">
                                <label className="block text-gold-500 text-sm font-bold mb-2 uppercase tracking-wide">
                                    {t.ingredientsNotes}
                                </label>
                                <textarea
                                    className="w-full bg-black/30 text-white border border-gray-700 rounded-lg p-4 focus:outline-none focus:border-gold-500 transition-colors resize-none h-32 placeholder-gray-600"
                                    placeholder={t.ingredientsPlaceholder}
                                    value={ingredients}
                                    onChange={(e) => setIngredients(e.target.value)}
                                />
                            </div>

                            {/* Diet Select */}
                            <div className="mb-8">
                                <label className="block text-gold-500 text-sm font-bold mb-2 uppercase tracking-wide">
                                    {t.dietaryPreferences}
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {DIET_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setDiet(opt.value)}
                                            className={`py-2 px-3 rounded text-sm transition-all ${diet === opt.value ? 'bg-gold-500 text-black font-bold' : 'bg-black/40 text-gray-400 hover:bg-black/60'}`}
                                        >
                                            {DIET_LABELS[language][opt.value]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded text-red-200 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <Button 
                                className="w-full text-lg shadow-lg" 
                                onClick={handleSubmit}
                            >
                                {t.askChef}
                            </Button>
                        </div>
                    </div>
                ) : loadingState !== 'complete' ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh]">
                        <div className="relative">
                            <div className="w-24 h-24 border-t-4 border-b-4 border-gold-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl">👨‍🍳</span>
                            </div>
                        </div>
                        <h3 className="mt-8 text-2xl font-serif text-white animate-pulse">{t.thinking}</h3>
                        <p className="mt-2 text-gray-400">{t.analyzing}</p>
                    </div>
                ) : (
                    recipe && (
                        <RecipeDisplay 
                            recipe={recipe} 
                            onReset={reset} 
                            language={language}
                            isFavorite={isCurrentRecipeFavorite}
                            onToggleFavorite={toggleFavorite}
                        />
                    )
                )}
            </>
        )}

      </main>
    </div>
  );
}