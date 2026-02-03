import { Role } from '@/types/chat';
import { Stethoscope, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleToggleProps {
  role: Role;
  onRoleChange: (role: Role) => void;
}

export function RoleToggle({ role, onRoleChange }: RoleToggleProps) {
  return (
    <div className="flex items-center justify-center gap-2 p-1 bg-secondary rounded-full">
      <button
        onClick={() => onRoleChange('doctor')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300",
          role === 'doctor'
            ? "bg-doctor text-doctor-foreground shadow-medical"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Stethoscope className="w-4 h-4" />
        <span>Doctor</span>
      </button>
      <button
        onClick={() => onRoleChange('patient')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300",
          role === 'patient'
            ? "bg-patient text-patient-foreground shadow-lg"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <User className="w-4 h-4" />
        <span>Patient</span>
      </button>
    </div>
  );
}
