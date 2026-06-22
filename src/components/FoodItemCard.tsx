import { StatusBadge, getExpiryStatus, getDaysRemaining } from './StatusBadge';
import { type FoodItem } from '../db';

interface FoodItemCardProps {
  item: FoodItem;
  onDelete?: (id: number) => void;
  onEdit?: (item: FoodItem) => void;
  onConsume?: (id: number) => void;
  onWaste?: (id: number) => void;
  className?: string;
}

const categoryIcons: Record<string, string> = {
  dairy: '🥛',
  produce: '🥬',
  meat: '🥩',
  seafood: '🐟',
  grains: '🌾',
  condiments: '🧂',
  beverages: '🥤',
  frozen: '🧊',
  snacks: '🍿',
  pantry: '📦',
  other: '📋',
};

export function FoodItemCard({ item, onDelete, onEdit, onConsume, onWaste, className = '' }: FoodItemCardProps) {
  const status = getExpiryStatus(item.expiryDate);
  const daysRemaining = getDaysRemaining(item.expiryDate);
  
  // Make key matching case-insensitive
  const catKey = item.category.toLowerCase();
  let icon = categoryIcons.other;
  if (catKey.includes('dairy')) icon = categoryIcons.dairy;
  else if (catKey.includes('produce') || catKey.includes('vegetable') || catKey.includes('fruit')) icon = categoryIcons.produce;
  else if (catKey.includes('meat') || catKey.includes('poultry') || catKey.includes('seafood') || catKey.includes('fish')) icon = categoryIcons.meat;
  else if (catKey.includes('grain') || catKey.includes('pasta') || catKey.includes('bread')) icon = categoryIcons.grains;
  else if (catKey.includes('condiment') || catKey.includes('sauce') || catKey.includes('spice')) icon = categoryIcons.condiments;
  else if (catKey.includes('beverage') || catKey.includes('drink') || catKey.includes('milk')) icon = categoryIcons.beverages;
  else if (catKey.includes('frozen') || catKey.includes('ice')) icon = categoryIcons.frozen;
  else if (catKey.includes('snack') || catKey.includes('cookie') || catKey.includes('chip')) icon = categoryIcons.snacks;
  else if (catKey.includes('pantry') || catKey.includes('can') || catKey.includes('box')) icon = categoryIcons.pantry;

  const statusBorderColors: Record<string, string> = {
    fresh: 'border-l-status-fresh',
    soon: 'border-l-status-soon',
    urgent: 'border-l-status-urgent',
    expired: 'border-l-status-expired',
  };

  return (
    <div
      className={`relative animate-fade-in rounded-md border border-gray-200 bg-white border-l-4 ${statusBorderColors[status] || 'border-l-gray-300'} shadow-sm transition-shadow hover:shadow-md ${className}`}
      role="listitem"
      aria-label={`${item.name}, expires ${item.expiryDate}`}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Category Icon */}
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-fresh-50 text-lg" aria-hidden="true">
          {icon}
        </span>

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <h3 className="truncate text-base font-semibold text-gray-800">{item.name}</h3>
          <p className="mt-0.5 text-sm text-gray-400">
            {item.quantity} {item.unit} · {item.category}
          </p>
          {item.notes && (
            <p className="mt-1 text-xs italic text-gray-500 truncate" title={item.notes}>
              "{item.notes}"
            </p>
          )}
          <div className="mt-1.5">
            <StatusBadge status={status} daysRemaining={daysRemaining} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row items-center gap-1">
          {onConsume && item.id !== undefined && (
            <button
              onClick={() => onConsume(item.id!)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-green-50 hover:text-green-600 active:bg-green-100"
              aria-label={`Consume ${item.name}`}
              title="Ate it!"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
          {onWaste && item.id !== undefined && (
            <button
              onClick={() => onWaste(item.id!)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-orange-50 hover:text-orange-500 active:bg-orange-100"
              aria-label={`Waste ${item.name}`}
              title="Threw away"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 active:bg-gray-200"
              aria-label={`Edit ${item.name}`}
              title="Edit item"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && item.id !== undefined && (
            <button
              onClick={() => onDelete(item.id!)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 active:bg-red-100"
              aria-label={`Delete ${item.name}`}
              title="Delete item"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
