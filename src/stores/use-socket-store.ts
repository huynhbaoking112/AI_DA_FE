import { create } from 'zustand';

/**
 * Socket connection status types
 */
export type SocketStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * Socket state interface
 */
interface SocketState {
  status: SocketStatus;
  error: string | null;
}

/**
 * Socket actions interface
 */
interface SocketActions {
  setConnected: () => void;
  setDisconnected: (reason?: string) => void;
  setError: (error: string) => void;
  reset: () => void;
}

/**
 * Initial socket state
 */
const initialState: SocketState = {
  status: 'disconnected',
  error: null,
};

/**
 * Zustand store for socket connection state management
 * Tracks connection status and errors for the Socket.IO client
 */
export const useSocketStore = create<SocketState & SocketActions>()((set) => ({
  ...initialState,

  setConnected: () => set({ status: 'connected', error: null }),

  setDisconnected: (reason) =>
    set({
      status: 'disconnected',
      error: reason === 'io server disconnect' ? 'Server disconnected' : null,
    }),

  setError: (error) => set({ status: 'error', error }),

  reset: () => set(initialState),
}));
