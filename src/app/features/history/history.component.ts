import { Component, inject, signal, computed } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { SleepService } from '../../core/services/sleep.service';
import { SleepEntry } from '../../core/models/sleep-entry.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { trigger, transition, style, animate, state } from '@angular/animations';

interface GroupedEntries {
  date: string;
  entries: SleepEntry[];
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="page-container bg-history-ethereal">
      <div class="content-scroll">
        
        <!-- Premium Header -->
        <header class="mb-10 animate-fade-in">
          <p class="text-premium-muted uppercase tracking-[0.2em] mb-1">Archive</p>
          <div class="flex items-center justify-between">
            <h1 class="title-large">Journal</h1>
            <div class="h-10 w-10 rounded-full glass-premium flex items-center justify-center text-indigo-400">
               <span class="material-symbols-rounded">calendar_month</span>
            </div>
          </div>
        </header>

        <!-- Insights Bar -->
        <div class="flex gap-4 mb-10 overflow-x-auto no-scrollbar pb-2">
          <div class="glass-pill">
            <span class="text-indigo-400">bolt</span>
            <span>{{ sleepService.stats().averageDurationMinutes ? formatDuration(sleepService.stats().averageDurationMinutes) : '0h' }} Avg</span>
          </div>
          <div class="glass-pill">
            <span class="text-emerald-400">star</span>
            <span>{{ sleepService.stats().totalSessions }} Sessions</span>
          </div>
        </div>

        <!-- History Content -->
        @if (sleepService.loading()) {
          <div class="space-y-4">
            @for (i of [1,2,3]; track i) {
              <div class="skeleton-card"></div>
            }
          </div>
        } @else if (groupedEntries().length === 0) {
          <div class="empty-state animate-fade-in">
            <div class="empty-icon-frame">
              <span class="material-symbols-rounded text-5xl opacity-20">bedtime</span>
            </div>
            <h3 class="text-lg font-bold text-slate-300">Quiet in the Archive</h3>
            <p class="text-sm text-slate-500 max-w-[240px]">Your nightly transitions will appear here once you log your first session.</p>
          </div>
        } @else {
          <div class="timeline-container">
            @for (group of groupedEntries(); track group.date) {
              <div class="date-group animate-group">
                <h3 class="group-header">{{ group.date | date:'MMMM yyyy' }}</h3>
                
                <div class="entries-list">
                  @for (entry of group.entries; track entry.id) {
                    <div 
                      class="history-card-wrapper"
                      [class.expanded]="expandedId() === entry.id"
                      (click)="toggleExpand(entry.id!)"
                    >
                      <div class="history-card glass-card">
                        <!-- Card Main Content -->
                        <div class="flex items-center justify-between w-full">
                          <div class="flex items-center gap-4">
                            <div class="date-badge">
                              <span class="day">{{ entry.wakeupTime | date:'dd' }}</span>
                              <span class="weekday">{{ entry.wakeupTime | date:'EEE' }}</span>
                            </div>
                            <div class="session-info">
                              <p class="time-range">
                                {{ entry.sleepTime | date:'HH:mm' }} — {{ entry.wakeupTime | date:'HH:mm' }}
                              </p>
                              <div class="quality-label">
                                <span class="dot" [class.bg-emerald-500]="(entry.durationMinutes || 0) > 420" [class.bg-amber-500]="(entry.durationMinutes || 0) <= 420"></span>
                                <span class="label">Restored</span>
                              </div>
                            </div>
                          </div>
                          
                          <div class="duration-highlight">
                            <span class="value">{{ formatDuration(entry.durationMinutes || 0) }}</span>
                            <span class="material-symbols-rounded arrow">expand_more</span>
                          </div>
                        </div>

                        <!-- Card Expanded Details -->
                        @if (expandedId() === entry.id) {
                          <div class="expanded-details pt-6 mt-6 border-t border-white/5 animate-slide-down">
                            <div class="grid grid-cols-2 gap-4">
                              <div class="detail-item">
                                <p class="label">Bedtime</p>
                                <p class="value">{{ entry.sleepTime | date:'h:mm a' }}</p>
                              </div>
                              <div class="detail-item">
                                <p class="label">Wake Up</p>
                                <p class="value">{{ entry.wakeupTime | date:'h:mm a' }}</p>
                              </div>
                              <div class="detail-item">
                                <p class="label">Total Reset</p>
                                <p class="value">{{ entry.durationMinutes }} Minutes</p>
                              </div>
                              <div class="detail-item">
                                <p class="label">Quality Index</p>
                                <p class="value">Excellent</p>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  }
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

    .glass-pill {
      @apply flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap transition-all;
      background: rgba(255, 255, 255, 0.03);
      span:first-child { @apply text-base font-normal; }
      &:hover { background: rgba(255, 255, 255, 0.05); @apply border-white/10; }
    }

    /* Grouping & Timeline */
    .timeline-container {
      @apply relative pl-2;
      &::before {
        content: '';
        @apply absolute left-0 top-4 bottom-4 w-px bg-gradient-to-b from-indigo-500/20 via-slate-800/20 to-transparent;
      }
    }

    .group-header {
      @apply text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 pt-4;
    }

    .date-group {
      @apply mb-12 relative;
    }

    /* History Card Styling */
    .history-card-wrapper {
      @apply mb-4 transition-all duration-500 cursor-pointer;
      &.expanded { @apply mb-8; }
    }

    .history-card {
      @apply relative transition-all duration-500;
      &.expanded { @apply ring-1 ring-indigo-500/20; }
      
      .arrow {
        @apply transition-transform duration-500 text-slate-600;
      }
      &.expanded .arrow { @apply rotate-180 text-indigo-400; }
    }

    .date-badge {
      @apply flex flex-col items-center justify-center p-2 rounded-2xl bg-white/5 border border-white/5 w-12 h-14;
      .day { @apply text-lg font-black text-slate-200 leading-none mb-1; }
      .weekday { @apply text-[9px] font-bold text-slate-500 uppercase tracking-tighter; }
    }

    .time-range {
      @apply text-sm font-bold text-slate-200 mb-1;
    }

    .quality-label {
      @apply flex items-center gap-2;
      .dot { @apply w-1.5 h-1.5 rounded-full; }
      .label { @apply text-[10px] font-bold text-slate-500 uppercase tracking-widest; }
    }

    .duration-highlight {
      @apply flex flex-col items-end gap-1;
      .value { @apply font-black text-lg text-slate-200 tabular-nums; }
    }

    /* Expanded Content */
    .detail-item {
      .label { @apply text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1; }
      .value { @apply text-sm font-bold text-slate-300; }
    }

    /* Skeleton Loading */
    .skeleton-card {
      @apply h-24 w-full rounded-3xl bg-white/5 animate-pulse;
      border: 1px solid rgba(255,255,255,0.02);
    }

    /* Empty State */
    .empty-state {
      @apply flex flex-col items-center justify-center py-20 text-center;
    }
    .empty-icon-frame {
      @apply w-24 h-24 rounded-[32px] bg-white/5 flex items-center justify-center mb-6;
      background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 100%);
    }

    .animate-slide-down {
      animation: slideDown 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .no-scrollbar::-webkit-scrollbar { display: none; }
  `],
})
export class HistoryComponent {
  readonly sleepService: SleepService = inject(SleepService);
  
  readonly expandedId = signal<string | null>(null);

  // Group entries by Month/Year for the journal view
  readonly groupedEntries = computed(() => {
    const entries = this.sleepService.entries()
      .filter(e => e.wakeupTime) // Only show completed sessions
      .sort((a, b) => b.sleepTime.getTime() - a.sleepTime.getTime());

    const groups: { [key: string]: SleepEntry[] } = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.sleepTime);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(entry);
    });

    return Object.keys(groups).map(key => ({
      date: key,
      entries: groups[key]
    })).sort((a, b) => b.date.localeCompare(a.date));
  });

  toggleExpand(id: string) {
    this.expandedId.update(current => current === id ? null : id);
  }

  formatDuration(minutes: number): string {
    if (!minutes) return '0h';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }
}
