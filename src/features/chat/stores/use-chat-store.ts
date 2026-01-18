import { create } from 'zustand';

export type StreamStatus = 'idle' | 'streaming' | 'failed';

export type ToolRun = {
  tool_call_id: string;
  tool_name: string;
  status: 'running' | 'done';
};

export type StreamState = {
  status: StreamStatus;
  draftAssistantText: string;
  runningTools: ToolRun[];
  lastError: string | null;
  lastUpdatedAt: number;
};

export type ChatStoreState = {
  activeConversationId: string | null;
  sendLockByConversationId: Record<string, boolean>;
  sendLockForNullConversation: boolean;
  streamByConversationId: Record<string, StreamState>;
};

export type ChatStoreActions = {
  setActiveConversationId: (conversationId: string | null) => void;

  lockSendForConversation: (conversationId: string) => void;
  unlockSendForConversation: (conversationId: string) => void;
  lockSendForNullConversation: () => void;
  transferNullSendLockToConversation: (conversationId: string) => void;

  ensureStreamState: (conversationId: string) => void;
  markStreamStarted: (conversationId: string) => void;
  appendToken: (conversationId: string, token: string) => void;
  addToolStart: (
    conversationId: string,
    tool: { tool_call_id: string; tool_name: string }
  ) => void;
  markToolEnd: (conversationId: string, tool_call_id: string) => void;
  finalizeCompleted: (conversationId: string, content: string) => void;
  markFailed: (conversationId: string, error: string) => void;
  clearFailure: (conversationId: string) => void;
};

export type ChatStore = ChatStoreState & ChatStoreActions;

const now = () => Date.now();

const createInitialStreamState = (): StreamState => ({
  status: 'idle',
  draftAssistantText: '',
  runningTools: [],
  lastError: null,
  lastUpdatedAt: now(),
});

export const useChatStore = create<ChatStore>((set, get) => ({
  activeConversationId: null,
  sendLockByConversationId: {},
  sendLockForNullConversation: false,
  streamByConversationId: {},

  setActiveConversationId: (conversationId) => {
    set({ activeConversationId: conversationId });
  },

  lockSendForConversation: (conversationId) => {
    set((state) => ({
      sendLockByConversationId: {
        ...state.sendLockByConversationId,
        [conversationId]: true,
      },
    }));
  },

  unlockSendForConversation: (conversationId) => {
    set((state) => ({
      sendLockByConversationId: {
        ...state.sendLockByConversationId,
        [conversationId]: false,
      },
    }));
  },

  lockSendForNullConversation: () => {
    set({ sendLockForNullConversation: true });
  },

  transferNullSendLockToConversation: (conversationId) => {
    set((state) => ({
      sendLockForNullConversation: false,
      sendLockByConversationId: {
        ...state.sendLockByConversationId,
        [conversationId]: true,
      },
    }));
  },

  ensureStreamState: (conversationId) => {
    const existing = get().streamByConversationId[conversationId];
    if (existing) {
      return;
    }

    set((state) => ({
      streamByConversationId: {
        ...state.streamByConversationId,
        [conversationId]: createInitialStreamState(),
      },
    }));
  },

  markStreamStarted: (conversationId) => {
    set((state) => ({
      streamByConversationId: {
        ...state.streamByConversationId,
        [conversationId]: {
          status: 'streaming',
          draftAssistantText: '',
          runningTools: [],
          lastError: null,
          lastUpdatedAt: now(),
        },
      },
    }));
  },

  appendToken: (conversationId, token) => {
    set((state) => {
      const current =
        state.streamByConversationId[conversationId] ?? createInitialStreamState();

      return {
        streamByConversationId: {
          ...state.streamByConversationId,
          [conversationId]: {
            ...current,
            draftAssistantText: `${current.draftAssistantText}${token}`,
            lastUpdatedAt: now(),
          },
        },
      };
    });
  },

  addToolStart: (conversationId, tool) => {
    set((state) => {
      const current =
        state.streamByConversationId[conversationId] ?? createInitialStreamState();

      return {
        streamByConversationId: {
          ...state.streamByConversationId,
          [conversationId]: {
            ...current,
            runningTools: [
              ...current.runningTools,
              {
                tool_call_id: tool.tool_call_id,
                tool_name: tool.tool_name,
                status: 'running',
              },
            ],
            lastUpdatedAt: now(),
          },
        },
      };
    });
  },

  markToolEnd: (conversationId, tool_call_id) => {
    set((state) => {
      const current =
        state.streamByConversationId[conversationId] ?? createInitialStreamState();

      return {
        streamByConversationId: {
          ...state.streamByConversationId,
          [conversationId]: {
            ...current,
            runningTools: current.runningTools.map((tool) =>
              tool.tool_call_id === tool_call_id
                ? { ...tool, status: 'done' }
                : tool
            ),
            lastUpdatedAt: now(),
          },
        },
      };
    });
  },

  finalizeCompleted: (conversationId, content) => {
    set((state) => {
      const current =
        state.streamByConversationId[conversationId] ?? createInitialStreamState();

      return {
        streamByConversationId: {
          ...state.streamByConversationId,
          [conversationId]: {
            ...current,
            status: 'idle',
            draftAssistantText: content,
            runningTools: [],
            lastError: null,
            lastUpdatedAt: now(),
          },
        },
      };
    });
  },

  markFailed: (conversationId, error) => {
    set((state) => {
      const current =
        state.streamByConversationId[conversationId] ?? createInitialStreamState();

      return {
        streamByConversationId: {
          ...state.streamByConversationId,
          [conversationId]: {
            ...current,
            status: 'failed',
            lastError: error,
            lastUpdatedAt: now(),
          },
        },
      };
    });
  },

  clearFailure: (conversationId) => {
    set((state) => {
      const current = state.streamByConversationId[conversationId];
      if (!current) {
        return state;
      }

      return {
        streamByConversationId: {
          ...state.streamByConversationId,
          [conversationId]: {
            ...current,
            status: 'idle',
            lastError: null,
            lastUpdatedAt: now(),
          },
        },
      };
    });
  },
}));

export const hasActiveConversation = (state: ChatStoreState): boolean =>
  state.activeConversationId !== null;

export const isSendDisabled = (
  state: ChatStoreState,
  conversationId: string | null
): boolean => {
  if (conversationId === null) {
    return state.sendLockForNullConversation;
  }

  return state.sendLockByConversationId[conversationId] === true;
};

export const getStreamState = (
  state: ChatStoreState,
  conversationId: string
): StreamState => state.streamByConversationId[conversationId] ?? createInitialStreamState();
