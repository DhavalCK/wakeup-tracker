export interface SleepEntry {
  id?: string;
  userId: string;
  sleepTime: Date;
  wakeupTime: Date;
  durationMinutes: number;
  quality?: 'poor' | 'fair' | 'good' | 'excellent';
  notes?: string;
  createdAt: Date;
}

export interface SleepStats {
  totalSessions: number;
  averageDurationMinutes: number;
  bestDurationMinutes: number;
  averageQuality: number;
  streak: number;
}
