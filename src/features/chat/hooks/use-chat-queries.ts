import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@/lib/api-error';

import {
  getConversationMessages,
  listConversations,
  sendMessage,
} from '../api/chat.api';
import { useChatStore } from '../stores/use-chat-store';

import type {
  ListConversationsParams,
  ListConversationsResponse,
  SendMessageResponse,
} from '../types';

export const conversationsKey = (params: ListConversationsParams) =>
  ['chat', 'conversations', params] as const;

export const messagesKey = (conversationId: string) =>
  ['chat', 'messages', conversationId] as const;

export const useConversationsQuery = (params: ListConversationsParams = {}) => {
  const queryKey = useMemo(() => conversationsKey(params), [params]);
  const queryFn = useCallback(() => listConversations(params), [params]);

  return useQuery<ListConversationsResponse, ApiError>({
    queryKey,
    queryFn,
  });
};

export const useMessagesQuery = (conversationId: string | null) => {
  const enabled = conversationId !== null;
  const queryKey = useMemo(
    () => messagesKey(conversationId ?? ''),
    [conversationId]
  );
  const queryFn = useCallback(
    () => getConversationMessages(conversationId as string),
    [conversationId]
  );

  return useQuery({
    queryKey,
    queryFn,
    enabled,
  });
};

type SendMessageInput = {
  content: string;
};

type SendMessageContext = {
  activeConversationId: string | null;
};

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();
  const lockSendForConversation = useChatStore(
    (state) => state.lockSendForConversation
  );
  const lockSendForNullConversation = useChatStore(
    (state) => state.lockSendForNullConversation
  );
  const transferNullSendLockToConversation = useChatStore(
    (state) => state.transferNullSendLockToConversation
  );
  const setActiveConversationId = useChatStore(
    (state) => state.setActiveConversationId
  );
  const markFailed = useChatStore((state) => state.markFailed);

  const mutationFn = useCallback((variables: SendMessageInput) => {
    const activeConversationId = useChatStore.getState().activeConversationId;

    return sendMessage({
      content: variables.content,
      conversation_id: activeConversationId,
    });
  }, []);

  const handleMutate = useCallback((): SendMessageContext => {
    const activeConversationId = useChatStore.getState().activeConversationId;

    if (activeConversationId === null) {
      lockSendForNullConversation();
    } else {
      lockSendForConversation(activeConversationId);
    }

    return { activeConversationId };
  }, [lockSendForConversation, lockSendForNullConversation]);

  const handleSuccess = useCallback(
    (data: SendMessageResponse, _variables: SendMessageInput, context) => {
      setActiveConversationId(data.conversation_id);

      if (context?.activeConversationId === null) {
        transferNullSendLockToConversation(data.conversation_id);
      }

      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    },
    [queryClient, setActiveConversationId, transferNullSendLockToConversation]
  );

  const handleError = useCallback(
    (error: ApiError, _variables: SendMessageInput, context) => {
      if (context?.activeConversationId === null) {
        useChatStore.setState({ sendLockForNullConversation: false });
        return;
      }

      if (context?.activeConversationId) {
        markFailed(context.activeConversationId, error.detail);
      }
    },
    [markFailed]
  );

  return useMutation<SendMessageResponse, ApiError, SendMessageInput, SendMessageContext>({
    mutationFn,
    onMutate: handleMutate,
    onSuccess: handleSuccess,
    onError: handleError,
  });
};
