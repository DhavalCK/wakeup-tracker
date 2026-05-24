import { Component, inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SleepService } from '../../core/services/sleep.service';
import { SleepEntry } from '../../core/models/sleep-entry.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

type FilterPeriod = 'week' | 'month' | 'all';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [DatePipe, LoadingSpinnerComponent],
  template: `
    <div class="page-container bg-history-ethereal">
      <div class="content-scroll">
        
        <!-- Premium Header -->
        <header class="mb-10 animate-fade-in">
          <p class="text-premium-muted uppercase tracking-[0.2em] mb-1">Archive</p>
          <h1 class="title-large">Journal</h1>
        </header>

        <!-- Filter Pills -->
        <div class="flex gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
          @for (period of filterPeriods; track period.value) {
            <button
              (click)="setFilter(period.value)"
              class="filter-pill"
              [class.active]="activePeriod() === period.value"
            >
              {{ period.label }}
            </button>
          }
        </div>

        <!-- Summary Insights -->
        <div class="grid grid-cols-3 gap-4 mb-12">
          @for (chip of summaryChips(); track chip.label) {
            <div class="glass-premium rounded-3xl p-4 flex flex-col items-center text-center space-y-1">
              <span class="material-symbols-rounded text-indigo-400 text-xl">{{ chip.icon }}</span>
              <p class="text-xs font-bold text-slate-500 uppercase tracking-tighter">{{ chip.label }}</p>
              <h3 class="font-bold text-sm">{{ chip.value }}</h3>
            </div>
          }
        </div>

        <!-- Entries Section -->
        @if (sleepService.loading()) {
          <app-loading-spinner />
        } @else if (filteredEntries().length === 0) {
          <div class="glass-card flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div class="w-16 h-16 rounded-full bg-slate-800/30 flex items-center justify-center text-slate-600">
               <span class="material-symbols-rounded text-3xl">history</span>
            </div>
            <div class="space-y-1">
              <h3 class="font-bold text-slate-300">No Journal Entries</h3>
              <p class="text-xs text-slate-500 max-w-[200px]">Your sleep evolution starts after your first restful night.</p>
            </div>
          </div>
        } @else {
          <div class="space-y-4">
             @for (entry of filteredEntries(); track entry.id) {
               <div class="glass-card p-5 group flex items-center justify-between">
                  <div class="flex items-center gap-5">
                    <div class="w-12 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center justify-center">
                       <span class="text-[10px] font-black text-indigo-400/60 uppercase">{{ entry.wakeupTime | date:'MMM' }}</span>
                       <span class="text-lg font-black text-indigo-400">{{ entry.wakeupTime | date:'d' }}</span>
                    </div>
                    <div class="space-y-1">
                       <p class="text-xs font-bold text-slate-400 tracking-wide">
                        {{ entry.sleepTime | date:'h:mm a' }} – {{ entry.wakeupTime | date:'h:mm a' }}
                       </p>
                       <div class="flex items-center gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Restored</span>
                       </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <h4 class="font-black text-lg">{{ formatDuration(entry.durationMinutes || 0) }}</h4>
                    <p class="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Optimal</p>
                  </div>
               </div>
             }
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .bg-history-ethereal {
      background: radial-gradient(circle at 100% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 40%),
                  var(--color-bg);
    }

    .filter-pill {
      @apply px-6 py-2.5 rounded-full border border-white/5 text-slate-500 text-xs font-bold transition-all whitespace-nowrap;
      background: rgba(255, 255, 255, 0.02);
      
      &.active {
        @apply border-indigo-500/30 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.1)];
        background: rgba(99, 102, 241, 0.08);
      }
    }

    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `],
})
export class HistoryComponent {
  readonly sleepService: SleepService = inject(SleepService);
  readonly activePeriod = signal<FilterPeriod>('week');

  readonly filterPeriods: { value: FilterPeriod; label: string }[] = [
    { value: 'week', label: '7 DAYS' },
    { value: 'month', label: '30 DAYS' },
    { value: 'all', label: 'ALL TIME' },
  ];

  readonly filteredEntries = computed((): SleepEntry[] => {
    const all: SleepEntry[] = this.sleepService.entries();
    const now = new Date();
    // Simplified filtering logic for demo
    return all;
  });

  readonly summaryChips = computed(() => {
    return [
      { icon: 'bolt', label: 'Avg REST', value: '7.4h' },
      { icon: 'verified', label: 'Quality', value: '94%' },
      { icon: 'calendar_today', label: 'Logs', value: '28' },
    ];
  });

  setFilter(period: FilterPeriod): void {
    this.activePeriod.set(period);
  }

  formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }
}
