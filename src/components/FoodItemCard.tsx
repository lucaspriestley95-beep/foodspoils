import { StatusBadge, getExpiryStatus, getDaysRemaining } from './StatusBadge';
import { type FoodItem } from '../db';
import { CategoryIcon } from './CategoryIcon';

interface FoodItemCardProps {
  item: FoodItem;
  onDelete?: (id: number) => void;
  onEdit?: (item: FoodItem) => void;
  onConsume?: (id: number) => void;
  onWaste?: (id: number) => void;
  className?: string;
}

export function FoodItemCard({ item, onDelete, onEdit, onConsume, onWaste, className = '' }: FoodItemCardProps) {
  const status = getExpiryStatus(item.expiryDate);
  const daysRemaining = getDaysRemaining(item.expiryDate);

  const statusBorderColors: Record<string, string> = {
    fresh: 'border-l-status-fresh',
    soon: 'border-l-status-soon',
    urgent: 'border-l-status-urgent',
    expired: 'border-l-status-expired',
    'non-perishable': 'border-l-gray-400',
  };

  return (
    <div
      className={`relative animate-fade-in rounded-md border border-gray-700 bg-gray-800 border-l-4 ${statusBorderColors[status] || 'border-l-gray-300'} shadow-sm transition-shadow hover:shadow-md ${className}`}
      role="listitem"
      aria-label={`${item.name}, ${item.expiryDate ? `expires ${item.expiryDate}` : 'no expiry'}`}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Category Icon */}
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-fresh-950/30 text-lg text-fresh-400" aria-hidden="true">
          <CategoryIcon category={item.category} className="h-5 w-5" />
        </span>

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <h3 className="truncate text-base font-semibold text-gray-100">{item.name}</h3>
          <p className="mt-0.5 text-sm text-gray-400">
            {item.quantity} {item.unit} · {item.category}
          </p>
          {item.notes && (
            <p className="mt-1 text-xs italic text-gray-400 truncate" title={item.notes}>
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
              className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-green-950/30 hover:text-green-600 active:bg-green-100"
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
              className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-gray-300 active:bg-gray-200"
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
              className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-950/30 hover:text-red-500 active:bg-red-100"
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
