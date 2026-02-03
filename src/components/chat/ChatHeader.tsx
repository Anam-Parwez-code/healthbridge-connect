import { RoleToggle } from './RoleToggle';
import { LanguageSelector } from './LanguageSelector';
import { SummaryDialog } from './SummaryDialog';
import { SearchBar } from './SearchBar';
import { Role, Message } from '@/types/chat';
import { Activity, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  role: Role;
  onRoleChange: (role: Role) => void;
  doctorLanguage: string;
  patientLanguage: string;
  onDoctorLanguageChange: (lang: string) => void;
  onPatientLanguageChange: (lang: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResultCount: number;
  messages: Message[];
  onClear: () => void;
}

export function ChatHeader({
  role,
  onRoleChange,
  doctorLanguage,
  patientLanguage,
  onDoctorLanguageChange,
  onPatientLanguageChange,
  searchQuery,
  onSearchChange,
  searchResultCount,
  messages,
  onClear,
}: ChatHeaderProps) {
  return (
    <div className="bg-card border-b sticky top-0 z-10">
      {/* Top bar with logo and actions */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg">MediTranslate</h1>
            <p className="text-xs text-muted-foreground">Real-time Healthcare Translation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <SummaryDialog messages={messages} />
          <Button variant="ghost" size="icon" onClick={onClear}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Role toggle and language selectors */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <RoleToggle role={role} onRoleChange={onRoleChange} />
        
        <div className="flex items-center gap-4">
          <LanguageSelector
            value={doctorLanguage}
            onChange={onDoctorLanguageChange}
            label="Doctor speaks"
          />
          <div className="text-muted-foreground">→</div>
          <LanguageSelector
            value={patientLanguage}
            onChange={onPatientLanguageChange}
            label="Patient speaks"
          />
        </div>
      </div>
      
      {/* Search bar */}
      <div className="px-4 pb-3">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          resultCount={searchResultCount}
        />
      </div>
    </div>
  );
}
