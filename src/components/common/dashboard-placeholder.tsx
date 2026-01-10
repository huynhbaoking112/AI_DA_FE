import { useAuthStore } from '@/stores/use-auth-store';

/**
 * Dashboard placeholder component
 * Replace with actual dashboard when implemented
 */
export const DashboardPlaceholder = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
      <h1 className="text-2xl font-bold text-slate-900">
        Welcome to Dashboard
      </h1>
      <p className="text-slate-600">Logged in as: {user?.email}</p>
      <button
        onClick={logout}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      >
        Logout
      </button>
    </div>
  );
};
