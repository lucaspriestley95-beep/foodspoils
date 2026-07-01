type Status = 'fresh' | 'soon' | 'urgent' | 'expired';

interface StatusBadgeProps {
  status: Status;
  daysRemaining?: number;
  className?: string;
}

const statusConfig: Record<Status, { label: string; bg: string; text: string; dot: string }> = {
  fresh: {
    label: 'Fresh',
    bg: 'bg-green-100',
    text: 'text-green-700',
    dot: 'bg-status-fresh',
  },
  soon: {
    label: 'Expiring Soon',
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    dot: 'bg-status-soon',
  },
  urgent: {
    label: 'Use Today!',
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    dot: 'bg-status-urgent',
  },
  expired: {
    label: 'Expired',
    bg: 'bg-red-100',
    text: 'text-red-700',
    dot: 'bg-status-expired',
  },
};

export function StatusBadge({ status, daysRemaining, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.text} ${className}`}
      role="status"
      aria-label={`${config.label}${daysRemaining !== undefined ? ` — ${daysRemaining} days remaining` : ''}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      {config.label}
      {daysRemaining !== undefined && daysRemaining >= 0 && (
        <span className="opacity-75">· {daysRemaining}d</span>
      )}
    </span>
  );
}

export function getExpiryStatus(expiryDate: string | null | undefined): Status {
  if (!expiryDate) return 'fresh';
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'expired';
  if (diffDays <= 1) return 'urgent';
  if (diffDays <= 3) return 'soon';
  return 'fresh';
}

export function getDaysRemaining(expiryDate: string | null | undefined): number | undefined {
  if (!expiryDate) return undefined;
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffMs = expiry.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}