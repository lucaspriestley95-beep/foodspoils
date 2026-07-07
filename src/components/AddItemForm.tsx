import React, { useState, useMemo, useEffect } from 'react';
import { COMMON_FOODS } from '../data/commonFoods';
import type { CommonFood } from '../data/commonFoods';
import { BarcodeScanner } from './BarcodeScanner';
import { fetchProductFromBarcode } from '../lib/openfoodfacts';
import { CategoryIcon } from './CategoryIcon';

interface AddItemFormProps {
  onSubmit: (item: {
    name: string;
    category: string;
    expiryDate: string | null;
    quantity: number;
    unit: string;
    notes?: string;
  }) => void;
  onCancel?: () => void;
  initialItem?: {
    name: string;
    category: string;
    expiryDate: string | null;
    quantity: number;
    unit: string;
    notes?: string;
  };
  initialBarcode?: string;
  isPremium?: boolean;
  className?: string;
}

const CATEGORIES = [
  { value: 'vegetables', label: 'Vegetables', icon: '🥦' },
  { value: 'fruits', label: 'Fruits', icon: '🍎' },
  { value: 'dairy', label: 'Dairy', icon: '🥛' },
  { value: 'meat', label: 'Meat', icon: '🥩' },
  { value: 'seafood', label: 'Seafood', icon: '🐟' },
  { value: 'deli', label: 'Deli', icon: '🥪' },
  { value: 'grains', label: 'Grains & Bakery', icon: '🌾' },
  { value: 'breakfast', label: 'Breakfast', icon: '🥣' },
  { value: 'canned-goods', label: 'Canned Goods', icon: '🥫' },
  { value: 'sauces-oils', label: 'Sauces & Oils', icon: '🏺' },
  { value: 'spices-herbs', label: 'Spices & Herbs', icon: '🌿' },
  { value: 'baking', label: 'Baking', icon: '🥯' },
  { value: 'international', label: 'International', icon: '🏮' },
  { value: 'beverages', label: 'Beverages', icon: '🥤' },
  { value: 'frozen', label: 'Frozen', icon: '🧊' },
  { value: 'snacks', label: 'Snacks', icon: '🍿' },
  { value: 'pantry', label: 'Pantry', icon: '📦' },
  { value: 'other', label: 'Other', icon: '📋' },
];

const UNITS = ['piece(s)', 'oz', 'lb', 'g', 'kg', 'cup', 'tbsp', 'tsp', 'fl oz', 'ml', 'L', 'box', 'can', 'jar', 'bunch', 'bag', 'pack', 'loaf', 'container', 'carton', 'gallon', 'pint'];

const getFutureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const formatDateShort = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export function AddItemForm({ onSubmit, onCancel, initialItem, initialBarcode, isPremium, className = '' }: AddItemFormProps) {
  const [name, setName] = useState(() => initialItem?.name || '');
  const [category, setCategory] = useState(() => {
    if (initialItem?.category) return initialItem.category;
    return localStorage.getItem('foodspoils_last_category') || 'produce';
  });
  const [expiryDate, setExpiryDate] = useState(() => initialItem?.expiryDate || getFutureDate(7));
  const [noExpiry, setNoExpiry] = useState(() => initialItem?.expiryDate === null);
  const [quantity, setQuantity] = useState(() => initialItem?.quantity || 1);
  const [unit, setUnit] = useState(() => initialItem?.unit || 'piece(s)');
  const [notes, setNotes] = useState(() => initialItem?.notes || '');
  const [isExpanded, setIsExpanded] = useState(!!initialItem || !!initialBarcode);
  const [activeFood, setActiveFood] = useState<CommonFood | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(!initialItem && !initialBarcode);
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  useEffect(() => {
    if (initialBarcode) {
      handleScan(initialBarcode);
    }
  }, [initialBarcode]);

  const filteredFoods = useMemo(() => {
    if (!searchQuery.length) return [];
    
    const query = searchQuery.toLowerCase();
    const startsWithMatches = COMMON_FOODS.filter(food => 
      food.name.toLowerCase().startsWith(query)
    );
    const containsMatches = COMMON_FOODS.filter(food => 
      food.name.toLowerCase().includes(query) && !food.name.toLowerCase().startsWith(query)
    );
    
    return [...startsWithMatches, ...containsMatches].slice(0, 6);
  }, [searchQuery]);

  const handleSelectFood = (food: CommonFood) => {
    setName(food.name);
    setCategory(food.category);
    setExpiryDate(getFutureDate(food.shelfLifeDays));
    
    if (food.defaultQuantity) setQuantity(food.defaultQuantity);
    if (food.defaultUnit) setUnit(food.defaultUnit);
    
    setActiveFood(food);
    setIsExpanded(true);
    setShowSearchResults(false);
  };

  const handleSelectCategory = (catValue: string) => {
    setCategory(catValue);
    
    // Auto-toggle no expiry for shelf-stable items
    const shelfStable = ['beverages', 'canned-goods', 'sauces-oils', 'spices-herbs', 'baking', 'international', 'pantry'];
    if (shelfStable.includes(catValue)) {
      setNoExpiry(true);
    } else {
      setNoExpiry(false);
    }

    setShowSearchResults(false);
  };

  const handleScan = async (barcode: string) => {
    setIsScanning(true);
    setShowScanner(false);
    
    try {
      const product = await fetchProductFromBarcode(barcode);
      
      if (product) {
        setName(product.name);
        setCategory(product.category);
        setQuantity(product.quantity);
        setUnit(product.unit);
        
        // Auto-toggle no expiry for shelf-stable items
        const shelfStable = ['beverages', 'canned-goods', 'sauces-oils', 'spices-herbs', 'baking', 'international', 'pantry'];
        if (shelfStable.includes(product.category)) {
          setNoExpiry(true);
        } else {
          setNoExpiry(false);
        }

        // Default shelf life for scanned items
        setExpiryDate(getFutureDate(7));
        setIsExpanded(true);
        setShowSearchResults(false);
      } else {
        // Smooth fallback
        setName(`Scanned: ${barcode}`);
        setIsExpanded(true);
        setShowSearchResults(false);
      }
    } catch (err) {
      console.error("Error fetching product data:", err);
      setName(`Scanned: ${barcode}`);
      setIsExpanded(true);
      setShowSearchResults(false);
    } finally {
      setIsScanning(false);
    }
  };

  const handleStartScan = () => {
    if (!isPremium) {
      alert("👑 Barcode scanning is a Premium feature. Please upgrade to unlock!");
      return;
    }
    setShowScanner(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !expiryDate) return;
    
    localStorage.setItem('foodspoils_last_category', category);
    
    onSubmit({ 
      name: name.trim(), 
      category, 
      expiryDate: noExpiry ? null : expiryDate, 
      quantity, 
      unit, 
      notes: notes.trim() || undefined 
    });
    
    if (!initialItem) {
      setName('');
      setExpiryDate(getFutureDate(7));
      setQuantity(1);
      setUnit('piece(s)');
      setNotes('');
      setShowSearchResults(true);
      setSearchQuery('');
    }
  };

  const handleQuickExpiry = (days: number) => {
    setExpiryDate(getFutureDate(days));
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = new Date().toISOString().split('T')[0];

  const quickExpiryOptions = [
    { label: 'Today', days: 0 },
    { label: 'Tomorrow', days: 1 },
    { label: '+3 Days', days: 3 },
    { label: '+1 Week', days: 7 },
    { label: '+2 Weeks', days: 14 },
    { label: '+1 Month', days: 30 },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Header - Only for new items */}
      {!initialItem && showSearchResults && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Search Common Foods
            </label>
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for Milk, Eggs, Spinach..."
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 pl-10 text-sm text-gray-100 outline-none transition-all focus:border-fresh-500 focus:bg-gray-800 focus:ring-1 focus:ring-fresh-500"
                  autoFocus
                />
                <svg className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                type="button"
                onClick={handleStartScan}
                className="flex items-center justify-center rounded-lg bg-fresh-500 px-4 text-white shadow-sm hover:bg-fresh-600 transition-all active:scale-95"
                title="Scan Barcode"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7a2 2 0 012-2h2m10 0h2a2 2 0 012 2M3 7h18M7 9v6m3-6v6m3-6v6m3-6v6m3-6v6" />
                </svg>
              </button>
            </div>
          </div>

          {searchQuery.trim() && filteredFoods.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {filteredFoods.map(food => (
                <button
                  key={food.name}
                  onClick={() => handleSelectFood(food)}
                  className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 p-3 text-left hover:border-fresh-200 hover:bg-fresh-950/30 transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{CATEGORIES.find(c => c.value === food.category)?.icon || '📦'}</span>
                    <div>
                      <div className="text-sm font-bold text-gray-100">{food.name}</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-tight">{food.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-fresh-400">+{food.shelfLifeDays} days</div>
                    <div className="text-[10px] text-gray-400">Typical</div>
                  </div>
                </button>
              ))}
              <button 
                onClick={() => { setName(searchQuery); setShowSearchResults(false); }}
                className="p-2 text-center text-xs font-semibold text-gray-400 hover:text-fresh-400"
              >
                Can't find it? Use "{searchQuery}" manually
              </button>
            </div>
          ) : !searchQuery.trim() ? (
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Or Browse Categories
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.slice(0, 9).map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleSelectCategory(cat.value)}
                    className="flex flex-col items-center gap-1 rounded-lg border border-gray-700 bg-gray-800 py-3 text-[10px] transition-all hover:bg-fresh-950/30 active:scale-95"
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-semibold text-gray-300">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
             <div className="py-8 text-center">
                <p className="text-sm text-gray-400 mb-4">No exact matches for "{searchQuery}"</p>
                <button 
                  onClick={() => { setName(searchQuery); setShowSearchResults(false); }}
                  className="rounded-full bg-fresh-500 px-6 py-2 text-sm font-bold text-white shadow-sm hover:bg-fresh-600 transition-all"
                >
                  Add "{searchQuery}" Manually
                </button>
             </div>
          )}
        </div>
      )}

      {(!showSearchResults || initialItem) && (
        <form onSubmit={handleSubmit} className="animate-slide-up space-y-4">
          {/* Name Input */}
          <div>
            <div className="flex justify-between items-end mb-1">
              <label htmlFor="item-name" className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Item Name *
              </label>
              {!initialItem && (
                <button 
                  type="button" 
                  onClick={() => setShowSearchResults(true)}
                  className="text-[10px] font-bold text-fresh-400 hover:underline"
                >
                  Back to Search
                </button>
              )}
            </div>
            <input
              id="item-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Baby spinach, Milk..."
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-gray-100 outline-none transition-all focus:border-fresh-500 focus:bg-gray-800 focus:ring-1 focus:ring-fresh-500"
            />
          </div>

          {/* Expiry Date & Quick Options */}
          <div>
            <div className="flex justify-between items-end mb-1">
              <label htmlFor="item-expiry" className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Expiry Date *
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={noExpiry}
                  onChange={(e) => setNoExpiry(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-fresh-500 focus:ring-fresh-500"
                />
                <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-300 transition-colors">No expiry</span>
              </label>
            </div>
            
            {!noExpiry ? (
              <div className="space-y-3 animate-fade-in">
                <div className="grid grid-cols-3 gap-2">
                  {quickExpiryOptions.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleQuickExpiry(opt.days)}
                      className={`flex flex-col items-center justify-center rounded-lg border py-2 transition-all active:scale-95 ${
                        expiryDate === getFutureDate(opt.days)
                          ? 'border-fresh-500 bg-fresh-950/30 ring-1 ring-fresh-500'
                          : 'border-gray-700 bg-gray-800 hover:bg-gray-900'
                      }`}
                    >
                      <span className={`text-[10px] font-bold ${expiryDate === getFutureDate(opt.days) ? 'text-fresh-400' : 'text-gray-300'}`}>{opt.label}</span>
                      <span className="text-[9px] text-gray-400">{formatDateShort(getFutureDate(opt.days))}</span>
                    </button>
                  ))}
                </div>
                
                <div className="relative">
                  <input
                    id="item-expiry"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    min={minDate}
                    required={!noExpiry}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-gray-100 outline-none transition-all focus:border-fresh-500 focus:bg-gray-800 focus:ring-1 focus:ring-fresh-500"
                  />
                  <div className="absolute right-10 top-3 text-[10px] font-bold text-gray-400 pointer-events-none">
                    Custom Date
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-700 bg-gray-900/50 p-4 text-center animate-fade-in">
                <p className="text-xs text-gray-400 font-medium">This item is marked as non-perishable.</p>
              </div>
            )}
          </div>

          {/* Toggle More Details */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center justify-between py-1 text-xs font-bold text-fresh-400 hover:text-fresh-400 transition-colors"
          >
            <span>{isExpanded ? 'Collapse Details' : 'Adjust Category, Qty, Notes'}</span>
            <svg className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isExpanded && (
            <div className="space-y-4 pt-1 animate-fade-in">
              {/* Category */}
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Category
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`flex flex-col items-center gap-1 rounded-lg border py-2 text-[10px] transition-all ${
                        category === cat.value
                          ? 'bg-fresh-950/30 border-fresh-200 text-fresh-400 font-bold'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-900'
                      }`}
                    >
                      <CategoryIcon category={cat.value} className="h-5 w-5" />
                      <span className="truncate w-full px-1 text-center">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="item-qty" className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Quantity
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      id="item-qty"
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 outline-none transition-all focus:border-fresh-500 focus:bg-gray-800 focus:ring-1 focus:ring-fresh-500"
                    />
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-2 py-2 text-sm text-gray-100 outline-none transition-all focus:border-fresh-500 focus:bg-gray-800 focus:ring-1 focus:ring-fresh-500"
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="item-notes" className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Notes
                  </label>
                  <input
                    id="item-notes"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. For salad"
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder-gray-400 outline-none transition-all focus:border-fresh-500 focus:bg-gray-800 focus:ring-1 focus:ring-fresh-500"
                  />
                </div>
              </div>

              {/* Smart Quantity Options */}
              {activeFood?.quantityOptions && activeFood.quantityOptions.length > 0 && (
                <div className="animate-fade-in">
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Quick Quantity
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {activeFood.quantityOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          const match = opt.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
                          if (match) {
                            setQuantity(parseFloat(match[1]));
                            // If there's a unit mentioned, try to match it
                            const optUnit = match[2].trim().toLowerCase();
                            const foundUnit = UNITS.find(u => optUnit.includes(u));
                            if (foundUnit) setUnit(foundUnit);
                          }
                        }}
                        className="rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300 hover:border-fresh-500 hover:text-fresh-400 transition-all active:scale-95"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-fresh-500 px-4 py-4 text-sm font-bold text-white transition-all hover:bg-fresh-600 active:scale-95 shadow-md shadow-fresh-500/20"
            >
              {initialItem ? 'Save Changes' : 'Add to Pantry'}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-4 text-sm font-bold text-gray-400 transition-all hover:bg-gray-900 active:bg-gray-700/40"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
      {showScanner && (
        <BarcodeScanner 
          onScan={handleScan} 
          onClose={() => setShowScanner(false)} 
        />
      )}

      {isScanning && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4">
            <svg className="w-10 h-10 text-fresh-500 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="font-bold text-gray-100">Identifying product...</p>
          </div>
        </div>
      )}
    </div>
  );
}
