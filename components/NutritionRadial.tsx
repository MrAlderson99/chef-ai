import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Nutrition, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface Props {
  data: Nutrition;
  language: Language;
}

export const NutritionRadial: React.FC<Props> = ({ data, language }) => {
  const t = TRANSLATIONS[language];

  const chartData = [
    { name: t.protein, value: data.protein, color: '#D4AF37' }, // Gold
    { name: t.carbs, value: data.carbs, color: '#A0A0A0' },   // Silver/Grey
    { name: t.fat, value: data.fat, color: '#CD7F32' },       // Bronze
  ];

  return (
    <div className="w-full h-64 bg-charcoal-800/50 p-4 rounded-lg border border-white/5">
        <h4 className="text-center font-serif text-gold-400 mb-2">{t.nutritionTitle}</h4>
        <div className="text-center text-xs text-gray-400 mb-2">{data.calories} kcal</div>
        <ResponsiveContainer width="100%" height="80%">
        <PieChart>
            <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
            >
            {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            </Pie>
            <Tooltip 
                contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
        </ResponsiveContainer>
    </div>
  );
};