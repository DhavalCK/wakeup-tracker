import { Injectable, signal, computed, inject } from '@angular/core';
import { SleepEntry, SleepStats } from '../models/sleep-entry.model';
import { AuthService } from './auth.service';
import { Firestore, collection, query, orderBy, collectionData, addDoc, updateDoc, doc, serverTimestamp, Timestamp } from '@angular/fire/firestore';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, of, Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SleepService {
  private readonly authService = inject(AuthService);
  private readonly firestore = inject(Firestore);

  private readonly _loading = signal<boolean>(false);

  // Derived Firestore Query
  private readonly entriesQuery = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return null;
    const entriesRef = collection(this.firestore, `users/${user.uid}/sleep_entries`);
    return query(entriesRef, orderBy('sleepTime', 'desc'));
  });

  // Reactive Firestore Stream
  private readonly entries$ = toObservable(this.entriesQuery).pipe(
    switchMap(q => {
      if (!q) return of([]);
      return collectionData(q, { idField: 'id' }).pipe(
        catchError(err => {
          console.error("Error fetching sleep data", err);
          return of([]);
        })
      ) as Observable<any[]>;
    }),
    map(entries => entries.map(e => ({
      ...e,
      sleepTime: e.sleepTime?.toDate ? e.sleepTime.toDate() : new Date(e.sleepTime),
      wakeupTime: e.wakeupTime ? (e.wakeupTime.toDate ? e.wakeupTime.toDate() : new Date(e.wakeupTime)) : null,
      createdAt: e.createdAt?.toDate ? e.createdAt.toDate() : new Date(e.createdAt)
    }) as SleepEntry))
  );

  // State Signals
  readonly entries = toSignal(this.entries$, { initialValue: [] });
  readonly loading = this._loading.asReadonly();

  // Active Sleep Session derived from entries
  readonly activeEntry = computed(() => {
    const all = this.entries();
    return all.find(e => !e.wakeupTime) || null;
  });

  readonly isSleeping = computed(() => !!this.activeEntry());
  readonly sleepStartTime = computed(() => this.activeEntry()?.sleepTime || null);

  // Computed: today's stats
  readonly todayStats = computed(() => {
    const today = new Date();
    return this.entries().filter((e) => {
      if (!e.wakeupTime) return false;
      const d = new Date(e.wakeupTime);
      return d.toDateString() === today.toDateString();
    });
  });

  readonly stats = computed<SleepStats>(() => {
    const allCompleted = this.entries().filter(e => e.wakeupTime && e.durationMinutes);
    if (!allCompleted.length) {
      return {
        totalSessions: 0,
        averageDurationMinutes: 0,
        bestDurationMinutes: 0,
        averageQuality: 0,
        streak: 0,
      };
    }
    const total = allCompleted.reduce((sum, e) => sum + (e.durationMinutes || 0), 0);
    const best = Math.max(...allCompleted.map((e) => e.durationMinutes || 0));
    return {
      totalSessions: allCompleted.length,
      averageDurationMinutes: Math.round(total / allCompleted.length),
      bestDurationMinutes: best,
      averageQuality: 0,
      streak: 0, // Placeholder mapping to true streak logic if needed
    };
  });

  async startSleep(): Promise<void> {
    const user = this.authService.currentUser();
    if (!user) return;
    
    this._loading.set(true);
    try {
      const entriesRef = collection(this.firestore, `users/${user.uid}/sleep_entries`);
      await addDoc(entriesRef, {
        userId: user.uid,
        sleepTime: serverTimestamp(),
        wakeupTime: null,
        durationMinutes: null,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Failed to start sleep', err);
    } finally {
      this._loading.set(false);
    }
  }

  async stopSleep(): Promise<void> {
    const user = this.authService.currentUser();
    const current = this.activeEntry();
    
    if (!user || !current || !current.id) return;

    this._loading.set(true);
    try {
      const entryRef = doc(this.firestore, `users/${user.uid}/sleep_entries/${current.id}`);
      
      const now = new Date();
      const diffMs = now.getTime() - current.sleepTime.getTime();
      const durationMinutes = Math.round(diffMs / 60000);

      await updateDoc(entryRef, {
        wakeupTime: serverTimestamp(),
        durationMinutes
      });
    } catch (err) {
      console.error('Failed to stop sleep', err);
    } finally {
      this._loading.set(false);
    }
  }
}
