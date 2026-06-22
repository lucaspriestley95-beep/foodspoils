import React, { useState } from 'react';

interface AddItemFormProps {
  onSubmit: (item: {
    name: string;
    category: string;
    expiryDate: string;
    quantity: number;
    unit: string;
    notes?: string;
  }) => void;
  onCancel?: () => void;
  initialItem?: {
    name: string;
    category: string;
    expiryDate: string;
    quantity: number;
    unit: string;
    notes?: string;
  };
  className?: string;
}

const CATEGORIES = [
  { value: 'dairy', label: 'Dairy', icon: '🥛' },
  { value: 'produce', label: 'Produce', icon: '🥬' },
  { value: 'meat', label: 'Meat', icon: '🥩' },
  { value: 'seafood', label: 'Seafood', icon: '🐟' },
  { value: 'grains', label: 'Grains & Pasta', icon: '🌾' },
  { value: 'condiments', label: 'Condiments', icon: '🧂' },
  { value: 'beverages', label: 'Beverages', icon: '🥤' },
  { value: 'frozen', label: 'Frozen', icon: '🧊' },
  { value: 'snacks', label: 'Snacks', icon: '🍿' },
  { value: 'pantry', label: 'Pantry', icon: '📦' },
  { value: 'other', label: 'Other', icon: '📋' },
];

const UNITS = ['piece(s)', 'oz', 'lb', 'g', 'kg', 'cup', 'tbsp', 'tsp', 'fl oz', 'ml', 'L', 'box', 'can', 'jar', 'bunch', 'bag'];

export function AddItemForm({ onSubmit, onCancel, initialItem, className = '' }: AddItemFormProps) {
  const [name, setName] = useState(() => initialItem?.name || '');
  const [category, setCategory] = useState(() => initialItem?.category || 'dairy');
  const [expiryDate, setExpiryDate] = useState(() => initialItem?.expiryDate || '');
  const [quantity, setQuantity] = useState(() => initialItem?.quantity || 1);
  const [unit, setUnit] = useState(() => initialItem?.unit || 'piece(s)');
  const [notes, setNotes] = useState(() => initialItem?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !expiryDate) return;
    onSubmit({ name: name.trim(), category, expiryDate, quantity, unit, notes: notes.trim() || undefined });
    setName('');
    setExpiryDate('');
    setQuantity(1);
    setUnit('piece(s)');
    setNotes('');
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <form
      onSubmit={handleSubmit}
      className={`animate-slide-up rounded-md border border-gray-200 bg-white p-4 shadow-sm ${className}`}
    >
      <h2 className="mb-4 text-lg font-semibold text-gray-800">{initialItem ? 'Edit Item' : 'Add New Item'}</h2>

      {/* Name */}
      <div className="mb-3">
        <label htmlFor="item-name" className="mb-1 block text-sm font-medium text-gray-600">
          Item Name *
        </label>
        <input
          id="item-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Baby spinach, Chicken breast..."
          required
          className="w-full rounded-sm border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors focus:border-fresh-500 focus:bg-white focus:ring-2 focus:ring-fresh-500/20"
        />
      </div>

      {/* Category */}
      <div className="mb-3">
        <label htmlFor="item-category" className="mb-1 block text-sm font-medium text-gray-600">
          Category
        </label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={`flex flex-col items-center gap-1 rounded-sm p-2 text-xs transition-colors ${
                category === cat.value
                  ? 'bg-fresh-100 text-fresh-700 ring-2 ring-fresh-500/40'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg" aria-hidden="true">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Expiry Date & Quantity row */}
      <div className="mb-3 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="item-expiry" className="mb-1 block text-sm font-medium text-gray-600">
            Expiry Date *
          </label>
          <input
            id="item-expiry"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            min={minDate}
            required
            className="w-full rounded-sm border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-fresh-500 focus:bg-white focus:ring-2 focus:ring-fresh-500/20"
          />
        </div>
        <div>
          <label htmlFor="item-qty" className="mb-1 block text-sm font-medium text-gray-600">
            Quantity
          </label>
          <div className="flex gap-2">
            <input
              id="item-qty"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 rounded-sm border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-fresh-500 focus:bg-white focus:ring-2 focus:ring-fresh-500/20"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="flex-1 rounded-sm border border-gray-200 bg-gray-50 px-2 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-fresh-500 focus:bg-white focus:ring-2 focus:ring-fresh-500/20"
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <label htmlFor="item-notes" className="mb-1 block text-sm font-medium text-gray-600">
          Notes (optional)
        </label>
        <input
          id="item-notes"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Bought on sale, shared with roommate..."
          className="w-full rounded-sm border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors focus:border-fresh-500 focus:bg-white focus:ring-2 focus:ring-fresh-500/20"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 rounded-sm bg-fresh-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-fresh-600 active:bg-fresh-700 min-h-touch"
        >
          {initialItem ? 'Save Changes' : 'Add Item'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="min-h-touch rounded-sm border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 active:bg-gray-100"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}