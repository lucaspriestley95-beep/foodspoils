interface HeaderProps {
  title: string;
  subtitle?: string;
  onScan?: () => void;
  onMenu?: () => void;
  className?: string;
}

export function Header({ title, subtitle, onScan, onMenu, className = '' }: HeaderProps) {
  return (
    <header className={`flex items-center justify-between px-4 py-3 ${className}`}>
      <div className="flex items-center gap-3">
        {/* App icon mark */}
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-fresh-500">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>

        <div>
          <h1 className="text-lg font-bold text-gray-800">{title}</h1>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Scan button */}
        {onScan && (
          <button
            onClick={onScan}
            className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-fresh-50 hover:text-fresh-500"
            aria-label="Scan barcode"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
            </svg>
          </button>
        )}

        {/* Menu button */}
        {onMenu && (
          <button
            onClick={onMenu}
            className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}

/* ——— Welcome header for dashboard ——— */

interface WelcomeHeaderProps {
  userName?: string;
  itemCount: number;
  className?: string;
}

export function WelcomeHeader({ userName = 'there', itemCount, className = '' }: WelcomeHeaderProps) {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className={`px-4 pt-2 pb-4 ${className}`}>
      <p className="text-sm text-gray-400">{greeting()},</p>
      <h1 className="text-2xl font-bold text-gray-800">{userName} 👋</h1>
      <p className="mt-1 text-sm text-gray-400">
        You have <span className="font-semibold text-fresh-600">{itemCount} items</span> in your pantry
      </p>
    </div>
  );
}