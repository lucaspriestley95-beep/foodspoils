import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type FoodItem } from './db';
import { supabase, type DbFoodItem } from './lib/supabase';
import { useAuth } from './contexts/AuthContext';
import { STRIPE_LINKS } from './lib/stripe-links';
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
  ReferralSection,
  ProfileCustomization,
  AuthScreen,
  RecipeSuggestions,
  BarcodeScanner,
  type ScreenKey
} from './components';

const CATEGORIES_INFO = [
  { value: 'vegetables', label: 'Vegetables', icon: '🥦', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { value: 'fruits', label: 'Fruits', icon: '🍎', color: 'text-rose-500', bg: 'bg-rose-50' },
  { value: 'dairy', label: 'Dairy', icon: '🥛', color: 'text-amber-600', bg: 'bg-amber-50' },
  { value: 'meat', label: 'Meat', icon: '🥩', color: 'text-rose-600', bg: 'bg-rose-50' },
  { value: 'seafood', label: 'Seafood', icon: '🐟', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { value: 'deli', label: 'Deli', icon: '🥪', color: 'text-orange-700', bg: 'bg-orange-50' },
  { value: 'grains', label: 'Grains & Bakery', icon: '🌾', color: 'text-yellow-700', bg: 'bg-yellow-50' },
  { value: 'breakfast', label: 'Breakfast', icon: '🥣', color: 'text-purple-600', bg: 'bg-purple-50' },
  { value: 'canned-goods', label: 'Canned Goods', icon: '🥫', color: 'text-gray-600', bg: 'bg-gray-100' },
  { value: 'sauces-oils', label: 'Sauces & Oils', icon: '🏺', color: 'text-teal-600', bg: 'bg-teal-50' },
  { value: 'spices-herbs', label: 'Spices & Herbs', icon: '🌿', color: 'text-green-700', bg: 'bg-green-50' },
  { value: 'baking', label: 'Baking', icon: '🥯', color: 'text-amber-700', bg: 'bg-amber-50' },
  { value: 'international', label: 'International', icon: '🏮', color: 'text-red-600', bg: 'bg-red-50' },
  { value: 'beverages', label: 'Beverages', icon: '🥤', color: 'text-blue-600', bg: 'bg-blue-50' },
  { value: 'frozen', label: 'Frozen', icon: '🧊', color: 'text-sky-500', bg: 'bg-sky-50' },
  { value: 'snacks', label: 'Snacks', icon: '🍿', color: 'text-orange-600', bg: 'bg-orange-50' },
  { value: 'pantry', label: 'Pantry', icon: '📦', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { value: 'other', label: 'Other', icon: '📋', color: 'text-slate-500', bg: 'bg-slate-50' },
];

export default function App() {
  const { user, signOut } = useAuth();
  
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
  const [initialBarcode, setInitialBarcode] = useState<string | undefined>(undefined);

  // Supabase Data State
  const [cloudItems, setCloudItems] = useState<DbFoodItem[]>([]);
  const [cloudLoading, setCloudItemsLoading] = useState(false);

  // Premium state (Supabase profile is source of truth)
  const [isPremium, setIsPremium] = useState(false);

  // Body scroll lock when modal is open
  useEffect(() => {
    if (showAddForm) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = 'unset';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = 'unset';
    };
  }, [showAddForm]);

  // Fetch Supabase data when user is logged in
  useEffect(() => {
    if (user) {
      fetchCloudData();
    } else {
      setCloudItems([]);
    }
  }, [user]);

  const fetchCloudData = async () => {
    if (!user) return;
    setCloudItemsLoading(true);
    
    // Fetch profile
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileData) {
      setIsPremium(profileData.is_premium);
    }

    // Fetch items
    const { data: itemsData } = await supabase
      .from('food_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (itemsData) {
      setCloudItems(itemsData);
    }
    setCloudItemsLoading(false);
  };

  // Check URL query parameters for return
  useEffect(() => {
    // stripe_payment handler removed for security
  }, [user]);

  // Database Queries (Local Dexie)
  const localActiveItems = useLiveQuery(() => db.items.where('status').equals('active').toArray()) || [];
  const localHistoryItems = useLiveQuery(() => db.items.where('status').anyOf('consumed', 'wasted').toArray()) || [];

  // Unified data access (Cloud if logged in, otherwise local)
  const activeItems = user 
    ? cloudItems.filter(i => i.status === 'active').map(i => ({
        id: i.id as any, // adapt ID types
        name: i.name,
        category: i.category,
        expiryDate: i.expiry_date,
        quantity: i.quantity,
        unit: i.unit,
        notes: i.notes,
        status: i.status,
        createdAt: new Date(i.created_at).getTime()
      }))
    : localActiveItems;

  const historyItems = user
    ? cloudItems.filter(i => i.status !== 'active').map(i => ({
        id: i.id as any,
        name: i.name,
        category: i.category,
        expiryDate: i.expiry_date,
        quantity: i.quantity,
        unit: i.unit,
        notes: i.notes,
        status: i.status,
        createdAt: new Date(i.created_at).getTime()
      }))
    : localHistoryItems;

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
    expiryDate: string | null;
    quantity: number;
    unit: string;
    notes?: string;
  }) => {
    // Check active item limit for Free Tier
    if (!isPremium && activeItems.length >= 10 && !editingItem) {
      if (confirm('⚠️ Free Tier Limit Reached!\n\nAs a Free user, you can track up to 10 active items. Would you like to upgrade to Premium for unlimited items?')) {
        handleRedirectToStripe('monthly');
      }
      return;
    }

    if (editingItem) {
      // Edit mode
      if (user) {
        const { error } = await supabase
          .from('food_items')
          .update({
            name: formData.name,
            category: formData.category,
            expiry_date: formData.expiryDate,
            quantity: formData.quantity,
            unit: formData.unit,
            notes: formData.notes
          })
          .eq('id', editingItem.id);
        if (!error) fetchCloudData();
      } else {
        await db.items.update(editingItem.id as number, {
          name: formData.name,
          category: formData.category,
          expiryDate: formData.expiryDate,
          quantity: formData.quantity,
          unit: formData.unit,
          notes: formData.notes
        });
      }
      setEditingItem(null);
    } else {
      // Add mode
      if (user) {
        const { error } = await supabase
          .from('food_items')
          .insert({
            user_id: user.id,
            name: formData.name,
            category: formData.category,
            expiry_date: formData.expiryDate,
            quantity: formData.quantity,
            unit: formData.unit,
            notes: formData.notes,
            status: 'active'
          });
        if (!error) fetchCloudData();
      } else {
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
    }
    setShowAddForm(false);
  };

  const handleStartEdit = (item: FoodItem) => {
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleCancelForm = () => {
    setEditingItem(null);
    setInitialBarcode(undefined);
    setShowAddForm(false);
  };

  // Quick Actions
  const handleConsumeItem = async (id: number | string) => {
    if (user) {
      await supabase.from('food_items').update({ status: 'consumed' }).eq('id', id);
      fetchCloudData();
    } else {
      await db.items.update(id as number, { status: 'consumed' });
    }
  };

  const handleWasteItem = async (id: number | string) => {
    if (user) {
      await supabase.from('food_items').update({ status: 'wasted' }).eq('id', id);
      fetchCloudData();
    } else {
      await db.items.update(id as number, { status: 'wasted' });
    }
  };

  const handleDeleteItem = async (id: number | string) => {
    if (confirm('Are you sure you want to permanently delete this item?')) {
      if (user) {
        await supabase.from('food_items').delete().eq('id', id);
        fetchCloudData();
      } else {
        await db.items.delete(id as number);
      }
    }
  };

  const handleRestoreItem = async (id: number | string) => {
    if (user) {
      await supabase.from('food_items').update({ status: 'active' }).eq('id', id);
      fetchCloudData();
    } else {
      await db.items.update(id as number, { status: 'active' });
    }
  };

  // Seeding Sample Data
  const handleSeedSampleData = async () => {
    const sampleItems = [
      { name: 'Baby Spinach', category: 'produce', expiryDate: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0], quantity: 1, unit: 'bag', notes: 'For morning smoothies' },
      { name: 'Whole Milk', category: 'dairy', expiryDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], quantity: 1, unit: 'gallon', notes: 'Good for cereals' },
      { name: 'Chicken Breast', category: 'meat', expiryDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], quantity: 2, unit: 'lb', notes: 'Smell test before cooking' },
      { name: 'Greek Yogurt', category: 'dairy', expiryDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0], quantity: 1, unit: 'container' },
      { name: 'Sourdough Bread', category: 'grains', expiryDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], quantity: 1, unit: 'loaf', notes: 'Best if toasted' }
    ];

    if (user) {
      const { error } = await supabase.from('food_items').insert(
        sampleItems.map(item => ({
          user_id: user.id,
          name: item.name,
          category: item.category,
          expiry_date: item.expiryDate,
          quantity: item.quantity,
          unit: item.unit,
          notes: item.notes,
          status: 'active'
        }))
      );
      if (!error) fetchCloudData();
    } else {
      await db.items.clear();
      for (const item of sampleItems) {
        await db.items.add({ ...item, status: 'active', createdAt: Date.now() } as FoodItem);
      }
    }
    alert('🎉 Sample grocery data successfully seeded!');
  };

  // Clearing DB
  const handleClearDatabase = async () => {
    if (confirm('Are you sure you want to clear your entire pantry and history? This cannot be undone.')) {
      if (user) {
        await supabase.from('food_items').delete().eq('user_id', user.id);
        fetchCloudData();
      } else {
        await db.items.clear();
      }
      alert('🧹 Database successfully cleared!');
    }
  };

  // Redirect to Stripe Secure Checkout
  const handleRedirectToStripe = (plan: 'monthly' | 'annual') => {
    window.open(STRIPE_LINKS[plan], '_blank');
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

  // Pro Tips
  const PRO_TIPS = [
    "Keep berries fresh! Rinse them in a mix of 1 part vinegar and 3 parts water before storing.",
    "Avocados ripening too fast? Put them in the fridge to pause the ripening process.",
    "Wrap banana stems in plastic wrap to keep them yellow longer.",
    "Store tomatoes at room temperature. The fridge ruins their flavor and texture!",
    "Treat fresh herbs like flowers. Snip the stems and put them in a glass of water in the fridge.",
    "Hard cheese lasts longer if you wrap it in parchment paper, not plastic.",
    "Keep bread fresh by storing it in a bread box or freezing it. The fridge makes it stale faster.",
    "Store eggs in their original carton on a shelf inside the fridge, not on the door.",
    "Keep potatoes in a cool, dark, dry place away from onions (they make each other sprout!).",
    "Store onions in a cool, dark, dry place. A pantyhose works great for hanging them!",
    "Revive wilted lettuce by soaking it in ice water for 10-15 minutes.",
    "Keep milk on a shelf inside the fridge, not the door where the temperature fluctuates.",
    "Store mushrooms in a brown paper bag in the fridge to absorb moisture and keep them firm.",
    "Garlic loves cool, dry, dark places with good air circulation.",
    "Apples produce ethylene gas that ripens other fruits. Store them away from other produce!"
  ];
  
  const [currentTip, setCurrentTip] = useState(PRO_TIPS[0]);

  useEffect(() => {
    setCurrentTip(PRO_TIPS[Math.floor(Math.random() * PRO_TIPS.length)]);
  }, []);

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
  const dollarsWasted = totalWasted * 4.5;
  const dollarsSaved = totalConsumed * 4.5;

  return (
    <div className="mx-auto min-h-screen max-w-md bg-gray-50 font-sans shadow-sm border-x border-gray-100">
      
      {/* 1. DASHBOARD SCREEN */}
      {activeScreen === 'dashboard' && (
        <div className="animate-fade-in">
          <Header 
            title="FoodSpoils" 
            subtitle="Track freshness. Save money." 
            onScan={() => setActiveScreen('scan')} 
          />
          <WelcomeHeader userName={user?.email?.split('@')[0] || "Alex"} itemCount={activeItems.length} />
          
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

          <div className="mx-4 mb-4 flex gap-3 rounded-md border border-green-100 bg-green-50 p-4 text-xs text-green-800">
            <span className="text-xl" aria-hidden="true">💡</span>
            <div className="space-y-1">
              <p className="font-bold text-green-900">Pro Tip</p>
              <p className="leading-relaxed">
                {currentTip}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. RECIPE SUGGESTIONS SCREEN */}
      {activeScreen === 'recipes' && (
        <div className="animate-fade-in">
          <Header title="Use It Up" subtitle="Cook before it spoils" />
          <RecipeSuggestions 
            activeItems={activeItems} 
            isPremium={isPremium} 
            onUpgrade={() => setActiveScreen('settings')} 
          />
        </div>
      )}

      {/* 3. PANTRY SCREEN */}
      {activeScreen === 'pantry' && (
        <div className="animate-fade-in">
          <Header title="Pantry" subtitle={user ? "Cloud Synced" : "Everything you have"} />
          
          <div className="px-4 pb-3">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800">📋 Inventory</h2>
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

            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setFilterCategory('All')}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                  filterCategory === 'All' ? 'bg-gray-800 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                All ({activeItems.length})
              </button>
              <button
                onClick={() => setFilterCategory('Expiring Soon')}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  filterCategory === 'Expiring Soon' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                ⚠️ Expiring Soon
              </button>
              <button
                onClick={() => setFilterCategory('Expired')}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  filterCategory === 'Expired' ? 'bg-red-500 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
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
                      filterCategory === cat.value ? 'bg-fresh-500 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
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

          <div className="px-4 pb-4">
            {cloudLoading ? (
              <div className="py-12 text-center text-gray-400 text-sm animate-pulse">☁️ Syncing items...</div>
            ) : activeItems.length === 0 ? (
              <EmptyPantry onAddItem={() => setShowAddForm(true)} />
            ) : filteredActiveItems.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">🔍 No items match.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {CATEGORIES_INFO.map(cat => {
                  const items = itemsByCategory[cat.value] || [];
                  if (items.length === 0) return null;
                  const isCollapsed = collapsedCategories[cat.value];
                  return (
                    <div key={cat.value} className="rounded-md border border-gray-200 bg-white overflow-hidden shadow-sm">
                      <button
                        onClick={() => setCollapsedCategories(prev => ({ ...prev, [cat.value]: !prev[cat.value] }))}
                        className={`flex w-full items-center justify-between p-3 text-left font-semibold text-sm ${cat.bg} ${cat.color}`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-base" aria-hidden="true">{cat.icon}</span>
                          <span>{cat.label}</span>
                          <span className="rounded-full bg-white/80 px-2 py-0.5 text-2xs font-bold text-gray-700 shadow-sm">{items.length}</span>
                        </div>
                        <svg className={`h-4 w-4 transform transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {!isCollapsed && (
                        <div className="flex flex-col gap-2 p-3 bg-gray-50/30">
                          {items.map(item => (
                            <FoodItemCard key={item.id} item={item} onEdit={handleStartEdit} onDelete={handleDeleteItem} onConsume={handleConsumeItem} onWaste={handleWasteItem} />
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
            {isPremium ? (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
                  <BarcodeScanner 
                    onScan={async (barcode: string) => {
                      setInitialBarcode(barcode);
                      setShowAddForm(true);
                    }} 
                    onClose={() => setActiveScreen('dashboard')} 
                  />
                </div>
                
                <div className="rounded-md border border-fresh-100 bg-fresh-50/50 p-4 text-xs text-fresh-800">
                  <p className="font-bold mb-1">Scanning Active</p>
                  <p>Point your camera at a food barcode. It will be identified and added to your pantry instantly.</p>
                </div>
              </div>
            ) : (
              <>
                <ScanPrompt onScan={() => {}} />
                <div className="mt-4 rounded-md border border-yellow-200 bg-gradient-to-br from-amber-50 to-orange-50/30 p-5 shadow-sm text-sm space-y-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-1.5 text-base">👑 FoodSpoils Premium Benefits</h3>
                  <ul className="space-y-2.5 text-xs text-gray-600 font-medium">
                    <li className="flex items-start gap-2"><span>✅</span><span><strong>Instant Barcode Scanner</strong>: Skip manual entry entirely.</span></li>
                    <li className="flex items-start gap-2"><span>✅</span><span><strong>Cloud Sync</strong>: Access your pantry from any device.</span></li>
                    <li className="flex items-start gap-2"><span>✅</span><span><strong>Household Sharing</strong>: Sync pantry with up to 5 family members.</span></li>
                    <li className="flex items-start gap-2"><span>✅</span><span><strong>AI Recipes</strong>: Use ingredients before they expire.</span></li>
                  </ul>
                  <button onClick={() => setActiveScreen('settings')} className="w-full rounded-sm bg-coral-500 py-3 text-xs font-bold text-white hover:bg-coral-600 transition-colors shadow-sm">Go to Profile to Upgrade</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 4. WASTE REPORT SCREEN */}
      {activeScreen === 'list' && (
        <div className="animate-fade-in">
          <Header title="Waste Report" subtitle="Analyze household statistics" />
          <div className="px-4 pb-4">
            <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-gray-800">📈 Household Impact Overview</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-green-50/50 border border-green-100 p-3 text-center">
                  <span className="text-2xl">😋</span>
                  <p className="mt-1 text-2xs uppercase tracking-wider text-gray-400 font-semibold">Consumed</p>
                  <p className="mt-0.5 text-lg font-bold text-green-700">{totalConsumed} items</p>
                  <p className="text-[10px] text-gray-400">Est. Saved: ${dollarsSaved.toFixed(2)}</p>
                </div>
                <div className="rounded-md bg-red-50/50 border border-red-100 p-3 text-center">
                  <span className="text-2xl">🗑️</span>
                  <p className="mt-1 text-2xs uppercase tracking-wider text-gray-400 font-semibold">Wasted</p>
                  <p className="mt-0.5 text-lg font-bold text-red-700">{totalWasted} items</p>
                  <p className="text-[10px] text-gray-400">Est. Loss: ${dollarsWasted.toFixed(2)}</p>
                </div>
              </div>
              {totalClosed === 0 ? (
                <p className="text-center text-xs text-gray-400 py-2">Complete items to generate stats.</p>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-gray-600"><span>Eaten: {100 - wasteRate}%</span><span>Wasted: {wasteRate}%</span></div>
                  <div className="h-2 w-full rounded-full bg-red-200 overflow-hidden"><div className="h-full bg-green-500" style={{ width: `${100 - wasteRate}%` }} /></div>
                </div>
              )}
            </div>
          </div>
          <div className="px-4 pb-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-800">🕒 Activity Log</h3>
            {historyItems.length === 0 ? (
              <div className="rounded-md border border-gray-200 bg-white p-8 text-center text-gray-400 text-xs">No archived items yet.</div>
            ) : (
              <div className="rounded-md border border-gray-200 bg-white overflow-hidden shadow-sm divide-y divide-gray-100">
                {[...historyItems].reverse().map(item => {
                  const cat = CATEGORIES_INFO.find(c => c.value === item.category);
                  const isConsumed = item.status === 'consumed';
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3.5 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg">{cat?.icon || '📋'}</span>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm text-gray-800 truncate">{item.name}</h4>
                          <p className="text-2xs text-gray-400">{item.quantity} {item.unit} · {item.expiryDate ? `expired ${item.expiryDate}` : 'no expiry'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`rounded px-2 py-0.5 text-2xs font-bold ${isConsumed ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>{isConsumed ? 'Consumed' : 'Wasted'}</span>
                        <button onClick={() => handleRestoreItem(item.id)} className="p-1.5 text-gray-300 hover:text-gray-600 transition-colors" title="Restore item to Pantry"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3" /></svg></button>
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
          
          <ReferralSection />
          
          {user && <ProfileCustomization />}

          {/* User Account Section */}
          <div className="mx-4 mb-4 rounded-md border border-gray-200 bg-white p-4 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
              <svg className="h-4 w-4 text-fresh-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Account
            </h3>
            
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 font-medium">{user.email}</p>
                  <button 
                    onClick={signOut}
                    className="text-xs font-bold text-coral-500 hover:text-coral-600 underline"
                  >
                    Sign Out
                  </button>
                </div>
                <div className="bg-fresh-50 rounded p-2 text-[10px] text-fresh-700 font-medium">
                  ☁️ Cloud Sync Active
                </div>
              </div>
            ) : (
              <AuthScreen onSuccess={() => {}} />
            )}
          </div>

          <div className="mx-4 mb-4 rounded-md border border-gray-200 bg-white p-4 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xs uppercase tracking-wider text-gray-400 font-bold">Current Plan</p>
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-1">
                  {isPremium ? <><span className="text-fresh-500">👑</span> FoodSpoils Premium</> : 'FoodSpoils Free'}
                </h3>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-2xs font-bold ${isPremium ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{isPremium ? 'Unlimited' : 'Basic Tier'}</span>
            </div>

            {!isPremium && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-2xs font-medium text-gray-400"><span>Pantry Capacity Usage</span><span>{activeItems.length} / 10 items</span></div>
                <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden"><div className={`h-full transition-all duration-300 ${activeItems.length >= 9 ? 'bg-red-500' : 'bg-fresh-500'}`} style={{ width: `${Math.min(100, (activeItems.length / 10) * 100)}%` }} /></div>
              </div>
            )}

            {isPremium ? (
              <div className="bg-green-50 border border-green-100 rounded p-3 text-xs text-green-700 font-medium">
                ✨ Your premium subscription is active. Thank you for your support!
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button onClick={() => handleRedirectToStripe('monthly')} className="rounded-sm bg-fresh-500 py-3 text-2xs font-bold text-white hover:bg-fresh-600 transition-colors text-center shadow-xs">Monthly ($4.99)</button>
                <button onClick={() => handleRedirectToStripe('annual')} className="relative rounded-sm bg-coral-500 py-3 text-2xs font-bold text-white hover:bg-coral-600 transition-colors text-center shadow-xs">Annual ($39.99 - Save 33%)<span className="absolute -top-1.5 -right-1.5 rounded-full bg-red-500 px-1.5 py-0.5 text-[8px] text-white font-extrabold shadow-sm animate-pulse">Save</span></button>
              </div>
            )}
          </div>

          <div className="mx-4 mb-4 rounded-md border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-gray-800">🛠️ Developer Tools</h3>
            <div className="space-y-2">
              <button onClick={handleSeedSampleData} className="w-full flex items-center justify-center gap-2 rounded-sm border border-gray-200 bg-white py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-touch"><span>🌱</span> Seed Sample Grocery Data</button>
              <button onClick={handleClearDatabase} className="w-full flex items-center justify-center gap-2 rounded-sm border border-red-100 bg-white py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors min-h-touch"><span>🗑️</span> Reset Database (Clear All)</button>
            </div>
          </div>
          <div className="mx-4 text-center space-y-1"><p className="text-2xs text-gray-400 font-semibold">FoodSpoils App v1.2.0 · Supabase Ready</p></div>
        </div>
      )}

      {showAddForm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCancelForm();
          }}
          onTouchMove={(e) => e.preventDefault()}
        >
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-5 space-y-4 relative max-h-[90vh] overflow-y-auto mx-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-base font-bold text-gray-800">{editingItem ? '✏️ Edit Food Item' : '🥬 Add Pantry Item'}</h3>
              <button onClick={handleCancelForm} className="rounded-full bg-gray-100 p-1.5 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <AddItemForm onSubmit={handleSubmitForm} onCancel={handleCancelForm} initialItem={editingItem || undefined} initialBarcode={initialBarcode} isPremium={isPremium} className="border-none shadow-none !p-0 !bg-transparent" />
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      {!showAddForm && onboardingCompleted && (activeScreen === 'dashboard' || activeScreen === 'pantry' || activeScreen === 'list' || activeScreen === 'recipes') && (
        <button
          onClick={() => setShowAddForm(true)}
          className="fixed bottom-24 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-fresh-500 text-white shadow-lg shadow-fresh-500/40 transition-all hover:bg-fresh-600 hover:scale-110 active:scale-95"
          aria-label="Add Item"
        >
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {!showAddForm && <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />}
    </div>
  );
}
