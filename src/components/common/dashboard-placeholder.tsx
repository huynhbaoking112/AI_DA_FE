import { useLocation } from 'react-router-dom';

import { useAuthStore } from '@/stores/use-auth-store';

/**
 * Dashboard placeholder component
 * Replace with actual page components when implemented
 */
export const DashboardPlaceholder = () => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  // Generate page title from pathname
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    return path
      .split('/')
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' / ');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">{getPageTitle()}</h1>
        <p className="mt-2 text-muted-foreground">
          Logged in as: {user?.email}
        </p>
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <p className="text-muted-foreground">
          This is a placeholder page. Content will be implemented later.
        </p>
      </div>
    </div>
  );
};
