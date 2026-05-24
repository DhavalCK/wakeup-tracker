export interface SleepEntry {
  id?: string;
  userId: string;
  sleepTime: Date | any;
  wakeupTime?: Date | any | null;
  durationMinutes?: number | null;
  quality?: 'poor' | 'fair' | 'good' | 'excellent';
  notes?: string;
  createdAt?: Date | any;
}

export interface SleepStats {
  totalSessions: number;
  averageDurationMinutes: number;
  bestDurationMinutes: number;
  averageQuality: number;
  streak: number;
}
