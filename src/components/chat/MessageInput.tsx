import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { AudioRecorder } from './AudioRecorder';

interface MessageInputProps {
  onSendText: (text: string) => void;
  onSendAudio: (audioUrl: string, duration: number) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({ 
  onSendText, 
  onSendAudio, 
  disabled, 
  placeholder = "Type your message..." 
}: MessageInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSendText(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 p-4 bg-card border-t">
      <div className="flex-1 relative">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[44px] max-h-[120px] resize-none pr-12 rounded-2xl"
          rows={1}
        />
      </div>
      
      <AudioRecorder onSend={onSendAudio} disabled={disabled} />
      
      <Button
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        size="icon"
        className="h-10 w-10 rounded-full shrink-0"
      >
        {disabled ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
