import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center px-6 py-12 text-center ${className}`}
      role="status"
    >
      {/* Illustration */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-fresh-50" aria-hidden="true">
        {icon || (
          <svg className="h-12 w-12 text-fresh-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mt-2 max-w-xs text-sm text-gray-400">{description}</p>

      {/* Action */}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 inline-flex items-center gap-2 rounded-sm bg-fresh-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-fresh-600 active:bg-fresh-700 min-h-touch"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {action.label}
        </button>
      )}
    </div>
  );
}

/* ——— Pre-built empty states ——— */

export function EmptyPantry(props: { onAddItem?: () => void; className?: string }) {
  return (
    <EmptyState
      icon={
        <svg className="h-12 w-12 text-fresh-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      }
      title="Your pantry is empty"
      description="Add your first food item to start tracking what you have and when it expires."
      action={props.onAddItem ? { label: 'Add Your First Item', onClick: props.onAddItem } : undefined}
      className={props.className}
    />
  );
}

export function NoExpiringItems(props: { className?: string }) {
  return (
    <EmptyState
      icon={
        <svg className="h-12 w-12 text-fresh-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
      title="Nothing expiring soon"
      description="Everything in your pantry is fresh! Check back when items are nearing their expiry date."
      className={props.className}
    />
  );
}

export function ScanPrompt(props: { onScan?: () => void; className?: string }) {
  return (
    <EmptyState
      icon={
        <svg className="h-12 w-12 text-fresh-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
        </svg>
      }
      title="Scan a barcode"
      description="Premium feature! Scan barcodes to instantly add items with name and expiry from our database."
      action={props.onScan ? { label: 'Try Scanning', onClick: props.onScan } : undefined}
      className={props.className}
    />
  );
}