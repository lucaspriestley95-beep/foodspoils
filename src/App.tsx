import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type FoodItem } from './db';
import { openCheckout } from './lib/stripe-links';
  Plus, 
  Trash2, 
  Check, 
  X, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-xs">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 text-white p-1.5 rounded-xl">
              <Apple className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 m-0 leading-tight">FoodSpoils</h1>
              <p className="text-xs text-slate-400 font-medium">Keep food fresh, save money</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Item
          </button>
        </div>
      </header>

      {/* Main Content Workspace (Mobile-First Constraints) */}
      <main className="max-w-md mx-auto px-4 pt-4">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4 animate-fade-in">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs text-center">
                <span className="text-xs text-slate-400 font-medium">Active</span>
                <p className="text-2xl font-extrabold text-emerald-600 mt-1">{activeItems.length}</p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs text-center">
                <span className="text-xs text-slate-400 font-medium">Saved 😋</span>
                <p className="text-2xl font-extrabold text-blue-600 mt-1">{totalConsumedCount}</p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs text-center">
                <span className="text-xs text-slate-400 font-medium">Wasted 🗑️</span>
                <p className="text-2xl font-extrabold text-rose-500 mt-1">{totalWastedCount}</p>
              </div>
            </div>

            {/* Waste Tracker Report Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-3xl shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingDown className="h-28 w-28 -mr-4 -mt-4" />
              </div>
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2 bg-white/10 px-2.5 py-1 rounded-lg w-fit text-xs font-semibold text-emerald-300">
                  <Sparkles className="h-3 w-3" /> Household Impact
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-300">Your Food Waste Rate</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold">{wasteRate}%</span>
                    <span className="text-xs text-slate-400">of total discarded</span>
                  </div>
                </div>

                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-emerald-400 h-full" style={{ width: `${100 - wasteRate}%` }}></div>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-300 pt-1">
                  <span className="flex items-center gap-1 text-emerald-300">
                    <ShieldCheck className="h-3.5 w-3.5" /> Est. Money Saved: ${totalConsumedCount * 4.5}
                  </span>
                  <span className="text-rose-300">Wasted Val: ${savingsPotential}</span>
                </div>
              </div>
            </div>

            {/* Expiring Soon Quick Alert */}
            <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <h2>Eat These First!</h2>
                </div>
                <span className="text-xs bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full font-bold">Priority View</span>
              </div>

              {expiringSoonItems.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-sm space-y-1">
                  <p>🎉 All your food is fresh!</p>
                  <p className="text-xs text-slate-300">Add more items to track them.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {expiringSoonItems.map(item => {
                    const status = getExpiryStatus(item.expiryDate);
                    const catInfo = CATEGORY_MAP[item.category] || CATEGORY_MAP['Others'];
                    return (
                      <div key={item.id} className="py-2.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-2xl bg-slate-50 p-1.5 rounded-xl">{catInfo.emoji}</span>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm text-slate-900 truncate">{item.name}</h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs font-medium text-slate-400">{item.quantity} {item.unit}</span>
                              <span className="text-[10px] text-slate-300">•</span>
                              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${status.color}`}>
                                {status.label}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => item.id && handleConsumeItem(item.id)}
                            title="Consumed (Ate it!)"
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => item.id && handleWasteItem(item.id)}
                            title="Wasted (Threw away)"
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg transition-colors"
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
            <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100/50 p-4 text-emerald-800 text-xs flex gap-3">
              <span className="text-2xl">💡</span>
              <div className="space-y-1">
                <p className="font-bold text-emerald-900">Pro Tip: Store veggies right!</p>
                <p className="text-emerald-700 leading-relaxed">Leafy greens expire 3x faster when stored wet. Pat them completely dry and wrap in a paper towel before refrigerating!</p>
              </div>
            </div>
          </div>
        )}

        {/* PANTRY TAB */}
        {activeTab === 'pantry' && (
          <div className="space-y-4 animate-fade-in">
            
            {/* Search & Filter Header */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs space-y-2.5">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search pantry..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-medium"
                />
              </div>

              {/* Category Filter Pills (Horizontal Scroll) */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setFilterCategory('All')}
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                    filterCategory === 'All'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
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
                      className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                        filterCategory === cat
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
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
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 space-y-2">
                <span className="text-4xl">🛒</span>
                <p className="font-semibold text-slate-800">Your pantry is empty</p>
                <p className="text-xs text-slate-400">Tap "Add Item" to start tracking your foods.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {CATEGORIES.map(cat => {
                  const items = itemsByCategory[cat] || [];
                  if (items.length === 0) return null;

                  const isCollapsed = collapsedCategories[cat];
                  const catInfo = CATEGORY_MAP[cat];

                  return (
                    <div key={cat} className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
                      {/* Category Header Bar */}
                      <button 
                        onClick={() => toggleCategory(cat)}
                        className={`w-full px-4 py-3 flex items-center justify-between text-left font-bold text-sm ${catInfo.bg} ${catInfo.color}`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{catInfo.emoji}</span>
                          <span className="text-slate-950 font-extrabold">{cat}</span>
                          <span className="text-xs font-semibold bg-white/80 px-2 py-0.5 rounded-full shadow-3xs">
                            {items.length}
                          </span>
                        </div>
                        {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                      </button>

                      {/* Items Row list */}
                      {!isCollapsed && (
                        <div className="divide-y divide-slate-100">
                          {items.map(item => {
                            const status = getExpiryStatus(item.expiryDate);
                            return (
                              <div key={item.id} className="p-3.5 flex items-center justify-between gap-3 bg-white hover:bg-slate-50/50 transition-colors">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-sm text-slate-900 truncate">{item.name}</h3>
                                    <span className="text-xs text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                                      {item.quantity} {item.unit}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                    <span className="text-slate-500">Exp: {item.expiryDate}</span>
                                    <span className={`font-bold px-1.5 py-0.5 rounded-md ${status.color}`}>
                                      {status.label}
                                    </span>
                                  </div>
                                </div>

                                {/* Pantry Action buttons */}
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => item.id && handleConsumeItem(item.id)}
                                    title="Mark Consumed"
                                    className="p-2 bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-600 rounded-xl transition-all"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => item.id && handleWasteItem(item.id)}
                                    title="Mark Wasted"
                                    className="p-2 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-500 rounded-xl transition-all"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => item.id && handleDeleteItem(item.id)}
                                    title="Delete Permanently"
                                    className="p-2 text-slate-300 hover:text-slate-600 rounded-xl transition-all"
                                  >
                                    <Trash2 className="h-4 w-4" />
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
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-slate-900">Waste vs. Savings Analysis</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100 text-center">
                  <span className="text-2xl">💚</span>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Consumed Total</p>
                  <p className="text-xl font-extrabold text-emerald-600">{totalConsumedCount} items</p>
                </div>
                <div className="bg-rose-50/50 p-3 rounded-2xl border border-rose-100 text-center">
                  <span className="text-2xl">💔</span>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Wasted Total</p>
                  <p className="text-xl font-extrabold text-rose-600">{totalWastedCount} items</p>
                </div>
              </div>

              {totalHistoryCount === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Ate or throw away food items to populate detailed chart analyses!
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-500 font-bold">
                    <span>Ate: {100 - wasteRate}%</span>
                    <span>Wasted: {wasteRate}%</span>
                  </div>
                  <div className="flex h-5 rounded-xl overflow-hidden shadow-3xs">
                    <div className="bg-emerald-400" style={{ width: `${100 - wasteRate}%` }}></div>
                    <div className="bg-rose-400" style={{ width: `${wasteRate}%` }}></div>
                  </div>
                  <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                    Great work! Consuming your food saves money and reduces greenhouse gas emissions. Keep improving!
                  </p>
                </div>
              )}
            </div>

            {/* History Logs */}
            <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                  <History className="h-5 w-5 text-indigo-500" />
                  <h2>Activity Log</h2>
                </div>
                <span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-bold">
                  {allHistory.length} logs
                </span>
              </div>

              {allHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No logged foods yet. Change items status in pantry!
                </div>
              ) : (
                <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
                  {[...allHistory].reverse().map(item => {
                    const catInfo = CATEGORY_MAP[item.category] || CATEGORY_MAP['Others'];
                    const isConsumed = item.status === 'consumed';
                    return (
                      <div key={item.id} className="py-2.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xl bg-slate-50 p-1.5 rounded-xl">{catInfo.emoji}</span>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm text-slate-900 truncate">{item.name}</h4>
                            <p className="text-xs text-slate-400">{item.quantity} {item.unit} • expired {item.expiryDate}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                            isConsumed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {isConsumed ? 'Ate 😋' : 'Wasted 🗑️'}
                          </span>
                          <button
                            onClick={() => item.id && handleRestoreItem(item.id)}
                            title="Restore back to pantry"
                            className="p-1 text-slate-300 hover:text-slate-600 transition-colors"
                          >
                            <RotateCcw className="h-4 w-4" />
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
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-t-3xl shadow-xl p-5 space-y-4 animate-slide-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                <Apple className="h-5 w-5 text-emerald-500" />
                Add New Food
              </h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="bg-slate-50 p-1.5 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              
              {/* Item Name */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Strawberries"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-semibold"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-semibold"
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
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Quantity</label>
                  <input
                    type="number"
                    min="0.1"
                    step="any"
                    required
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Unit</label>
                  <select
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-semibold"
                  >
                    {UNITS.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Expiry Date with Smart presets */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Expiry Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-semibold"
                  />
                </div>

                {/* Date presets row */}
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setPresetDate(3)}
                    className="text-[10px] font-bold bg-slate-50 text-slate-600 px-2.5 py-1.5 rounded-lg border border-slate-100 hover:bg-slate-100"
                  >
                    +3 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetDate(7)}
                    className="text-[10px] font-bold bg-slate-50 text-slate-600 px-2.5 py-1.5 rounded-lg border border-slate-100 hover:bg-slate-100"
                  >
                    +1 Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetDate(14)}
                    className="text-[10px] font-bold bg-slate-50 text-slate-600 px-2.5 py-1.5 rounded-lg border border-slate-100 hover:bg-slate-100"
                  >
                    +2 Weeks
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetDate(30)}
                    className="text-[10px] font-bold bg-slate-50 text-slate-600 px-2.5 py-1.5 rounded-lg border border-slate-100 hover:bg-slate-100"
                  >
                    +1 Month
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-2xl text-sm transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1"
              >
                <Plus className="h-4.5 w-4.5" /> Save Food Item
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BOTTOM TAB NAV BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 shadow-lg">
        <div className="max-w-md mx-auto px-6 py-2.5 flex justify-around">
          
          {/* Dashboard Tab */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'dashboard' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <LayoutDashboard className="h-5.5 w-5.5" />
            <span className="text-[10px] font-bold">Dashboard</span>
          </button>

          {/* Pantry Tab */}
          <button
            onClick={() => setActiveTab('pantry')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'pantry' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <Apple className="h-5.5 w-5.5" />
              {activeItems.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-emerald-500 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-white">
                  {activeItems.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold">Pantry</span>
          </button>

          {/* History Tab */}
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'history' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <History className="h-5.5 w-5.5" />
            <span className="text-[10px] font-bold">Waste Report</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
{/* Premium Section */}
<div className="mt-6 rounded-md border border-gray-200 bg-white p-4 shadow-sm">
  <h3 className="text-lg font-semibold text-gray-800">Upgrade to Premium</h3>
  <p className="mt-1 text-sm text-gray-400">Unlimited items, barcode scanning, meal suggestions & more.</p>
  <div className="mt-4 flex flex-col gap-3">
    <button
      onClick={() => openCheckout('monthly')}
      className="w-full rounded-sm bg-fresh-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-fresh-600"
    >
      Monthly — $4.99/mo
    </button>
    <button
      onClick={() => openCheckout('annual')}
      className="w-full rounded-sm border border-fresh-500 bg-fresh-50 px-4 py-3 text-sm font-semibold text-fresh-700 transition-colors hover:bg-fresh-100"
    >
      Annual — $39.99/yr <span className="text-xs opacity-75">(Save 33%)</span>
    </button>
