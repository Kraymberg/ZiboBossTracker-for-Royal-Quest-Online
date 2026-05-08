
export interface RespawnInfo {
  date?: string;
  time?: string;
  location?: string;
  isTimeApproximate: boolean;
  isUnknown: boolean;
}

export interface ArchiveEntry {
  id: string;
  type: 'death' | 'sight' | 'maintenance';
  time: string; // ISO string (для техработ это время окончания)
  location: string;
  respawn?: RespawnInfo;
  maintStart?: string; // ISO string начала
  maintEnd?: string;   // ISO string окончания
  source?: 'manual' | 'auto'; // Added to track source of entry
  addedBy?: string; // Nickname of the user who added the entry
}

export interface RotationSlot {
  label: string;
  duration: number;
  locations: string[];
  start: Date;
  end: Date;
  hasVtp5: boolean;
  hasVtp6: boolean;
  isVtpWindow: boolean;
}

export interface ScheduleData {
  nkd: Date;
  vtp5: Date;
  vtp6: Date;
  slots: RotationSlot[];
}

export type UserRole = 'admin' | 'viewer';

export interface UserProfile {
  id: number;
  username?: string;
  first_name: string;
  name?: string; // Custom display name from DB
  role: UserRole;
}
