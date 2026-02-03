import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Stethoscope, User } from 'lucide-react';
import { AudioWaveform } from './AudioWaveform';

interface MessageBubbleProps {
  message: Message;
  searchQuery?: string;
}

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-accent/40 rounded px-0.5">{part}</mark>
    ) : (
      part
    )
  );
}

export function MessageBubble({ message, searchQuery }: MessageBubbleProps) {
  const isDoctor = message.role === 'doctor';
  
  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isDoctor ? "justify-start" : "justify-end"
      )}
    >
      {isDoctor && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-doctor flex items-center justify-center">
          <Stethoscope className="w-4 h-4 text-doctor-foreground" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3 shadow-bubble",
          isDoctor
            ? "bg-doctor-light rounded-tl-sm"
            : "bg-patient-light rounded-tr-sm"
        )}
      >
        {/* Original text */}
        <p className="text-foreground">
          {searchQuery ? highlightText(message.originalText, searchQuery) : message.originalText}
        </p>
        
        {/* Translated text */}
        {message.translatedText !== message.originalText && (
          <div className={cn(
            "mt-2 pt-2 border-t",
            isDoctor ? "border-doctor/20" : "border-patient/20"
          )}>
            <p className="text-sm text-muted-foreground italic flex items-center gap-1">
              <span className="text-xs font-medium uppercase tracking-wide">
                Translation:
              </span>
            </p>
            <p className="text-foreground mt-1">
              {searchQuery ? highlightText(message.translatedText, searchQuery) : message.translatedText}
            </p>
          </div>
        )}
        
        {/* Audio waveform if audio message */}
        {message.audioUrl && (
          <div className="mt-3">
            <AudioWaveform audioUrl={message.audioUrl} />
          </div>
        )}
        
        {/* Timestamp */}
        <p className="text-xs text-muted-foreground mt-2">
          {format(message.timestamp, 'h:mm a')}
        </p>
      </div>
      
      {!isDoctor && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-patient flex items-center justify-center">
          <User className="w-4 h-4 text-patient-foreground" />
        </div>
      )}
    </div>
  );
}
