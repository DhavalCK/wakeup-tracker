import { Injectable, signal, computed } from '@angular/core';
import { SleepEntry, SleepStats } from '../models/sleep-entry.model';

@Injectable({
  providedIn: 'root',
})
export class SleepService {
  // Signal-based state — will be wired to Firestore in the next phase
  private _entries = signal<SleepEntry[]>([]);
  private _loading = signal<boolean>(false);
  private _isSleeping = signal<boolean>(false);
  private _sleepStartTime = signal<Date | null>(null);

  // Public readonly signals
  readonly entries = this._entries.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isSleeping = this._isSleeping.asReadonly();
  readonly sleepStartTime = this._sleepStartTime.asReadonly();

  // Computed: today's stats
  readonly todayStats = computed(() => {
    const today = new Date();
    const todayEntries = this._entries().filter((e) => {
      const d = new Date(e.wakeupTime);
      return d.toDateString() === today.toDateString();
    });
    return todayEntries;
  });

  readonly stats = computed<SleepStats>(() => {
    const all = this._entries();
    if (!all.length) {
      return {
        totalSessions: 0,
        averageDurationMinutes: 0,
        bestDurationMinutes: 0,
        averageQuality: 0,
        streak: 0,
      };
    }
    const total = all.reduce((sum, e) => sum + e.durationMinutes, 0);
    const best = Math.max(...all.map((e) => e.durationMinutes));
    return {
      totalSessions: all.length,
      averageDurationMinutes: Math.round(total / all.length),
      bestDurationMinutes: best,
      averageQuality: 0,
      streak: 0,
    };
  });

  // Placeholder: start sleep timer
  startSleep(): void {
    this._isSleeping.set(true);
    this._sleepStartTime.set(new Date());
    console.log('[SleepService] sleep started at', this._sleepStartTime());
  }

  // Placeholder: stop sleep timer / log wakeup
  stopSleep(): void {
    this._isSleeping.set(false);
    this._sleepStartTime.set(null);
    console.log('[SleepService] wakeup logged — Firebase not yet wired');
  }
}
