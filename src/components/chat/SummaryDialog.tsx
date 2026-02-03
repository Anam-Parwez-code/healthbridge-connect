import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, AlertCircle } from 'lucide-react';
import { Message } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SummaryDialogProps {
  messages: Message[];
}

export function SummaryDialog({ messages }: SummaryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const generateSummary = async () => {
    if (messages.length === 0) {
      toast.error('No messages to summarize');
      return;
    }

    setIsLoading(true);
    try {
      const formattedMessages = messages.map(m => ({
        role: m.role,
        content: m.originalText,
      }));

      const { data, error } = await supabase.functions.invoke('summarize', {
        body: { messages: formattedMessages },
      });

      if (error) throw error;
      setSummary(data.summary);
    } catch (error) {
      console.error('Summary error:', error);
      toast.error('Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && !summary) {
      generateSummary();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          <span>AI Summary</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <FileText className="h-5 w-5 text-primary" />
            Consultation Summary
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Analyzing conversation...</p>
          </div>
        ) : summary ? (
          <div className="space-y-4 mt-4">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-foreground bg-muted/30 rounded-lg p-4 border">
                {summary}
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={generateSummary}
            >
              Regenerate Summary
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">No summary available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
