import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { Button } from '@/components/ui/button';
import { Mic, Square, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioRecorderProps {
  onSend: (audioUrl: string, duration: number) => void;
  disabled?: boolean;
}

export function AudioRecorder({ onSend, disabled }: AudioRecorderProps) {
  const {
    isRecording,
    audioUrl,
    duration,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = () => {
    if (audioUrl) {
      onSend(audioUrl, duration);
      resetRecording();
    }
  };

  if (audioUrl) {
    return (
      <div className="flex items-center gap-2 bg-secondary rounded-full px-3 py-2">
        <audio src={audioUrl} className="hidden" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-sm font-medium">{formatDuration(duration)}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={resetRecording}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          variant="default"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handleSend}
          disabled={disabled}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant={isRecording ? "destructive" : "ghost"}
      size="icon"
      className={cn(
        "h-10 w-10 rounded-full relative",
        isRecording && "animate-pulse"
      )}
      onClick={isRecording ? stopRecording : startRecording}
      disabled={disabled}
    >
      {isRecording ? (
        <>
          <Square className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 text-xs bg-destructive text-destructive-foreground rounded-full px-1.5 py-0.5 min-w-[24px]">
            {formatDuration(duration)}
          </span>
          <span className="absolute inset-0 rounded-full bg-destructive/30 animate-pulse-ring" />
        </>
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  );
}
