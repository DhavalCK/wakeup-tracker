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
    <div class="page-container">
      <div class="page-scroll history-page">

        <!-- Header -->
        <header class="history-header">
          <h1 class="history-title">Sleep History</h1>
          <p class="history-subtitle">Your sleep journey over time</p>
        </header>

        <!-- Filter Tabs -->
        <div class="filter-tabs">
          @for (period of filterPeriods; track period.value) {
            <button
              class="filter-tab"
              [class.active]="activePeriod() === period.value"
              (click)="setFilter(period.value)"
            >
              {{ period.label }}
            </button>
          }
        </div>

        <!-- Summary Strip -->
        <div class="summary-strip">
          @for (chip of summaryChips(); track chip.label) {
            <div class="summary-chip">
              <span class="material-symbols-rounded summary-chip__icon">{{ chip.icon }}</span>
              <div>
                <div class="summary-chip__value">{{ chip.value }}</div>
                <div class="summary-chip__label">{{ chip.label }}</div>
              </div>
            </div>
          }
        </div>

        <!-- Loading -->
        @if (sleepService.loading()) {
          <app-loading-spinner />
        } @else if (filteredEntries().length === 0) {
          <!-- Empty State -->
          <div class="empty-history">
            <div class="empty-history__icon-wrap">
              <span class="material-symbols-rounded">history</span>
            </div>
            <h3 class="empty-history__title">No sessions yet</h3>
            <p class="empty-history__sub">
              Your sleep history will appear here once you start tracking.
            </p>
          </div>
        } @else {
          <!-- Entries list -->
          <div class="entries-container">
            @for (entry of filteredEntries(); track entry.id; let i = $index) {
              <div class="entry-card card-interactive">
                <!-- Date badge -->
                <div class="entry-date-badge">
                  <span class="entry-date-day">{{ entry.wakeupTime | date:'d' }}</span>
                  <span class="entry-date-month">{{ entry.wakeupTime | date:'MMM' }}</span>
                </div>

                <!-- Entry details -->
                <div class="entry-details">
                  <div class="entry-time-row">
                    <span class="entry-icon-wrap">
                      <span class="material-symbols-rounded" style="color:#8b84ff; font-size:14px; font-variation-settings:'FILL' 1">bedtime</span>
                    </span>
                    <span class="entry-time">{{ entry.sleepTime | date:'h:mm a' }}</span>
                    <span class="entry-arrow">→</span>
                    <span class="entry-icon-wrap">
                      <span class="material-symbols-rounded" style="color:#34d399; font-size:14px; font-variation-settings:'FILL' 1">alarm</span>
                    </span>
                    <span class="entry-time">{{ entry.wakeupTime | date:'h:mm a' }}</span>
                  </div>
                  @if (entry.notes) {
                    <p class="entry-notes">{{ entry.notes }}</p>
                  }
                </div>

                <!-- Duration chip -->
                <div class="entry-duration" [class.good]="entry.durationMinutes >= 420">
                  <span class="entry-duration__value">{{ formatDuration(entry.durationMinutes) }}</span>
                  <span class="entry-duration__label">{{ getDurationLabel(entry.durationMinutes) }}</span>
                </div>
              </div>
            }
          </div>
        }

        <div style="height: 16px;"></div>
      </div>
    </div>
  `,
  styles: [`
    .history-page {
      background: #0d0d0f;
    }

    /* Header */
    .history-header {
      padding: 56px 20px 16px;
      background: linear-gradient(180deg, rgba(16,185,129,0.05) 0%, transparent 100%);
    }

    .history-title {
      font-size: 26px;
      font-weight: 800;
      color: #f1f1f3;
      margin: 0 0 4px;
    }

    .history-subtitle {
      font-size: 13px;
      color: #9ca3af;
      margin: 0;
    }

    /* Filter tabs */
    .filter-tabs {
      display: flex;
      gap: 8px;
      padding: 0 20px 20px;
    }

    .filter-tab {
      padding: 7px 16px;
      border-radius: 100px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.04);
      color: #9ca3af;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      -webkit-tap-highlight-color: transparent;
    }

    .filter-tab.active {
      background: rgba(108,99,255,0.18);
      border-color: rgba(108,99,255,0.35);
      color: #8b84ff;
      font-weight: 600;
    }

    /* Summary strip */
    .summary-strip {
      display: flex;
      gap: 10px;
      padding: 0 20px 24px;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .summary-strip::-webkit-scrollbar { display: none; }

    .summary-chip {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 14px;
      background: #1a1a1f;
      border: 1px solid rgba(255,255,255,0.06);
      flex-shrink: 0;
    }

    .summary-chip__icon {
      font-size: 20px;
      color: #8b84ff;
      font-variation-settings: 'FILL' 1;
    }

    .summary-chip__value {
      font-size: 16px;
      font-weight: 700;
      color: #f1f1f3;
      line-height: 1;
    }

    .summary-chip__label {
      font-size: 10px;
      color: #9ca3af;
      margin-top: 2px;
    }

    /* Empty state */
    .empty-history {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px 32px;
      text-align: center;
    }

    .empty-history__icon-wrap {
      width: 80px;
      height: 80px;
      border-radius: 24px;
      background: rgba(108,99,255,0.08);
      border: 1px solid rgba(108,99,255,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .empty-history__icon-wrap .material-symbols-rounded {
      font-size: 40px;
      color: rgba(108,99,255,0.4);
      font-variation-settings: 'FILL' 1;
    }

    .empty-history__title {
      font-size: 18px;
      font-weight: 700;
      color: #9ca3af;
      margin: 0 0 8px;
    }

    .empty-history__sub {
      font-size: 13px;
      color: #6b7280;
      margin: 0;
      line-height: 1.6;
    }

    /* Entries */
    .entries-container {
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .entry-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px;
      border-radius: 18px;
      background: #1a1a1f;
      border: 1px solid rgba(255,255,255,0.06);
      transition: all 0.2s ease;
    }

    .entry-card:hover {
      background: #1e1e24;
      transform: translateY(-1px);
      box-shadow: 0 6px 24px rgba(0,0,0,0.4);
    }

    .entry-date-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 52px;
      border-radius: 13px;
      background: rgba(108,99,255,0.1);
      border: 1px solid rgba(108,99,255,0.18);
      flex-shrink: 0;
    }

    .entry-date-day {
      font-size: 20px;
      font-weight: 800;
      color: #8b84ff;
      line-height: 1;
    }

    .entry-date-month {
      font-size: 10px;
      font-weight: 600;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .entry-details {
      flex: 1;
      min-width: 0;
    }

    .entry-time-row {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .entry-icon-wrap {
      display: flex;
      align-items: center;
    }

    .entry-time {
      font-size: 13px;
      font-weight: 500;
      color: #f1f1f3;
    }

    .entry-arrow {
      font-size: 11px;
      color: #6b7280;
    }

    .entry-notes {
      font-size: 11px;
      color: #9ca3af;
      margin: 4px 0 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .entry-duration {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
    }

    .entry-duration__value {
      font-size: 15px;
      font-weight: 700;
      color: #f87171;
    }

    .entry-duration.good .entry-duration__value {
      color: #34d399;
    }

    .entry-duration__label {
      font-size: 9px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-top: 2px;
    }
  `],
})
export class HistoryComponent {
  readonly sleepService: SleepService = inject(SleepService);

  readonly activePeriod = signal<FilterPeriod>('week');

  readonly filterPeriods: { value: FilterPeriod; label: string }[] = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' },
  ];

  readonly filteredEntries = computed((): SleepEntry[] => {
    const all: SleepEntry[] = this.sleepService.entries();
    const now = new Date();

    switch (this.activePeriod()) {
      case 'week': {
        const cutoff = new Date(now);
        cutoff.setDate(now.getDate() - 7);
        return all.filter((e: SleepEntry) => new Date(e.wakeupTime) >= cutoff);
      }
      case 'month': {
        const cutoff = new Date(now);
        cutoff.setMonth(now.getMonth() - 1);
        return all.filter((e: SleepEntry) => new Date(e.wakeupTime) >= cutoff);
      }
      default:
        return all;
    }
  });

  readonly summaryChips = computed(() => {
    const entries: SleepEntry[] = this.filteredEntries();
    const avg = entries.length
      ? Math.round(entries.reduce((s: number, e: SleepEntry) => s + e.durationMinutes, 0) / entries.length)
      : 0;
    const best = entries.length ? Math.max(...entries.map((e: SleepEntry) => e.durationMinutes)) : 0;

    return [
      { icon: 'show_chart', value: this.formatDuration(avg), label: 'Avg Sleep' },
      { icon: 'hotel', value: this.formatDuration(best), label: 'Best' },
      { icon: 'calendar_month', value: `${entries.length}`, label: 'Sessions' },
    ];
  });

  setFilter(period: FilterPeriod): void {
    this.activePeriod.set(period);
  }

  formatDuration(minutes: number): string {
    if (!minutes) return '—';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  getDurationLabel(minutes: number): string {
    if (minutes >= 480) return 'Excellent';
    if (minutes >= 420) return 'Good';
    if (minutes >= 360) return 'Fair';
    return 'Poor';
  }
}
