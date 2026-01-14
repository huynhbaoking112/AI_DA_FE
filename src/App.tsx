import { RouterProvider } from 'react-router-dom';

import { QueryProvider } from '@/app/providers/query-provider';
import { SocketProvider } from '@/app/providers/socket-provider';
import { router } from '@/app/router';

import './App.css';

/**
 * Root Application Component
 * Sets up providers and router
 */
const App = () => {
  return (
    <QueryProvider>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </QueryProvider>
  );
};

export default App;
