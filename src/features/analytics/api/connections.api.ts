/**
 * Connections API - Sheet connections management
 */

import { apiClient } from '@/lib/api-client';

import type { Connection } from '../types';

/**
 * Get all sheet connections for the current user
 */
export const getConnections = async (): Promise<Connection[]> => {
  return apiClient.get<Connection[]>('/sheet-connections');
};

/**
 * Get a specific connection by ID
 */
export const getConnectionById = async (
  connectionId: string
): Promise<Connection> => {
  return apiClient.get<Connection>(`/sheet-connections/${connectionId}`);
};
