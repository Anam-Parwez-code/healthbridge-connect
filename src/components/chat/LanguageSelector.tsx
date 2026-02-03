import { SUPPORTED_LANGUAGES } from '@/types/chat';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export function LanguageSelector({ value, onChange, label }: LanguageSelectorProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[140px] bg-card">
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3 text-muted-foreground" />
            <SelectValue placeholder="Select language" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.name}>
              <span className="flex items-center gap-2">
                <span>{lang.nativeName}</span>
                <span className="text-muted-foreground">({lang.name})</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
