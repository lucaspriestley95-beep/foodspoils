import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type FoodItem } from './db';
import { 
  getExpiryStatus, 
  FoodItemCard,
  AddItemForm,
  EmptyPantry,
  NoExpiringItems,
  ScanPrompt,
  DashboardStats,
  BottomNav,
  Header,
  WelcomeHeader,
  OnboardingScreen,
  type ScreenKey
} from './components';

const CATEGORIES_INFO = [
  { value: 'dairy', label: 'Dairy', icon: '🥛', color: 'text-amber-600', bg: 'bg-amber-50' },
  { value: 'produce', label: 'Produce', icon: '🥬', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { value: 'meat', label: 'Meat', icon: '🥩', color: 'text-rose-600', bg: 'bg-rose-50' },
  { value: 'seafood', label: 'Seafood', icon: '🐟', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { value: 'grains', label: 'Grains & Pasta', icon: '🌾', color: 'text-yellow-700', bg: 'bg-yellow-50' },
  { value: 'condiments', label: 'Condiments', icon: '🧂', color: 'text-slate-600', bg: 'bg-slate-50' },
  { value: 'beverages', label: 'Beverages', icon: '🥤', color: 'text-blue-600', bg: 'bg-blue-50' },
  { value: 'frozen', label: 'Frozen', icon: '🧊', color: 'text-sky-500', bg: 'bg-sky-50' },
  { value: 'snacks', label: 'Snacks', icon: '🍿', color: 'text-orange-600', bg: 'bg-orange-50' },
  { value: 'pantry', label: 'Pantry', icon: '📦', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { value: 'other', label: 'Other', icon: '📋', color: 'text-slate-500', bg: 'bg-slate-50' },
];

export default function App() {
  const [onboardingCompleted, setOnboardingCompleted] = useState(() => 
    localStorage.getItem('foodspoils_onboarding_completed') === 'true'
  );
  const [activeScreen, setActiveScreen] = useState<ScreenKey>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  
  // Adding / Editing form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  // Premium state
  const [isPremium, setIsPremium] = useState(() => 
    localStorage.getItem('foodspoils_is_premium') === 'true'
  );

  // Database Queries
  const activeItems = useLiveQuery(() => db.items.where('status').equals('active').toArray()) || [];
  const historyItems = useLiveQuery(() => db.items.where('status').anyOf('consumed', 'wasted').toArray()) || [];

  // Expiry Calculations
  const expiringSoon = activeItems.filter(i => {
    const status = getExpiryStatus(i.expiryDate);
    return status === 'soon' || status === 'urgent';
  });

  const expired = activeItems.filter(i => getExpiryStatus(i.expiryDate) === 'expired');
  const freshCount = activeItems.filter(i => getExpiryStatus(i.expiryDate) === 'fresh');

  // Submit Handler (Add or Edit)
  const handleSubmitForm = async (formData: {
    name: string;
    category: string;
    expiryDate: string;
    quantity: number;
    unit: string;
    notes?: string;
  }) => {
    if (editingItem && editingItem.id !== undefined) {
      // Edit mode
      await db.items.update(editingItem.id, {
        name: formData.name,
        category: formData.category,
        expiryDate: formData.expiryDate,
        quantity: formData.quantity,
        unit: formData.unit,
        notes: formData.notes
      });
      setEditingItem(null);
    } else {
      // Add mode - check active item limit for Free Tier
      if (!isPremium && activeItems.length >= 10) {
        alert('⚠️ Free Tier Limit Reached!\n\nAs a Free user, you can track up to 10 active items in your pantry. Please upgrade to Premium in the Profile tab for unlimited items, household sharing, and barcode scanning!');
        return;
      }

      const newItem: FoodItem = {
        name: formData.name,
        category: formData.category,
        expiryDate: formData.expiryDate,
        quantity: formData.quantity,
        unit: formData.unit,
        notes: formData.notes,
        status: 'active',
        createdAt: Date.now()
      };
      await db.items.add(newItem);
    }
    setShowAddForm(false);
  };

  const handleStartEdit = (item: FoodItem) => {
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleCancelForm = () => {
    setEditingItem(null);
    setShowAddForm(false);
  };

  // Quick Actions
  const handleConsumeItem = async (id: number) => {
    await db.items.update(id, { status: 'consumed' });
  };

  const handleWasteItem = async (id: number) => {
    await db.items.update(id, { status: 'wasted' });
  };

  const handleDeleteItem = async (id: number) => {
    if (confirm('Are you sure you want to permanently delete this item?')) {
      await db.items.delete(id);
    }
  };

  const handleRestoreItem = async (id: number) => {
    await db.items.update(id, { status: 'active' });
  };

  // Seeding Sample Data
  const handleSeedSampleData = async () => {
    await db.items.clear();
    const sampleItems: FoodItem[] = [
      {
        name: 'Baby Spinach',
        category: 'produce',
        expiryDate: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0], // expiring soon
        quantity: 1,
        unit: 'bag',
        notes: 'For morning smoothies',
        status: 'active',
        createdAt: Date.now()
      },
      {
        name: 'Whole Milk',
        category: 'dairy',
        expiryDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], // fresh
        quantity: 1,
        unit: 'gallon',
        notes: 'Good for cereals',
        status: 'active',
        createdAt: Date.now()
      },
      {
        name: 'Chicken Breast',
        category: 'meat',
        expiryDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], // expired
        quantity: 2,
        unit: 'lb',
        notes: 'Smell test before cooking',
        status: 'active',
        createdAt: Date.now()
      },
      {
        name: 'Greek Yogurt',
        category: 'dairy',
        expiryDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0], // fresh
        quantity: 1,
        unit: 'container',
        status: 'active',
        createdAt: Date.now()
      },
      {
        name: 'Sourdough Bread',
        category: 'grains',
        expiryDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], // expiring soon
        quantity: 1,
        unit: 'loaf',
        notes: 'Best if toasted',
        status: 'active',
        createdAt: Date.now()
      }
    ];
    for (const item of sampleItems) {
      await db.items.add(item);
    }
    alert('🎉 Sample grocery data successfully seeded into your pantry!');
  };

  // Clearing DB
  const handleClearDatabase = async () => {
    if (confirm('Are you sure you want to clear your entire pantry and history? This cannot be undone.')) {
      await db.items.clear();
      alert('🧹 Database successfully cleared!');
    }
  };

  // Upgrading to Premium
  const handleUpgradePremium = (upgrade: boolean) => {
    localStorage.setItem('foodspoils_is_premium', upgrade ? 'true' : 'false');
    setIsPremium(upgrade);
    if (upgrade) {
      alert('👑 Welcome to FoodSpoils Premium! You have unlocked unlimited items, barcode scanning, and AI suggestions.');
    } else {
      alert('Subscription cancelled. Reverted back to the Free Tier.');
    }
  };

  // Onboarding Screen Render
  if (!onboardingCompleted) {
    return (
      <OnboardingScreen 
        onComplete={() => {
          localStorage.setItem('foodspoils_onboarding_completed', 'true');
          setOnboardingCompleted(true);
        }} 
      />
    );
  }

  // Filter pantry items
  const filteredActiveItems = activeItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesCategory = true;
    if (filterCategory === 'Expiring Soon') {
      const status = getExpiryStatus(item.expiryDate);
      matchesCategory = status === 'soon' || status === 'urgent';
    } else if (filterCategory === 'Expired') {
      matchesCategory = getExpiryStatus(item.expiryDate) === 'expired';
    } else if (filterCategory !== 'All') {
      matchesCategory = item.category === filterCategory;
    }
    return matchesSearch && matchesCategory;
  });

  // Group pantry items by category
  const itemsByCategory: Record<string, FoodItem[]> = {};
  filteredActiveItems.forEach(item => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = [];
    }
    itemsByCategory[item.category].push(item);
  });

  // Analytics
  const totalWasted = historyItems.filter(i => i.status === 'wasted').length;
  const totalConsumed = historyItems.filter(i => i.status === 'consumed').length;
  const totalClosed = historyItems.length;
  const wasteRate = totalClosed > 0 ? Math.round((totalWasted / totalClosed) * 100) : 0;
  const dollarsWasted = totalWasted * 4.5; // estimate $4.50 per item
  const dollarsSaved = totalConsumed * 4.5;

  return (
    <div className="relative mx-auto min-h-screen max-w-md bg-gray-50 pb-24 font-sans shadow-sm border-x border-gray-100">
      
      {/* 1. DASHBOARD SCREEN */}
      {activeScreen === 'dashboard' && (
        <div className="animate-fade-in">
          <Header 
            title="FoodSpoils" 
            subtitle="Track freshness. Save money." 
            onScan={() => setActiveScreen('scan')} 
          />
          <WelcomeHeader userName="Alex" itemCount={activeItems.length} />
          
          {!isPremium && (
            <div className="mx-4 mb-3 rounded-md bg-amber-50 border border-amber-100 p-2.5 text-center text-xs text-amber-800 font-semibold flex items-center justify-center gap-1.5 shadow-sm">
              <span className="text-sm">⚡</span>
              <span>Free Tier Capacity: <strong>{activeItems.length}/10 items</strong> used.</span>
              <button 
                onClick={() => { setActiveScreen('settings'); }} 
                className="underline text-amber-900 hover:text-amber-950 font-bold ml-1"
              >
                Upgrade to Premium
              </button>
            </div>
          )}
          
          <div className="px-4 pb-4">
            <DashboardStats 
              totalItems={activeItems.length}
              expiringSoon={expiringSoon.length}
              expired={expired.length}
              freshCount={freshCount.length}
              onExpiringClick={() => {
                setActiveScreen('pantry');
                setFilterCategory('Expiring Soon');
              }}
              onExpiredClick={() => {
                setActiveScreen('pantry');
                setFilterCategory('Expired');
              }}
            />
          </div>

          {/* Section: Expiring Soon Priority List */}
          <div className="px-4 pb-4">
            <h2 className="mb-2 text-sm font-semibold text-gray-800">⚠️ Eat These First!</h2>
            {expiringSoon.length === 0 ? (
              <NoExpiringItems />
            ) : (
              <div className="flex flex-col gap-2">
                {expiringSoon.map(item => (
                  <FoodItemCard 
                    key={item.id} 
                    item={item} 
                    onEdit={handleStartEdit}
                    onDelete={handleDeleteItem}
                    onConsume={handleConsumeItem}
                    onWaste={handleWasteItem}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pro Tip Box */}
          <div className="mx-4 mb-4 flex gap-3 rounded-md border border-green-100 bg-green-50 p-4 text-xs text-green-800">
            <span className="text-xl" aria-hidden="true">💡</span>
            <div className="space-y-1">
              <p className="font-bold text-green-900">Pro Tip: Keep berries fresh!</p>
              <p className="leading-relaxed">
                Rinse berries in a mix of 1 part vinegar and 3 parts water before storing. It kills mold spores and extends their life by up to 2 weeks!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. PANTRY SCREEN */}
      {activeScreen === 'pantry' && (
        <div className="animate-fade-in">
          <Header 
            title="Pantry" 
            subtitle="Everything you have" 
          />
          
          {/* Search and Filters */}
          <div className="px-4 pb-3">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800">📋 Inventory</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-1 rounded-sm bg-fresh-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-fresh-600 transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Item
              </button>
            </div>

            <div className="relative mb-3">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search pantry items..."
                className="w-full rounded-sm border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors focus:border-fresh-500 focus:ring-1 focus:ring-fresh-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setFilterCategory('All')}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                  filterCategory === 'All'
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                All ({activeItems.length})
              </button>
              <button
                onClick={() => setFilterCategory('Expiring Soon')}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  filterCategory === 'Expiring Soon'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                ⚠️ Expiring Soon
              </button>
              <button
                onClick={() => setFilterCategory('Expired')}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  filterCategory === 'Expired'
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                🛑 Expired
              </button>
              {CATEGORIES_INFO.map(cat => {
                const count = activeItems.filter(i => i.category === cat.value).length;
                if (count === 0) return null;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setFilterCategory(cat.value)}
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                      filterCategory === cat.value
                        ? 'bg-fresh-500 text-white'
                        : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span className="opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grouped Collapsible Category List */}
          <div className="px-4 pb-4">
            {activeItems.length === 0 ? (
              <EmptyPantry onAddItem={() => setShowAddForm(true)} />
            ) : filteredActiveItems.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">
                🔍 No items match your search or filter.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {CATEGORIES_INFO.map(cat => {
                  const items = itemsByCategory[cat.value] || [];
                  if (items.length === 0) return null;

                  const isCollapsed = collapsedCategories[cat.value];
                  return (
                    <div key={cat.value} className="rounded-md border border-gray-200 bg-white overflow-hidden shadow-sm">
                      {/* Category Header */}
                      <button
                        onClick={() => setCollapsedCategories(prev => ({ ...prev, [cat.value]: !prev[cat.value] }))}
                        className={`flex w-full items-center justify-between p-3 text-left font-semibold text-sm ${cat.bg} ${cat.color}`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-base" aria-hidden="true">{cat.icon}</span>
                          <span>{cat.label}</span>
                          <span className="rounded-full bg-white/80 px-2 py-0.5 text-2xs font-bold text-gray-700 shadow-sm">
                            {items.length}
                          </span>
                        </div>
                        <svg 
                          className={`h-4 w-4 transform transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor" 
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Category Items */}
                      {!isCollapsed && (
                        <div className="flex flex-col gap-2 p-3 bg-gray-50/30">
                          {items.map(item => (
                            <FoodItemCard
                              key={item.id}
                              item={item}
                              onEdit={handleStartEdit}
                              onDelete={handleDeleteItem}
                              onConsume={handleConsumeItem}
                              onWaste={handleWasteItem}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. BARCODE SCANNING SCREEN */}
      {activeScreen === 'scan' && (
        <div className="animate-fade-in">
          <Header title="Barcode Scanner" />
          
          <div className="px-4">
            <ScanPrompt onScan={() => alert('📱 Barcode scanner requires Premium Subscription. Upgrade now under Profile tab!')} />
            
            {/* Premium Benefits Banner */}
            <div className="mt-4 rounded-md border border-yellow-200 bg-gradient-to-br from-amber-50 to-orange-50/30 p-5 shadow-sm text-sm space-y-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-1.5 text-base">
                <span className="text-lg" aria-hidden="true">👑</span>
                FoodSpoils Premium Benefits
              </h3>
              <ul className="space-y-2.5 text-xs text-gray-600 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-fresh-500 font-bold" aria-hidden="true">✔</span>
                  <span><strong>Instant Barcode Scanner</strong>: Skip manual entry entirely. Scan and register food in less than a second!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fresh-500 font-bold" aria-hidden="true">✔</span>
                  <span><strong>Unlimited Items</strong>: Track more than 10 food items at once in your pantry.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fresh-500 font-bold" aria-hidden="true">✔</span>
                  <span><strong>Household Sharing</strong>: Sync pantry with up to 5 family members.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fresh-500 font-bold" aria-hidden="true">✔</span>
                  <span><strong>AI Recipes ("Use up!")</strong>: Generate immediate, mouthwatering recipes with soon-to-expire ingredients.</span>
                </li>
              </ul>
              <button
                onClick={() => {
                  setActiveScreen('settings');
                }}
                className="w-full rounded-sm bg-coral-500 py-3 text-xs font-bold text-white hover:bg-coral-600 transition-colors shadow-sm"
              >
                Go to Profile to Upgrade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. WASTE REPORT / ACTIVITY SCREEN */}
      {activeScreen === 'list' && (
        <div className="animate-fade-in">
          <Header title="Waste Report" subtitle="Analyze household statistics" />
          
          {/* Analysis Card */}
          <div className="px-4 pb-4">
            <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-gray-800">📈 Household Impact Overview</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-green-50/50 border border-green-100 p-3 text-center">
                  <span className="text-2xl" aria-hidden="true">😋</span>
                  <p className="mt-1 text-2xs uppercase tracking-wider text-gray-400 font-semibold">Consumed</p>
                  <p className="mt-0.5 text-lg font-bold text-green-700">{totalConsumed} items</p>
                  <p className="text-[10px] text-gray-400">Est. Saved: ${dollarsSaved.toFixed(2)}</p>
                </div>
                <div className="rounded-md bg-red-50/50 border border-red-100 p-3 text-center">
                  <span className="text-2xl" aria-hidden="true">🗑️</span>
                  <p className="mt-1 text-2xs uppercase tracking-wider text-gray-400 font-semibold">Wasted</p>
                  <p className="mt-0.5 text-lg font-bold text-red-700">{totalWasted} items</p>
                  <p className="text-[10px] text-gray-400">Est. Loss: ${dollarsWasted.toFixed(2)}</p>
                </div>
              </div>

              {totalClosed === 0 ? (
                <p className="text-center text-xs text-gray-400 py-2">
                  Complete items in your pantry to generate detailed stats.
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-gray-600">
                    <span>Eaten: {100 - wasteRate}%</span>
                    <span>Wasted: {wasteRate}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-red-200 overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${100 - wasteRate}%` }} />
                  </div>
                  <p className="text-[11px] leading-relaxed text-gray-400 text-center">
                    {wasteRate > 30 
                      ? '⚠️ Your waste rate is a bit high. Try keeping expiring items at the top and plan meals beforehand!'
                      : '🎉 Incredible work! You are keeping food out of the garbage and money in your pocket.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Logs */}
          <div className="px-4 pb-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-800">🕒 Activity Log</h3>
            {historyItems.length === 0 ? (
              <div className="rounded-md border border-gray-200 bg-white p-8 text-center text-gray-400 text-xs">
                No archived items yet. Mark items consumed (✔) or wasted (X) in the Pantry/Dashboard to log history!
              </div>
            ) : (
              <div className="rounded-md border border-gray-200 bg-white overflow-hidden shadow-sm divide-y divide-gray-100">
                {[...historyItems].reverse().map(item => {
                  const cat = CATEGORIES_INFO.find(c => c.value === item.category);
                  const isConsumed = item.status === 'consumed';
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3.5 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg" aria-hidden="true">{cat?.icon || '📋'}</span>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm text-gray-800 truncate">{item.name}</h4>
                          <p className="text-2xs text-gray-400">
                            {item.quantity} {item.unit} · expired {item.expiryDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`rounded px-2 py-0.5 text-2xs font-bold ${
                          isConsumed ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                          {isConsumed ? 'Consumed' : 'Wasted'}
                        </span>
                        {item.id !== undefined && (
                          <button
                            onClick={() => handleRestoreItem(item.id!)}
                            className="p-1.5 text-gray-300 hover:text-gray-600 transition-colors"
                            title="Restore item to Pantry"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. PROFILE & SETTINGS SCREEN */}
      {activeScreen === 'settings' && (
        <div className="animate-fade-in">
          <Header title="Settings & Profile" />
          
          {/* Plan Banner */}
          <div className="mx-4 mb-4 rounded-md border border-gray-200 bg-white p-4 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xs uppercase tracking-wider text-gray-400 font-bold">Current Plan</p>
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-1">
                  {isPremium ? (
                    <>
                      <span className="text-fresh-500" aria-hidden="true">👑</span> FoodSpoils Premium
                    </>
                  ) : (
                    'FoodSpoils Free'
                  )}
                </h3>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-2xs font-bold ${
                isPremium ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {isPremium ? 'Unlimited' : 'Basic Tier'}
              </span>
            </div>

            {/* If Free Tier - Show item usage progress */}
            {!isPremium && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-2xs font-medium text-gray-400">
                  <span>Pantry Capacity Usage</span>
                  <span>{activeItems.length} / 10 items</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${activeItems.length >= 9 ? 'bg-red-500' : 'bg-fresh-500'}`} 
                    style={{ width: `${Math.min(100, (activeItems.length / 10) * 100)}%` }} 
                  />
                </div>
              </div>
            )}

            {/* Toggle Plan Actions */}
            {isPremium ? (
              <button
                onClick={() => handleUpgradePremium(false)}
                className="w-full rounded-sm border border-red-200 bg-red-50 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
              >
                Downgrade to Free Tier (Simulate)
              </button>
            ) : (
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpgradePremium(true)}
                    className="rounded-sm bg-fresh-500 py-3 text-2xs font-bold text-white hover:bg-fresh-600 transition-colors text-center shadow-xs"
                  >
                    Monthly ($4.99)
                  </button>
                  <button
                    onClick={() => handleUpgradePremium(true)}
                    className="relative rounded-sm bg-coral-500 py-3 text-2xs font-bold text-white hover:bg-coral-600 transition-colors text-center shadow-xs"
                  >
                    Annual ($39.99 - Save 33%)
                    <span className="absolute -top-1.5 -right-1.5 rounded-full bg-red-500 px-1.5 py-0.5 text-[8px] text-white font-extrabold shadow-sm animate-pulse">
                      Save
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Database Actions */}
          <div className="mx-4 mb-4 rounded-md border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-gray-800">🛠️ Developer & Sandbox Tools</h3>
            
            <div className="space-y-2">
              <button
                onClick={handleSeedSampleData}
                className="w-full flex items-center justify-center gap-2 rounded-sm border border-gray-200 bg-white py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-touch"
              >
                <svg className="h-4 w-4 text-fresh-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Seed Sample Grocery Data
              </button>
              
              <button
                onClick={handleClearDatabase}
                className="w-full flex items-center justify-center gap-2 rounded-sm border border-red-100 bg-white py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors min-h-touch"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Reset Database (Clear All)
              </button>
            </div>
          </div>

          {/* Info Block */}
          <div className="mx-4 text-center space-y-1">
            <p className="text-2xs text-gray-400 font-semibold">FoodSpoils App v1.1.0 · PWA Ready</p>
            <p className="text-[10px] text-gray-300">Ratified and Owner-Endorsed on 2026-06-22</p>
          </div>
        </div>
      )}

      {/* OVERLAY: ADD / EDIT ITEM DRAWER */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-t-3xl shadow-xl p-5 space-y-4 animate-slide-up relative">
            
            {/* Header / Cancel Button */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-base font-bold text-gray-800">
                {editingItem ? '✏️ Edit Food Item' : '🥬 Add Pantry Item'}
              </h3>
              <button
                onClick={handleCancelForm}
                className="rounded-full bg-gray-100 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Inline AddItemForm */}
            <AddItemForm 
              onSubmit={handleSubmitForm}
              onCancel={handleCancelForm}
              initialItem={editingItem || undefined}
              className="border-none shadow-none !p-0 !bg-transparent"
            />
          </div>
        </div>
      )}

      {/* BOTTOM TAB NAVIGATION BAR */}
      <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />

    </div>
  );
}
