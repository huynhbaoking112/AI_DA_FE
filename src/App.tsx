import { RouterProvider } from 'react-router-dom';

import { QueryProvider } from '@/app/providers/query-provider';
import { router } from '@/app/router';

import './App.css';

/**
 * Root Application Component
 * Sets up providers and router
 */
const App = () => {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
};

export default App;
