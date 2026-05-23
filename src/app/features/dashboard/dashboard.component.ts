import { Component, inject, computed, signal, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { SleepService } from '../../core/services/sleep.service';
import { ProfileMenuComponent } from '../../shared/components/profile-menu/profile-menu.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, ProfileMenuComponent],
  template: `
    <div class="page-container bg-radial-ethereal">
      <div class="content-scroll">
        
        <!-- Premium Header Area -->
        <header class="flex items-start justify-between mb-12 animate-fade-in">
          <div class="space-y-1">
            <p class="text-premium-muted uppercase tracking-[0.2em]">{{ currentTime() | date:'EEEE, MMM d' }}</p>
            <h1 class="title-large">
              {{ greeting() }},<br/>
              <span class="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                {{ userName() }}
              </span>
            </h1>
          </div>
          <app-profile-menu />
        </header>

        <!-- Live Clock & Focal Point -->
        <div class="flex flex-col items-center justify-center py-8 space-y-12">
          
          <div class="clock-focal animate-float">
            <div class="clock-bg-blur"></div>
            <div class="clock-display">
              <span class="time-digits">{{ currentTime() | date:'h:mm' }}</span>
              <span class="time-period">{{ currentTime() | date:'a' }}</span>
            </div>
            <p class="clock-status">{{ sleepService.isSleeping() ? 'NIGHT MODE ACTIVE' : 'DAY MODE ACTIVE' }}</p>
          </div>

          <!-- Master Action Button -->
          <div class="relative group">
            <div class="absolute inset-0 rounded-full bg-indigo-500/20 blur-3xl group-hover:bg-indigo-500/40 transition-all duration-700"></div>
            <button 
              (click)="toggleSleep()"
              class="btn-master z-10"
              [class.btn-wakeup]="sleepService.isSleeping()"
            >
              <div class="flex flex-col items-center space-y-2">
                <span class="material-symbols-rounded text-5xl">
                   {{ sleepService.isSleeping() ? 'wb_sunny' : 'nightlight' }}
                </span>
                <span class="font-bold tracking-widest text-xs uppercase">
                  {{ sleepService.isSleeping() ? 'Wake Up' : 'Rest' }}
                </span>
              </div>
            </button>
          </div>

        </div>

        <!-- Dashboard Intelligence Section -->
        <section class="mt-16 space-y-6">
          <div class="flex items-end justify-between">
            <h2 class="text-lg font-bold tracking-tight">Today's Pulse</h2>
            <span class="text-xs font-bold text-indigo-400/80 tracking-widest uppercase">Live View</span>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Sleep Health Card -->
            <div class="glass-card flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
               <div class="absolute -right-4 -top-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all"></div>
               <span class="material-symbols-rounded text-indigo-400/60 mb-4">analytics</span>
               <div>
                 <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Avg Depth</p>
                 <h3 class="text-xl font-bold">8h 12m</h3>
               </div>
            </div>

            <!-- Heart Rate / Vitals Placeholder Card -->
            <div class="glass-card flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
               <div class="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
               <span class="material-symbols-rounded text-emerald-400/60 mb-4">monitoring</span>
               <div>
                 <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Recovery</p>
                 <h3 class="text-xl font-bold">92%</h3>
               </div>
            </div>
          </div>

          <!-- Timeline Summary Card -->
          <div class="glass-card mt-4 p-5 flex items-center gap-6">
            <div class="flex-1 space-y-3">
              <h4 class="text-sm font-bold text-slate-200">Session in progress</h4>
              <div class="flex items-center gap-2">
                <div class="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
                  <div class="bg-indigo-500 h-full w-2/3 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                </div>
                <span class="text-[10px] font-bold text-slate-500">62%</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
               <span class="material-symbols-rounded">more_time</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  `,
  styles: [`
    .bg-radial-ethereal {
      background: radial-gradient(circle at 50% -20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                  radial-gradient(circle at 0% 100%, rgba(16, 185, 129, 0.05) 0%, transparent 40%),
                  var(--color-bg);
    }

    .profile-frame {
      @apply w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5;
      background: rgba(255, 255, 255, 0.03);
    }

    /* Clock Focal Point */
    .clock-focal {
      @apply relative flex flex-col items-center justify-center text-center p-8;
    }

    .clock-bg-blur {
      @apply absolute inset-0 blur-3xl opacity-10 bg-indigo-500 scale-150;
      z-index: -1;
    }

    .time-digits {
      @apply text-7xl font-bold tracking-tighter text-white tabular-nums;
      filter: drop-shadow(0 0 20px rgba(255,255,255,0.1));
    }

    .time-period {
      @apply text-xl font-bold text-indigo-400/80 ml-2 uppercase tracking-widest;
    }

    .clock-status {
      @apply mt-4 text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase;
    }

    /* Master Button Overrides */
    .btn-wakeup {
      background: linear-gradient(135deg, #10b981, #059669);
      box-shadow: 0 0 40px var(--color-success-glow), 0 10px 30px rgba(0,0,0,0.4);
      &::after { @apply animate-pulse; background: #10b981; }
    }

    .animate-fade-in {
      animation: fadeIn 1s ease-out forwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class DashboardComponent implements OnInit, OnDestroy {
  readonly authService: AuthService = inject(AuthService);
  readonly sleepService: SleepService = inject(SleepService);
  
  private _currentTime = signal<Date>(new Date());
  readonly currentTime = this._currentTime.asReadonly();
  
  private timer?: any;

  ngOnInit() {
    this.timer = setInterval(() => {
      this._currentTime.set(new Date());
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  readonly greeting = computed(() => {
    const hour = this.currentTime().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  });

  readonly userName = computed(() => {
    const user = this.authService.currentUser();
    return user?.displayName?.split(' ')[0] ?? 'Explorer';
  });

  toggleSleep() {
    if (this.sleepService.isSleeping()) {
      this.sleepService.stopSleep();
    } else {
      this.sleepService.startSleep();
    }
  }
}
