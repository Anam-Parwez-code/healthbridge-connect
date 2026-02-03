import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { Role } from '@/types/chat';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function ChatInterface() {
  const [role, setRole] = useState<Role>('doctor');
  const [doctorLanguage, setDoctorLanguage] = useState('English');
  const [patientLanguage, setPatientLanguage] = useState('Hindi');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { messages, isLoading, sendMessage, clearMessages, searchMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredMessages = searchQuery ? searchMessages(searchQuery) : messages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendText = async (text: string) => {
    const sourceLanguage = role === 'doctor' ? doctorLanguage : patientLanguage;
    const targetLanguage = role === 'doctor' ? patientLanguage : doctorLanguage;
    
    await sendMessage(text, role, sourceLanguage, targetLanguage);
  };

  const handleSendAudio = async (audioUrl: string, duration: number) => {
    try {
      // Transcribe the audio (simulated for demo)
      const { data, error } = await supabase.functions.invoke('transcribe', {
        body: {
          audioBase64: audioUrl,
          language: role === 'doctor' ? doctorLanguage : patientLanguage,
        },
      });

      if (error) throw error;

      const sourceLanguage = role === 'doctor' ? doctorLanguage : patientLanguage;
      const targetLanguage = role === 'doctor' ? patientLanguage : doctorLanguage;
      
      const transcribedText = data.transcription || 'Audio message';
      await sendMessage(transcribedText, role, sourceLanguage, targetLanguage, audioUrl, duration);
    } catch (error) {
      console.error('Audio processing error:', error);
      toast.error('Failed to process audio');
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background">
      <ChatHeader
        role={role}
        onRoleChange={setRole}
        doctorLanguage={doctorLanguage}
        patientLanguage={patientLanguage}
        onDoctorLanguageChange={setDoctorLanguage}
        onPatientLanguageChange={setPatientLanguage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchResultCount={filteredMessages.length}
        messages={messages}
        onClear={clearMessages}
      />
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-primary" />
              </div>
            </div>
            <h2 className="font-display text-xl font-semibold mb-2">
              Start Your Consultation
            </h2>
            <p className="text-muted-foreground max-w-sm">
              Select your role, choose languages, and begin communicating. 
              Messages will be translated in real-time.
            </p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              searchQuery={searchQuery}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <MessageInput
        onSendText={handleSendText}
        onSendAudio={handleSendAudio}
        disabled={isLoading}
        placeholder={
          role === 'doctor'
            ? `Type in ${doctorLanguage}...`
            : `Type in ${patientLanguage}...`
        }
      />
    </div>
  );
}
