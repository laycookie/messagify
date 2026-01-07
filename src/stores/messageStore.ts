import { create } from "zustand";
import type { DiscordMessage } from "../types/discord";

interface MessageState {
  // Map of channelId -> messages array
  messages: Map<string, DiscordMessage[]>;

  // Set all messages for a channel (used for initial fetch)
  setMessages: (channelId: string, messages: DiscordMessage[]) => void;

  // Add a new message to a channel
  addMessage: (channelId: string, message: DiscordMessage) => void;

  // Update an existing message
  updateMessage: (
    channelId: string,
    messageId: string,
    message: Partial<DiscordMessage>
  ) => void;

  // Delete a message
  deleteMessage: (channelId: string, messageId: string) => void;

  // Get messages for a channel
  getMessages: (channelId: string) => DiscordMessage[];

  // Clear messages for a channel
  clearChannel: (channelId: string) => void;

  // Clear all messages
  clearAll: () => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: new Map(),

  setMessages: (channelId, messages) =>
    set((state) => {
      const newMessages = new Map(state.messages);
      newMessages.set(channelId, messages);
      return { messages: newMessages };
    }),

  addMessage: (channelId, message) =>
    set((state) => {
      const newMessages = new Map(state.messages);
      const channelMessages = newMessages.get(channelId) ?? [];

      // Add new message at the beginning (newest first - matches Discord API order)
      // Check if message already exists to avoid duplicates
      if (!channelMessages.some((m) => m.id === message.id)) {
        newMessages.set(channelId, [message, ...channelMessages]);
      }

      return { messages: newMessages };
    }),

  updateMessage: (channelId, messageId, updatedFields) =>
    set((state) => {
      const newMessages = new Map(state.messages);
      const channelMessages = newMessages.get(channelId);

      if (channelMessages) {
        const updatedMessages = channelMessages.map((m) =>
          m.id === messageId ? { ...m, ...updatedFields } : m
        );
        newMessages.set(channelId, updatedMessages);
      }

      return { messages: newMessages };
    }),

  deleteMessage: (channelId, messageId) =>
    set((state) => {
      const newMessages = new Map(state.messages);
      const channelMessages = newMessages.get(channelId);

      if (channelMessages) {
        newMessages.set(
          channelId,
          channelMessages.filter((m) => m.id !== messageId)
        );
      }

      return { messages: newMessages };
    }),

  getMessages: (channelId) => get().messages.get(channelId) ?? [],

  clearChannel: (channelId) =>
    set((state) => {
      const newMessages = new Map(state.messages);
      newMessages.delete(channelId);
      return { messages: newMessages };
    }),

  clearAll: () => set({ messages: new Map() }),
}));
