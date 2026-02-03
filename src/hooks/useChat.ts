import { useState, useCallback } from 'react';
import { Message, Role } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (
    text: string,
    role: Role,
    sourceLanguage: string,
    targetLanguage: string,
    audioUrl?: string,
    audioDuration?: number
  ) => {
    setIsLoading(true);
    
    try {
      // Call translation edge function
      const { data, error } = await supabase.functions.invoke('translate', {
        body: {
          text,
          sourceLanguage,
          targetLanguage,
          role,
        },
      });

      if (error) throw error;

      const newMessage: Message = {
        id: crypto.randomUUID(),
        role,
        originalText: text,
        translatedText: data.translatedText || text,
        timestamp: new Date(),
        audioUrl,
        audioDuration,
      };

      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (error) {
      console.error('Failed to send message:', error);
      // Still add the message but without translation
      const fallbackMessage: Message = {
        id: crypto.randomUUID(),
        role,
        originalText: text,
        translatedText: text,
        timestamp: new Date(),
        audioUrl,
        audioDuration,
      };
      setMessages(prev => [...prev, fallbackMessage]);
      return fallbackMessage;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const searchMessages = useCallback((query: string) => {
    if (!query.trim()) return messages;
    
    const lowerQuery = query.toLowerCase();
    return messages.filter(
      m => m.originalText.toLowerCase().includes(lowerQuery) ||
           m.translatedText.toLowerCase().includes(lowerQuery)
    );
  }, [messages]);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    searchMessages,
  };
}
