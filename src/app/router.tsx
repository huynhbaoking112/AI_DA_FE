import { createBrowserRouter, Navigate } from 'react-router-dom';

import {
  DashboardPlaceholder,
  ProtectedRoute,
  PublicRoute,
} from '@/components/common';
import { LoginPage } from '@/features/auth';

/**
 * Application router configuration
 */
export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardPlaceholder />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
