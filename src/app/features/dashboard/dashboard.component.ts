import { Component, inject, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { SleepService } from '../../core/services/sleep.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="page-container">
      <div class="page-scroll dashboard">

        <!-- Header -->
        <header class="dashboard-header">
          <div class="header-left">
            <p class="header-date">{{ today | date:'EEEE, MMMM d' }}</p>
            <h1 class="header-greeting">{{ greeting() }},<br><span class="header-name">{{ userName() }}</span> 👋</h1>
          </div>
          <button class="avatar-btn" aria-label="Profile">
            <div class="avatar">
              <span class="material-symbols-rounded">person</span>
            </div>
            <div class="avatar-ring"></div>
          </button>
        </header>

        <!-- Sleep Status Card -->
        <section class="section">
          <div class="sleep-status-card" [class.sleeping]="sleepService.isSleeping()">
            <div class="sleep-status-card__bg"></div>
            <div class="sleep-status-card__content">
              <div class="sleep-status-icon">
                <span class="material-symbols-rounded status-icon">
                  {{ sleepService.isSleeping() ? 'bedtime' : 'alarm' }}
                </span>
              </div>
              <div class="sleep-status-info">
                <h2 class="sleep-status-label">
                  {{ sleepService.isSleeping() ? 'Currently Sleeping' : 'Awake & Ready' }}
                </h2>
                @if (sleepService.isSleeping() && sleepService.sleepStartTime()) {
                  <p class="sleep-status-sublabel">
                    Since {{ sleepService.sleepStartTime() | date:'h:mm a' }}
                  </p>
                } @else {
                  <p class="sleep-status-sublabel">Track your next sleep session</p>
                }
              </div>
            </div>

            <!-- Main action button -->
            @if (sleepService.isSleeping()) {
              <button class="wakeup-btn" (click)="logWakeup()">
                <span class="material-symbols-rounded">alarm</span>
                Log Wakeup
              </button>
            } @else {
              <button class="sleep-btn" (click)="startSleep()">
                <span class="material-symbols-rounded">bedtime</span>
                Start Sleep
              </button>
            }
          </div>
        </section>

        <!-- Quick Stats -->
        <section class="section">
          <h2 class="section-header">Overview</h2>
          <div class="stats-grid">
            @for (stat of statsCards(); track stat.label) {
              <div class="stat-card card">
                <div class="stat-card__icon" [style.background]="stat.iconBg">
                  <span class="material-symbols-rounded" [style.color]="stat.iconColor">{{ stat.icon }}</span>
                </div>
                <div class="stat-card__value">{{ stat.value }}</div>
                <div class="stat-card__label">{{ stat.label }}</div>
              </div>
            }
          </div>
        </section>

        <!-- Tonight's Goal -->
        <section class="section">
          <h2 class="section-header">Tonight's Goal</h2>
          <div class="goal-card card">
            <div class="goal-card__header">
              <div class="goal-icon">
                <span class="material-symbols-rounded">target</span>
              </div>
              <div>
                <div class="goal-title">8 Hours of Sleep</div>
                <div class="goal-subtitle">Recommended for adults</div>
              </div>
              <span class="badge badge-accent">Tonight</span>
            </div>
            <div class="goal-progress-bar">
              <div class="goal-progress-bar__fill" style="width: 0%"></div>
            </div>
            <div class="goal-progress-labels">
              <span>0h 0m logged</span>
              <span>Goal: 8h</span>
            </div>
          </div>
        </section>

        <!-- Recent Sessions -->
        <section class="section">
          <div class="section-row">
            <h2 class="section-header" style="margin-bottom: 0">Recent Sessions</h2>
            <a class="view-all-btn" href="/history">View all</a>
          </div>

          @if (sleepService.entries().length === 0) {
            <div class="empty-state card">
              <span class="material-symbols-rounded empty-state__icon">bedtime</span>
              <p class="empty-state__text">No sleep sessions yet.</p>
              <p class="empty-state__sub">Tap "Start Sleep" to begin tracking!</p>
            </div>
          } @else {
            @for (entry of sleepService.entries().slice(0, 3); track entry.id) {
              <div class="session-card card-interactive">
                <div class="session-icon">
                  <span class="material-symbols-rounded">bedtime</span>
                </div>
                <div class="session-info">
                  <div class="session-date">{{ entry.wakeupTime | date:'MMM d' }}</div>
                  <div class="session-times">
                    {{ entry.sleepTime | date:'h:mm a' }} → {{ entry.wakeupTime | date:'h:mm a' }}
                  </div>
                </div>
                <div class="session-duration badge-success badge">
                  {{ formatDuration(entry.durationMinutes) }}
                </div>
              </div>
            }
          }
        </section>

        <!-- Bottom padding for nav -->
        <div style="height: 16px;"></div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 0;
      background: #0d0d0f;
    }

    /* Header */
    .dashboard-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 56px 20px 20px;
      background: linear-gradient(180deg, rgba(108,99,255,0.06) 0%, transparent 100%);
    }

    .header-date {
      font-size: 12px;
      color: #9ca3af;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 0 0 4px;
    }

    .header-greeting {
      font-size: 22px;
      font-weight: 700;
      line-height: 1.3;
      margin: 0;
      color: #f1f1f3;
    }

    .header-name {
      color: #8b84ff;
    }

    .avatar-btn {
      position: relative;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
      margin-top: 8px;
    }

    .avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(108,99,255,0.3), rgba(108,99,255,0.1));
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid rgba(108,99,255,0.35);
    }

    .avatar .material-symbols-rounded {
      color: #8b84ff;
      font-size: 22px;
    }

    .avatar-ring {
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      border: 1.5px solid rgba(108,99,255,0.3);
      animation: pulse-ring 2.5s ease-in-out infinite;
    }

    @keyframes pulse-ring {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.08); opacity: 0.2; }
    }

    /* Section */
    .section {
      padding: 0 16px 20px;
    }

    .section-header {
      font-size: 15px;
      font-weight: 600;
      color: #f1f1f3;
      margin: 0 0 12px;
    }

    .section-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .view-all-btn {
      font-size: 13px;
      color: #6c63ff;
      text-decoration: none;
      font-weight: 500;
    }

    /* Sleep Status Card */
    .sleep-status-card {
      border-radius: 20px;
      padding: 20px;
      border: 1px solid rgba(255,255,255,0.07);
      background: #1a1a1f;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .sleep-status-card__bg {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top right, rgba(108,99,255,0.08) 0%, transparent 60%);
      transition: all 0.3s ease;
    }

    .sleep-status-card.sleeping .sleep-status-card__bg {
      background: radial-gradient(circle at top right, rgba(16,185,129,0.08) 0%, transparent 60%);
    }

    .sleep-status-card.sleeping {
      border-color: rgba(16,185,129,0.2);
    }

    .sleep-status-card__content {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 18px;
      position: relative;
    }

    .sleep-status-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: rgba(108,99,255,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.3s ease;
    }

    .sleep-status-card.sleeping .sleep-status-icon {
      background: rgba(16,185,129,0.15);
    }

    .status-icon {
      font-size: 26px;
      color: #8b84ff;
      font-variation-settings: 'FILL' 1;
      transition: color 0.3s ease;
    }

    .sleep-status-card.sleeping .status-icon {
      color: #34d399;
    }

    .sleep-status-label {
      font-size: 16px;
      font-weight: 600;
      color: #f1f1f3;
      margin: 0 0 2px;
    }

    .sleep-status-sublabel {
      font-size: 12px;
      color: #9ca3af;
      margin: 0;
    }

    .sleep-btn, .wakeup-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 13px 20px;
      border-radius: 14px;
      border: none;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }

    .sleep-btn {
      background: linear-gradient(135deg, #6c63ff, #5249e5);
      color: white;
      box-shadow: 0 4px 16px rgba(108,99,255,0.35);
    }
    .sleep-btn:hover { box-shadow: 0 6px 24px rgba(108,99,255,0.5); transform: translateY(-1px); }
    .sleep-btn:active { transform: translateY(0); }

    .wakeup-btn {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      box-shadow: 0 4px 16px rgba(16,185,129,0.35);
    }
    .wakeup-btn:hover { box-shadow: 0 6px 24px rgba(16,185,129,0.5); transform: translateY(-1px); }
    .wakeup-btn:active { transform: translateY(0); }

    /* Stats grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .stat-card {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .stat-card__icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-card__icon .material-symbols-rounded {
      font-size: 20px;
      font-variation-settings: 'FILL' 1;
    }

    .stat-card__value {
      font-size: 22px;
      font-weight: 700;
      color: #f1f1f3;
    }

    .stat-card__label {
      font-size: 11px;
      color: #9ca3af;
      font-weight: 500;
    }

    /* Goal card */
    .goal-card {
      padding: 18px;
    }

    .goal-card__header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .goal-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: rgba(245,158,11,0.12);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .goal-icon .material-symbols-rounded {
      font-size: 22px;
      color: #fbbf24;
      font-variation-settings: 'FILL' 1;
    }

    .goal-title {
      font-size: 14px;
      font-weight: 600;
      color: #f1f1f3;
    }

    .goal-subtitle {
      font-size: 12px;
      color: #9ca3af;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 500;
    }

    .badge-accent {
      background: rgba(108,99,255,0.15);
      color: #8b84ff;
      border: 1px solid rgba(108,99,255,0.25);
      margin-left: auto;
    }

    .badge-success {
      background: rgba(16,185,129,0.15);
      color: #34d399;
      border: 1px solid rgba(16,185,129,0.25);
    }

    .goal-progress-bar {
      height: 6px;
      background: rgba(255,255,255,0.08);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .goal-progress-bar__fill {
      height: 100%;
      background: linear-gradient(90deg, #6c63ff, #8b84ff);
      border-radius: 3px;
      transition: width 0.5s ease;
    }

    .goal-progress-labels {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #6b7280;
    }

    /* Session cards */
    .session-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      margin-bottom: 8px;
      border-radius: 16px;
      background: #1a1a1f;
      border: 1px solid rgba(255,255,255,0.06);
      transition: all 0.2s ease;
    }

    .session-icon {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: rgba(108,99,255,0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .session-icon .material-symbols-rounded {
      font-size: 20px;
      color: #8b84ff;
      font-variation-settings: 'FILL' 1;
    }

    .session-info { flex: 1; }

    .session-date {
      font-size: 13px;
      font-weight: 600;
      color: #f1f1f3;
    }

    .session-times {
      font-size: 11px;
      color: #9ca3af;
    }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 36px 20px;
    }

    .empty-state__icon {
      font-size: 48px;
      color: rgba(108,99,255,0.3);
      font-variation-settings: 'FILL' 1;
      margin-bottom: 12px;
      display: block;
    }

    .empty-state__text {
      font-size: 15px;
      font-weight: 600;
      color: #9ca3af;
      margin: 0 0 4px;
    }

    .empty-state__sub {
      font-size: 13px;
      color: #6b7280;
      margin: 0;
    }
  `],
})
export class DashboardComponent {
  readonly authService: AuthService = inject(AuthService);
  readonly sleepService: SleepService = inject(SleepService);

  readonly today = new Date();

  readonly greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  });

  readonly userName = computed(() => {
    const user = this.authService.currentUser();
    return user?.displayName?.split(' ')[0] ?? 'Traveler';
  });

  readonly statsCards = computed(() => {
    const stats = this.sleepService.stats();
    return [
      {
        icon: 'show_chart',
        label: 'Avg Sleep',
        value: this.formatDuration(stats.averageDurationMinutes),
        iconBg: 'rgba(108,99,255,0.12)',
        iconColor: '#8b84ff',
      },
      {
        icon: 'local_fire_department',
        label: 'Day Streak',
        value: `${stats.streak}d`,
        iconBg: 'rgba(245,158,11,0.12)',
        iconColor: '#fbbf24',
      },
      {
        icon: 'alarm',
        label: 'Sessions',
        value: `${stats.totalSessions}`,
        iconBg: 'rgba(16,185,129,0.12)',
        iconColor: '#34d399',
      },
      {
        icon: 'hotel',
        label: 'Best Sleep',
        value: this.formatDuration(stats.bestDurationMinutes),
        iconBg: 'rgba(239,68,68,0.10)',
        iconColor: '#f87171',
      },
    ];
  });

  startSleep(): void {
    this.sleepService.startSleep();
  }

  logWakeup(): void {
    this.sleepService.stopSleep();
  }

  formatDuration(minutes: number): string {
    if (!minutes) return '—';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }
}
