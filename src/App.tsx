import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type FoodItem } from './db';
import { 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  ChevronDown, 
  Search, 
  RotateCcw,
  Sparkles,
  TrendingDown,
  History,
  LayoutDashboard,
  Apple
} from 'lucide-react';

// Common categories and their emojis / styles
const CATEGORY_MAP: Record<string, { emoji: string; color: string; bg: string }> = {
  'Produce': { emoji: '🥦', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  'Dairy': { emoji: '🧀', color: 'text-amber-600', bg: 'bg-amber-50' },
  'Meat & Seafood': { emoji: '🥩', color: 'text-rose-600', bg: 'bg-rose-50' },
  'Pantry': { emoji: '🥫', color: 'text-blue-600', bg: 'bg-blue-50' },
  'Bakery': { emoji: '🍞', color: 'text-yellow-700', bg: 'bg-yellow-50' },
  'Beverages': { emoji: '🥛', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  'Freezer': { emoji: '❄️', color: 'text-sky-500', bg: 'bg-sky-50' },
  'Others': { emoji: '🏷️', color: 'text-slate-600', bg: 'bg-slate-50' },
};

const CATEGORIES = Object.keys(CATEGORY_MAP);

const UNITS = ['pcs', 'bags', 'g', 'kg', 'ml', 'L', 'oz', 'lbs', 'packs'];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pantry' | 'history'>('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Produce');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('pcs');
  const [expiryDate, setExpiryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7); // Default to 1 week from today
    return d.toISOString().split('T')[0];
  });

  // Database Queries
  const activeItems = useLiveQuery(() => db.items.where('status').equals('active').toArray()) || [];
  const allHistory = useLiveQuery(() => db.items.where('status').anyOf('consumed', 'wasted').toArray()) || [];

  // Expiry Calculations
  const getExpiryStatus = (dateStr: string) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const expDate = new Date(dateStr);
    expDate.setHours(0,0,0,0);
    
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Expired', days: diffDays, color: 'text-rose-600 bg-rose-50 border-rose-200', badgeColor: 'bg-rose-500', icon: 'expired' };
    if (diffDays <= 3) return { label: `Expiring in ${diffDays} day${diffDays === 1 ? '' : 's'}`, days: diffDays, color: 'text-amber-600 bg-amber-50 border-amber-200', badgeColor: 'bg-amber-500', icon: 'soon' };
    return { label: `Fresh (${diffDays} days left)`, days: diffDays, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', badgeColor: 'bg-emerald-500', icon: 'fresh' };
  };

  // Preset Expiry Date helper
  const setPresetDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setExpiryDate(d.toISOString().split('T')[0]);
  };

  // Add Item
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedQuantity = parseFloat(quantity) || 1;

    const newItem: FoodItem = {
      name: name.trim(),
      category,
      expiryDate,
      quantity: parsedQuantity,
      unit,
      status: 'active',
      createdAt: Date.now()
    };

    await db.items.add(newItem);
    
    // Reset Form
    setName('');
    setCategory('Produce');
    setQuantity('1');
    setUnit('pcs');
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setExpiryDate(d.toISOString().split('T')[0]);
    setShowAddForm(false);
  };

  // Quick Action: Consume
  const handleConsumeItem = async (id: number) => {
    await db.items.update(id, { status: 'consumed' });
  };

  // Quick Action: Waste
  const handleWasteItem = async (id: number) => {
    await db.items.update(id, { status: 'wasted' });
  };

  // Quick Action: Delete
  const handleDeleteItem = async (id: number) => {
    if (confirm('Are you sure you want to permanently delete this item?')) {
      await db.items.delete(id);
    }
  };

  // Quick Action: Restore to Active
  const handleRestoreItem = async (id: number) => {
    await db.items.update(id, { status: 'active' });
  };

  // Toggle Category Collapsed
  const toggleCategory = (cat: string) => {
    setCollapsedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Filter and search active items
  const filteredActiveItems = activeItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Group active items by category
  const itemsByCategory: Record<string, FoodItem[]> = {};
  filteredActiveItems.forEach(item => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = [];
    }
    itemsByCategory[item.category].push(item);
  });

  // Sorted items by urgency for Dashboard
  const expiringSoonItems = [...activeItems]
    .map(item => ({ ...item, expiryInfo: getExpiryStatus(item.expiryDate) }))
    .sort((a, b) => a.expiryInfo.days - b.expiryInfo.days)
    .slice(0, 5);

  // Statistics
  const totalWastedCount = allHistory.filter(i => i.status === 'wasted').length;
  const totalConsumedCount = allHistory.filter(i => i.status === 'consumed').length;
  const totalHistoryCount = allHistory.length;
  
  // Waste rate
  const wasteRate = totalHistoryCount > 0 
    ? Math.round((totalWastedCount / totalHistoryCount) * 100) 
    : 0;

  const savingsPotential = totalWastedCount * 4.5; // Average value estimate $4.50 per item

  return (
    <div className="min-h-screen text-slate-800 font-sans pb-28 foodspoils-bg">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-fresh-100/50 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-fresh-400 to-fresh-600 text-white p-2 rounded-xl shadow-md shadow-fresh-500/20 animate-float">
              <Apple className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 m-0 leading-tight">FoodSpoils</h1>
              <p className="text-[10px] text-fresh-600 font-semibold tracking-wide uppercase">Track freshness · Save money</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-fresh-500 to-fresh-600 hover:from-fresh-600 hover:to-fresh-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-fresh-500/20 hover:shadow-lg hover:shadow-fresh-500/30 active:scale-95"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </header>

      {/* Main Content Workspace (Mobile-First Constraints) */}
      <main className="max-w-md mx-auto px-4 pt-4">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4 animate-fade-in">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-2xl border border-fresh-100/50 shadow-sm hover:shadow-md transition-shadow text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-fresh-500/5 rounded-bl-full -mr-4 -mt-4 group-hover:bg-fresh-500/10 transition-colors"></div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider relative">Active</span>
                <p className="text-2xl font-extrabold text-fresh-600 mt-1 relative tabular-nums animate-count-up">{activeItems.length}</p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-blue-100/50 shadow-sm hover:shadow-md transition-shadow text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full -mr-4 -mt-4 group-hover:bg-blue-500/10 transition-colors"></div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider relative">Saved 😋</span>
                <p className="text-2xl font-extrabold text-blue-600 mt-1 relative tabular-nums animate-count-up">{totalConsumedCount}</p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-rose-100/50 shadow-sm hover:shadow-md transition-shadow text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-bl-full -mr-4 -mt-4 group-hover:bg-rose-500/10 transition-colors"></div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider relative">Wasted 🗑️</span>
                <p className="text-2xl font-extrabold text-rose-500 mt-1 relative tabular-nums animate-count-up">{totalWastedCount}</p>
              </div>
            </div>

            {/* Waste Tracker Report Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-fresh-900 text-white p-5 rounded-3xl shadow-lg shadow-slate-900/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-[0.08] group-hover:opacity-[0.12] transition-opacity">
                <TrendingDown className="h-32 w-32 -mr-6 -mt-6 text-fresh-400" />
              </div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-fresh-500/5 to-transparent rounded-tr-full"></div>
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl w-fit text-xs font-bold text-fresh-300 border border-white/10 shadow-inner">
                  <Sparkles className="h-3.5 w-3.5" /> Household Impact
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-300">Your Food Waste Rate</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-extrabold tracking-tight">{wasteRate}%</span>
                    <span className="text-xs text-slate-400">of total discarded</span>
                  </div>
                </div>

                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mt-2 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-fresh-400 via-fresh-500 to-fresh-600 h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${100 - wasteRate}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="flex items-center gap-1.5 text-fresh-300 bg-fresh-500/10 px-2.5 py-1 rounded-lg">
                    <ShieldCheck className="h-3.5 w-3.5" /> Saved: ${totalConsumedCount * 4.5}
                  </span>
                  <span className="text-rose-300 bg-rose-500/10 px-2.5 py-1 rounded-lg">Lost: ${savingsPotential}</span>
                </div>
              </div>
            </div>

            {/* Expiring Soon Quick Alert */}
            <div className="bg-white rounded-3xl border border-amber-100/60 p-4 shadow-sm space-y-3 animate-slide-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <div className="bg-gradient-to-br from-amber-400 to-amber-500 p-1.5 rounded-xl shadow-sm">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-sm">Eat These First!</h2>
                </div>
                <span className="text-[10px] bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-bold border border-amber-200/50">Priority View</span>
              </div>

              {expiringSoonItems.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm space-y-2">
                  <span className="text-3xl">🎉</span>
                  <p className="font-semibold text-slate-600">All your food is fresh!</p>
                  <p className="text-xs text-slate-400">Add more items to track them.</p>
                </div>
              ) : (
                <div className="divide-y divide-amber-50/80">
                  {expiringSoonItems.map((item, idx) => {
                    const status = getExpiryStatus(item.expiryDate);
                    const catInfo = CATEGORY_MAP[item.category] || CATEGORY_MAP['Others'];
                    return (
                      <div key={item.id} className={`py-2.5 flex items-center justify-between gap-2 ${idx === 0 ? 'pt-0' : ''} hover:bg-amber-50/30 -mx-2 px-2 rounded-xl transition-colors`}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-1.5 rounded-xl shadow-sm">{catInfo.emoji}</span>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm text-slate-900 truncate">{item.name}</h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs font-medium text-slate-400">{item.quantity} {item.unit}</span>
                              <span className="text-[10px] text-slate-300">•</span>
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${status.color}`}>
                                {status.label}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => item.id && handleConsumeItem(item.id)}
                            title="Consumed (Ate it!)"
                            className="p-2 bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-600 rounded-xl transition-all active:scale-90 shadow-sm hover:shadow-md"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => item.id && handleWasteItem(item.id)}
                            title="Wasted (Threw away)"
                            className="p-2 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-500 rounded-xl transition-all active:scale-90 shadow-sm hover:shadow-md"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Tips Box */}
            <div className="bg-gradient-to-br from-fresh-50 to-fresh-100/50 rounded-2xl border border-fresh-200/50 p-4 text-fresh-800 text-xs flex gap-3 shadow-sm">
              <span className="text-2xl animate-float">💡</span>
              <div className="space-y-1">
                <p className="font-bold text-fresh-900 text-sm">Pro Tip: Store veggies right!</p>
                <p className="text-fresh-700 leading-relaxed">Leafy greens expire 3x faster when stored wet. Pat them completely dry and wrap in a paper towel before refrigerating!</p>
              </div>
            </div>
          </div>
        )}

        {/* PANTRY TAB */}
        {activeTab === 'pantry' && (
          <div className="space-y-4 animate-fade-in">
            
            {/* Search & Filter Header */}
            <div className="bg-white p-3.5 rounded-2xl border border-fresh-100/40 shadow-sm space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search your pantry..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-fresh-500/20 focus:border-fresh-300 text-slate-900 font-medium placeholder:text-slate-400 transition-all"
                />
              </div>

              {/* Category Filter Pills (Horizontal Scroll) */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setFilterCategory('All')}
                  className={`text-xs px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                    filterCategory === 'All'
                      ? 'bg-gradient-to-r from-fresh-500 to-fresh-600 text-white shadow-sm shadow-fresh-500/20'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                  }`}
                >
                  All Items ({activeItems.length})
                </button>
                {CATEGORIES.map(cat => {
                  const count = activeItems.filter(item => item.category === cat).length;
                  const info = CATEGORY_MAP[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`text-xs px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                        filterCategory === cat
                          ? 'bg-gradient-to-r from-fresh-500 to-fresh-600 text-white shadow-sm shadow-fresh-500/20'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                      }`}
                    >
                      <span>{info.emoji}</span>
                      <span>{cat}</span>
                      <span className="opacity-70">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List Grouped by Category */}
            {Object.keys(itemsByCategory).length === 0 ? (
              <div className="text-center py-14 bg-white/80 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200 space-y-3 shadow-sm">
                <span className="text-5xl">🛒</span>
                <p className="font-bold text-slate-800 text-lg">Your pantry is empty</p>
                <p className="text-sm text-slate-400 max-w-xs mx-auto">Tap <span className="font-semibold text-fresh-600">"Add"</span> in the header to start tracking your foods.</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-fresh-500 to-fresh-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-fresh-500/20 hover:shadow-lg hover:shadow-fresh-500/30 active:scale-95 transition-all"
                >
                  <Plus className="h-4 w-4" /> Add Your First Item
                </button>
              </div>
            ) : (
              <div className="space-y-3 list-enter">
                {CATEGORIES.map(cat => {
                  const items = itemsByCategory[cat] || [];
                  if (items.length === 0) return null;

                  const isCollapsed = collapsedCategories[cat];
                  const catInfo = CATEGORY_MAP[cat];

                  return (
                    <div key={cat} className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      {/* Category Header Bar */}
                      <button 
                        onClick={() => toggleCategory(cat)}
                        className={`w-full px-4 py-3 flex items-center justify-between text-left font-bold text-sm ${catInfo.bg} border-b border-slate-100/50`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{catInfo.emoji}</span>
                          <span className="text-slate-950 font-extrabold">{cat}</span>
                          <span className="text-xs font-bold bg-white/80 text-slate-500 px-2 py-0.5 rounded-full shadow-sm shadow-black/5">
                            {items.length}
                          </span>
                        </div>
                        <div className={`transition-transform ${isCollapsed ? '' : 'rotate-180'}`}>
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        </div>
                      </button>

                      {/* Items Row list */}
                      {!isCollapsed && (
                        <div className="divide-y divide-slate-50">
                          {items.map((item, idx) => {
                            const status = getExpiryStatus(item.expiryDate);
                            return (
                              <div key={item.id} className={`p-3.5 flex items-center justify-between gap-3 bg-white hover:bg-slate-50/50 transition-colors animate-slide-in-right border-l-4 ${status.color.replace('text', 'border').replace('bg', '').split(' ')[0].replace('text-', 'border-').split(' ')[0]}`} style={{ animationDelay: `${idx * 30}ms` }}>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-sm text-slate-900 truncate">{item.name}</h3>
                                    <span className="text-[11px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md font-semibold border border-slate-100">
                                      {item.quantity} {item.unit}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px]">
                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                    <span className="text-slate-500 font-medium">Exp: <span className="font-bold text-slate-600">{item.expiryDate}</span></span>
                                    <span className={`font-bold px-2 py-0.5 rounded-lg border text-[10px] ${status.color}`}>
                                      {status.label}
                                    </span>
                                  </div>
                                </div>

                                {/* Pantry Action buttons */}
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => item.id && handleConsumeItem(item.id)}
                                    title="Mark Consumed"
                                    className="p-2 bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-600 rounded-xl transition-all active:scale-90 shadow-sm hover:shadow-md"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => item.id && handleWasteItem(item.id)}
                                    title="Mark Wasted"
                                    className="p-2 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-500 rounded-xl transition-all active:scale-90 shadow-sm hover:shadow-md"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => item.id && handleDeleteItem(item.id)}
                                    title="Delete Permanently"
                                    className="p-2 text-slate-300 hover:text-rose-400 hover:bg-rose-50 rounded-xl transition-all"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* HISTORY & REPORTS TAB */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-fade-in">
            {/* Visual Charts Overview */}
            <div className="bg-white p-5 rounded-3xl border border-indigo-100/40 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-indigo-400 to-indigo-500 p-1.5 rounded-xl shadow-sm">
                  <TrendingDown className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Waste vs. Savings Analysis</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 rounded-2xl border border-emerald-200/50 text-center shadow-sm">
                  <span className="text-3xl">💚</span>
                  <p className="text-xs text-slate-500 mt-1 font-bold uppercase tracking-wider">Consumed</p>
                  <p className="text-xl font-extrabold text-emerald-600 mt-0.5">{totalConsumedCount} items</p>
                </div>
                <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 p-4 rounded-2xl border border-rose-200/50 text-center shadow-sm">
                  <span className="text-3xl">💔</span>
                  <p className="text-xs text-slate-500 mt-1 font-bold uppercase tracking-wider">Wasted</p>
                  <p className="text-xl font-extrabold text-rose-600 mt-0.5">{totalWastedCount} items</p>
                </div>
              </div>

              {totalHistoryCount === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <span className="text-4xl block mb-2">📊</span>
                  Ate or throw away food items to populate your report
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-slate-500 font-bold px-1">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400"></span> Ate: {100 - wasteRate}%</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-400"></span> Wasted: {wasteRate}%</span>
                  </div>
                  <div className="flex h-6 rounded-full overflow-hidden shadow-sm">
                    <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-1000" style={{ width: `${100 - wasteRate}%` }}></div>
                    <div className="bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-1000" style={{ width: `${wasteRate}%` }}></div>
                  </div>
                  <p className="text-[11px] text-slate-400 text-center leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                    {wasteRate <= 20 ? '🌟 Excellent! You\'re almost wasting nothing!' : wasteRate <= 40 ? '👍 Good progress! Keep reducing waste!' : '📈 Room for improvement — use the Eat These First list!'}
                  </p>
                </div>
              )}
            </div>

            {/* History Logs */}
            <div className="bg-white rounded-3xl border border-slate-100/80 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-indigo-400 to-indigo-500 p-1.5 rounded-xl shadow-sm">
                    <History className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Activity Log</h2>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-bold border border-slate-200/50">
                  {allHistory.length} log{allHistory.length !== 1 ? 's' : ''}
                </span>
              </div>

              {allHistory.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  <span className="text-4xl block mb-2">📝</span>
                  No logged foods yet. Change items status in pantry!
                </div>
              ) : (
                <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto scrollbar-none">
                  {[...allHistory].reverse().map((item, idx) => {
                    const catInfo = CATEGORY_MAP[item.category] || CATEGORY_MAP['Others'];
                    const isConsumed = item.status === 'consumed';
                    return (
                      <div key={item.id} className="py-2.5 flex items-center justify-between gap-2 hover:bg-slate-50/50 -mx-2 px-2 rounded-xl transition-colors animate-slide-in-right" style={{ animationDelay: `${idx * 40}ms` }}>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`text-xl bg-gradient-to-br ${isConsumed ? 'from-emerald-50 to-emerald-100' : 'from-rose-50 to-rose-100'} p-1.5 rounded-xl shadow-sm`}>{catInfo.emoji}</span>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm text-slate-900 truncate">{item.name}</h4>
                            <p className="text-xs text-slate-400">{item.quantity} {item.unit} · expired {item.expiryDate}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                            isConsumed ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : 'bg-rose-50 text-rose-700 border-rose-200/50'
                          }`}>
                            {isConsumed ? 'Ate 😋' : 'Wasted 🗑️'}
                          </span>
                          <button
                            onClick={() => item.id && handleRestoreItem(item.id)}
                            title="Restore back to pantry"
                            className="p-1.5 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* QUICK ADD ITEM SLIDEOVER / FORM MODAL */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl p-5 space-y-4 animate-slide-up">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <div className="bg-gradient-to-br from-fresh-400 to-fresh-600 p-1.5 rounded-xl shadow-sm">
                  <Apple className="h-4 w-4 text-white" />
                </div>
                Add New Food
              </h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="bg-slate-100 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all active:scale-90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              
              {/* Item Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Strawberries"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fresh-500/20 focus:border-fresh-300 text-slate-900 font-semibold transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fresh-500/20 focus:border-fresh-300 text-slate-900 font-semibold transition-all"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {CATEGORY_MAP[cat].emoji} {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity & Unit Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Quantity</label>
                  <input
                    type="number"
                    min="0.1"
                    step="any"
                    required
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fresh-500/20 focus:border-fresh-300 text-slate-900 font-semibold transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Unit</label>
                  <select
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fresh-500/20 focus:border-fresh-300 text-slate-900 font-semibold transition-all"
                  >
                    {UNITS.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Expiry Date with Smart presets */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Expiry Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fresh-500/20 focus:border-fresh-300 text-slate-900 font-semibold transition-all"
                  />
                </div>

                {/* Date presets row */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setPresetDate(3)}
                    className="text-[10px] font-bold bg-fresh-50 text-fresh-700 px-3 py-1.5 rounded-lg border border-fresh-200/50 hover:bg-fresh-100 active:scale-95 transition-all whitespace-nowrap"
                  >
                    +3 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetDate(7)}
                    className="text-[10px] font-bold bg-fresh-50 text-fresh-700 px-3 py-1.5 rounded-lg border border-fresh-200/50 hover:bg-fresh-100 active:scale-95 transition-all whitespace-nowrap"
                  >
                    +1 Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetDate(14)}
                    className="text-[10px] font-bold bg-fresh-50 text-fresh-700 px-3 py-1.5 rounded-lg border border-fresh-200/50 hover:bg-fresh-100 active:scale-95 transition-all whitespace-nowrap"
                  >
                    +2 Weeks
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetDate(30)}
                    className="text-[10px] font-bold bg-fresh-50 text-fresh-700 px-3 py-1.5 rounded-lg border border-fresh-200/50 hover:bg-fresh-100 active:scale-95 transition-all whitespace-nowrap"
                  >
                    +1 Month
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-fresh-500 to-fresh-600 hover:from-fresh-600 hover:to-fresh-700 text-white font-bold py-3 rounded-2xl text-sm transition-all shadow-md shadow-fresh-500/20 hover:shadow-lg hover:shadow-fresh-500/30 active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4.5 w-4.5" /> Save Food Item
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BOTTOM TAB NAV BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-slate-100/80 shadow-lg shadow-slate-900/5">
        <div className="max-w-md mx-auto px-8 py-2.5 flex justify-around">
          
          {/* Dashboard Tab */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 relative transition-all ${
              activeTab === 'dashboard' ? 'text-fresh-500' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {activeTab === 'dashboard' && <span className="absolute -top-2.5 w-8 h-0.5 bg-fresh-500 rounded-full"></span>}
            <LayoutDashboard className={`h-5 w-5 ${activeTab === 'dashboard' ? 'drop-shadow-sm' : ''}`} />
            <span className={`text-[10px] font-bold ${activeTab === 'dashboard' ? 'text-fresh-600' : ''}`}>Dashboard</span>
          </button>

          {/* Pantry Tab */}
          <button
            onClick={() => setActiveTab('pantry')}
            className={`flex flex-col items-center gap-0.5 relative transition-all ${
              activeTab === 'pantry' ? 'text-fresh-500' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {activeTab === 'pantry' && <span className="absolute -top-2.5 w-8 h-0.5 bg-fresh-500 rounded-full"></span>}
            <div className="relative">
              <Apple className={`h-5 w-5 ${activeTab === 'pantry' ? 'drop-shadow-sm' : ''}`} />
              {activeItems.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-fresh-500 to-fresh-600 text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center border-[1.5px] border-white shadow-sm shadow-fresh-500/30">
                  {activeItems.length}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-bold ${activeTab === 'pantry' ? 'text-fresh-600' : ''}`}>Pantry</span>
          </button>

          {/* History Tab */}
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-0.5 relative transition-all ${
              activeTab === 'history' ? 'text-fresh-500' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {activeTab === 'history' && <span className="absolute -top-2.5 w-8 h-0.5 bg-fresh-500 rounded-full"></span>}
            <History className={`h-5 w-5 ${activeTab === 'history' ? 'drop-shadow-sm' : ''}`} />
            <span className={`text-[10px] font-bold ${activeTab === 'history' ? 'text-fresh-600' : ''}`}>Waste Report</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
