import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ProtectedRoute, PublicRoute } from '@/components/common';
import { DashboardPlaceholder } from '@/components/common/dashboard-placeholder';
import { LoginPage } from '@/features/auth';
import { OrdersDashboardPage } from '@/features/analytics';
import { MainLayout } from './layouts';

/**
 * Application router configuration
 * Uses nested routes with MainLayout for authenticated pages
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
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPlaceholder />,
      },
      // Future routes - placeholder pages for now
      {
        path: 'conversations',
        element: <DashboardPlaceholder />,
      },
      {
        path: 'conversations/archived',
        element: <DashboardPlaceholder />,
      },
      {
        path: 'agents',
        element: <DashboardPlaceholder />,
      },
      {
        path: 'agents/marketplace',
        element: <DashboardPlaceholder />,
      },
      {
        path: 'analytics',
        element: <DashboardPlaceholder />,
      },
      {
        path: 'analytics/orders',
        element: <OrdersDashboardPage />,
      },
      {
        path: 'analytics/reports',
        element: <DashboardPlaceholder />,
      },
      {
        path: 'settings',
        element: <DashboardPlaceholder />,
      },
      {
        path: 'settings/api-keys',
        element: <DashboardPlaceholder />,
      },
      {
        path: 'settings/integrations',
        element: <DashboardPlaceholder />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
