import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'green' | 'yellow' | 'orange' | 'red';
  onClick?: () => void;
  className?: string;
}

const colorStyles: Record<string, { bg: string; text: string; iconBg: string }> = {
  green: { bg: 'bg-green-950/30', text: 'text-fresh-400', iconBg: 'bg-green-950/30' },
  yellow: { bg: 'bg-yellow-950/30', text: 'text-yellow-400', iconBg: 'bg-yellow-950/30' },
  orange: { bg: 'bg-orange-950/30', text: 'text-orange-400', iconBg: 'bg-orange-950/30' },
  red: { bg: 'bg-red-950/30', text: 'text-red-400', iconBg: 'bg-red-950/30' },
};

export function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  color = 'green',
  onClick,
  className = '',
}: DashboardCardProps) {
  const styles = colorStyles[color];

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 rounded-md border border-gray-700 bg-gray-800 p-4 text-left shadow-sm transition-all hover:shadow-md ${className}`}
      disabled={!onClick}
      aria-label={`${title}: ${value}`}
    >
      {/* Icon */}
      {icon && (
        <div className={`flex h-12 w-12 items-center justify-center rounded-md ${styles.iconBg}`} aria-hidden="true">
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{title}</p>
        <p className={`mt-0.5 text-2xl font-bold ${styles.text}`}>{value}</p>
        {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
      </div>

      {/* Chevron */}
      {onClick && (
        <svg className="h-4 w-4 flex-shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
  );
}

/* ——— Pre-built dashboard stats ——— */

interface DashboardStatsProps {
  totalItems: number;
  expiringSoon: number;
  expired: number;
  freshCount: number;
  onExpiringClick?: () => void;
  onExpiredClick?: () => void;
  className?: string;
}

export function DashboardStats({
  totalItems,
  expiringSoon,
  expired,
  freshCount,
  onExpiringClick,
  onExpiredClick,
  className = '',
}: DashboardStatsProps) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      <DashboardCard
        title="Total Items"
        value={totalItems}
        subtitle={`${freshCount} fresh`}
        color="green"
        icon={
          <svg className="h-6 w-6 text-fresh-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        }
      />
      <DashboardCard
        title="Expiring Soon"
        value={expiringSoon}
        subtitle="Within 3 days"
        color="yellow"
        onClick={onExpiringClick}
        icon={
          <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <DashboardCard
        title="Expired"
        value={expired}
        subtitle="Needs attention"
        color="red"
        onClick={onExpiredClick}
        icon={
          <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        }
      />
      <DashboardCard
        title="Waste Saved"
        value={totalItems - expired}
        subtitle="Items tracked"
        color="green"
        icon={
          <svg className="h-6 w-6 text-fresh-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    </div>
  );
}