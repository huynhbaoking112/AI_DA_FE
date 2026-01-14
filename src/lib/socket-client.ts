/**
 * Socket Client - Singleton Socket.IO client for real-time communication
 *
 * This module provides a singleton pattern for managing the Socket.IO connection
 * with JWT authentication and automatic reconnection handling.
 */

import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/use-auth-store';
import { useSocketStore } from '@/stores/use-socket-store';
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from '@/types/socket.types';

/**
 * Typed socket instance with server and client event interfaces
 */
export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

/**
 * Singleton socket instance
 */
let socket: TypedSocket | null = null;

/**
 * Get the current socket instance
 * @returns Socket instance or null if not connected
 */
export const getSocket = (): TypedSocket | null => socket;

/**
 * Connect to the socket server with JWT authentication
 *
 * Creates a new Socket.IO connection using the auth token from the auth store.
 * If already connected, returns the existing socket instance.
 *
 * @returns Socket instance or null if no token available
 */
export const connectSocket = (): TypedSocket | null => {
  const token = useAuthStore.getState().token;

  if (!token) {
    console.warn('[Socket] Cannot connect: No auth token');
    return null;
  }

  // Return existing connected socket
  if (socket?.connected) {
    return socket;
  }

  // Disconnect existing socket if any
  if (socket) {
    socket.disconnect();
  }

  // Create new socket connection
  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  // Setup connection lifecycle handlers
  setupSocketListeners(socket);

  return socket;
};

/**
 * Disconnect and cleanup socket
 *
 * Disconnects the current socket connection and sets the instance to null.
 * Updates the socket store to reflect the disconnected state.
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    useSocketStore.getState().setDisconnected('manual');
  }
};

/**
 * Setup socket event listeners for connection lifecycle
 *
 * Configures handlers for connect, disconnect, and connect_error events.
 * Updates the socket store accordingly and handles auth rejection.
 *
 * @param socket - The typed socket instance to setup listeners on
 */
const setupSocketListeners = (socketInstance: TypedSocket): void => {
  socketInstance.on('connect', () => {
    useSocketStore.getState().setConnected();
  });

  socketInstance.on('disconnect', (reason) => {
    useSocketStore.getState().setDisconnected(reason);
  });

  socketInstance.on('connect_error', (error) => {
    useSocketStore.getState().setError(error.message);

    // Handle auth rejection - logout user and disconnect
    if (error.message === 'Unauthorized') {
      useAuthStore.getState().logout();
      disconnectSocket();
    }
  });
};
