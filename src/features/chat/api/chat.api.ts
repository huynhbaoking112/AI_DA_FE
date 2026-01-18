import { apiClient } from '@/lib/api-client';

import type {
  GetConversationMessagesResponse,
  ListConversationsParams,
  ListConversationsResponse,
  SendMessageRequest,
  SendMessageResponse,
} from '../types';

export const listConversations = (
  params: ListConversationsParams
): Promise<ListConversationsResponse> =>
  apiClient.get<ListConversationsResponse>('/chat/conversations', { params });

export const getConversationMessages = (
  conversationId: string
): Promise<GetConversationMessagesResponse> =>
  apiClient.get<GetConversationMessagesResponse>(
    `/chat/conversations/${conversationId}/messages`
  );

export const sendMessage = (req: SendMessageRequest): Promise<SendMessageResponse> =>
  apiClient.post<SendMessageResponse>('/chat/messages', req);
