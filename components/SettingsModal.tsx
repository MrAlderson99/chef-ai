import React, { useState } from 'react';
import { Button } from './Button';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  apiKey: string;
  onSaveKey: (key: string) => void;
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose, language, apiKey, onSaveKey }) => {
  const [localKey, setLocalKey] = useState(apiKey);
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-charcoal-800 border border-gold-500/30 rounded-xl w-full max-w-md p-6 shadow-2xl relative">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
            ✕
        </button>
        
        <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-2">
            ⚙️ {t.settings}
        </h2>

        <div className="mb-6">
            <label className="block text-gold-500 text-sm font-bold mb-2">
                {t.apiKeyLabel}
            </label>
            <input 
                type="password" 
                value={localKey}
                onChange={(e) => setLocalKey(e.target.value)}
                className="w-full bg-black/30 text-white border border-gray-700 rounded p-3 focus:outline-none focus:border-gold-500 font-mono text-sm"
                placeholder={t.apiKeyPlaceholder}
            />
            <p className="text-xs text-gray-500 mt-2">
                {t.apiKeyHelp}
            </p>
        </div>

        <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose} className="text-sm">
                Cancel
            </Button>
            <Button 
                onClick={() => {
                    onSaveKey(localKey);
                    onClose();
                }}
                className="text-sm"
            >
                {t.save}
            </Button>
        </div>
      </div>
    </div>
  );
};