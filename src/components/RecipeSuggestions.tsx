import { useState, useMemo } from 'react';
import { RECIPES, type Recipe } from '../data/recipes';
import { type FoodItem } from '../db';
import { getExpiryStatus, StatusBadge } from './StatusBadge';

interface RecipeSuggestionsProps {
  activeItems: FoodItem[];
  isPremium: boolean;
  onUpgrade: () => void;
}

export function RecipeSuggestions({ activeItems, isPremium, onUpgrade }: RecipeSuggestionsProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const expiringItems = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const todayItems: FoodItem[] = [];
    const tomorrowItems: FoodItem[] = [];
    const weekItems: FoodItem[] = [];

    activeItems.forEach(item => {
      if (!item.expiryDate) return;
      
      const status = getExpiryStatus(item.expiryDate);
      if (status === 'expired') return; // Don't suggest recipes for expired food? 
      // Actually "Use It Up" should probably include "urgent" (today) and "soon" (3 days).

      if (item.expiryDate === today) {
        todayItems.push(item);
      } else if (item.expiryDate === tomorrowStr) {
        tomorrowItems.push(item);
      } else if (status === 'soon' || status === 'urgent') {
        weekItems.push(item);
      }
    });

    return { todayItems, tomorrowItems, weekItems };
  }, [activeItems]);

  const allExpiringItems = [...expiringItems.todayItems, ...expiringItems.tomorrowItems, ...expiringItems.weekItems];

  const suggestedRecipes = useMemo(() => {
    if (allExpiringItems.length === 0) return [];

    const expiringNames = allExpiringItems.map(i => i.name.toLowerCase());
    
    // Find recipes that use at least one expiring item
    return RECIPES.filter(recipe => 
      recipe.ingredients.some(ing => 
        expiringNames.some(expName => expName.includes(ing.toLowerCase()) || ing.toLowerCase().includes(expName))
      )
    ).slice(0, 15); // Limit to 15 suggestions
  }, [allExpiringItems]);

  if (!isPremium) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-4xl shadow-inner">
          👩‍🍳
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-800">Unlock "Use It Up" Recipes</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Get personalized recipe recommendations based on ingredients about to expire in your pantry. Stop wasting food and money!
          </p>
        </div>
        
        <div className="w-full space-y-3 pt-2">
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-3 text-left">
            <span className="text-xl">✅</span>
            <div>
              <p className="text-sm font-bold text-gray-800">Smart Matching</p>
              <p className="text-xs text-gray-500">We find recipes using your specific expiring items.</p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-3 text-left">
            <span className="text-xl">✅</span>
            <div>
              <p className="text-sm font-bold text-gray-800">Waste Reduction</p>
              <p className="text-xs text-gray-500">Turn potential waste into delicious meals.</p>
            </div>
          </div>
        </div>

        <button
          onClick={onUpgrade}
          className="w-full rounded-xl bg-coral-500 py-4 text-sm font-bold text-white shadow-lg shadow-coral-500/20 active:scale-95 transition-all"
        >
          Upgrade to Premium
        </button>
      </div>
    );
  }

  if (allExpiringItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
        <div className="text-5xl">✨</div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-gray-800">Your pantry is fresh!</h2>
          <p className="text-sm text-gray-400">No items are expiring in the next 3 days. Check back later for recipe ideas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Expiring Food Summary */}
      <div className="px-4 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Items to use soon</h2>
        
        {expiringItems.todayItems.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-red-500 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              Expiring Today
            </h3>
            <div className="flex flex-wrap gap-2">
              {expiringItems.todayItems.map(item => (
                <span key={item.id} className="px-3 py-1.5 bg-white border border-red-100 rounded-lg text-xs font-medium text-gray-700 shadow-sm">
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {expiringItems.tomorrowItems.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-orange-500 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              Expiring Tomorrow
            </h3>
            <div className="flex flex-wrap gap-2">
              {expiringItems.tomorrowItems.map(item => (
                <span key={item.id} className="px-3 py-1.5 bg-white border border-orange-100 rounded-lg text-xs font-medium text-gray-700 shadow-sm">
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {expiringItems.weekItems.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-yellow-600 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
              Expiring within 3 days
            </h3>
            <div className="flex flex-wrap gap-2">
              {expiringItems.weekItems.map(item => (
                <span key={item.id} className="px-3 py-1.5 bg-white border border-yellow-100 rounded-lg text-xs font-medium text-gray-700 shadow-sm">
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suggested Recipes */}
      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Suggested Recipes</h2>
          <span className="text-[10px] font-bold text-fresh-600 bg-fresh-50 px-2 py-0.5 rounded-full">Premium AI</span>
        </div>

        {suggestedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {suggestedRecipes.map(recipe => (
              <button
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="flex items-center gap-4 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm hover:border-fresh-200 transition-all text-left active:scale-[0.98]"
              >
                <div className="w-16 h-16 bg-fresh-50 rounded-xl flex items-center justify-center text-3xl">
                  {recipe.imageEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-sm truncate">{recipe.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      ⏱️ {recipe.cookTime}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      recipe.difficulty === 'Easy' ? 'text-green-600 bg-green-50' : 
                      recipe.difficulty === 'Medium' ? 'text-amber-600 bg-amber-50' : 
                      'text-red-600 bg-red-50'
                    }`}>
                      {recipe.difficulty}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {recipe.ingredients.slice(0, 3).map(ing => {
                      const isExpiring = allExpiringItems.some(i => 
                        i.name.toLowerCase().includes(ing.toLowerCase()) || ing.toLowerCase().includes(i.name.toLowerCase())
                      );
                      return (
                        <span key={ing} className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${
                          isExpiring ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {ing}
                        </span>
                      );
                    })}
                    {recipe.ingredients.length > 3 && (
                      <span className="text-[8px] text-gray-400 font-bold">+{recipe.ingredients.length - 3} more</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-gray-200 p-8 rounded-2xl text-center">
            <p className="text-sm text-gray-400">No specific recipes found for your expiring items. Try adding more variety to your pantry!</p>
          </div>
        )}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4" onClick={() => setSelectedRecipe(null)}>
          <div 
            className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-48 bg-gradient-to-br from-fresh-50 to-fresh-100 flex items-center justify-center text-8xl">
              {selectedRecipe.imageEmoji}
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedRecipe.difficulty === 'Easy' ? 'text-green-700 bg-green-100' : 
                      selectedRecipe.difficulty === 'Medium' ? 'text-amber-700 bg-amber-100' : 
                      'text-red-700 bg-red-100'
                    }`}>
                      {selectedRecipe.difficulty}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">⏱️ {selectedRecipe.cookTime} cook time</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedRecipe.name}</h2>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Ingredients</h3>
                <ul className="grid grid-cols-1 gap-2">
                  {selectedRecipe.ingredients.map(ing => {
                    const isExpiring = allExpiringItems.find(i => 
                      i.name.toLowerCase().includes(ing.toLowerCase()) || ing.toLowerCase().includes(i.name.toLowerCase())
                    );
                    return (
                      <li key={ing} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-sm text-gray-700 font-medium">{ing}</span>
                        {isExpiring && (
                          <StatusBadge status={getExpiryStatus(isExpiring.expiryDate)} />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Instructions</h3>
                <ol className="space-y-4">
                  {selectedRecipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-4">
                      <span className="flex-shrink-0 w-6 h-6 bg-fresh-100 text-fresh-700 rounded-full flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {selectedRecipe.link && (
                <a 
                  href={selectedRecipe.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full text-center py-4 text-fresh-600 font-bold text-sm border-2 border-fresh-100 rounded-xl hover:bg-fresh-50 transition-colors"
                >
                  View Full Recipe Details
                </a>
              )}
            </div>
            
            <div className="p-6 pt-0">
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="w-full py-4 bg-fresh-500 text-white rounded-2xl font-bold shadow-lg shadow-fresh-500/20 active:scale-95 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
