import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoadingSpinnerComponent],
  template: `
    <div class="login-page bg-login-ethereal">
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      <!-- Premium Background Blobs -->
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>

      <div class="relative z-10 w-full max-w-sm px-6 text-center space-y-12">
        
        <!-- Brand Identity -->
        <div class="space-y-4 animate-fade-in">
          <div class="logo-outer">
            <div class="logo-inner">
               <span class="material-symbols-rounded text-indigo-400 text-4xl">bedtime</span>
            </div>
          </div>
          <div class="space-y-2">
            <h1 class="text-4xl font-black tracking-tighter text-white">
              Wakeup<span class="text-indigo-500">.</span>
            </h1>
            <p class="text-premium-muted uppercase tracking-widest text-[10px] font-black">
              Engineering Your Rest
            </p>
          </div>
        </div>

        <!-- Glass Login Card -->
        <div class="glass-card p-8 animate-slide-up space-y-8">
          <div class="space-y-2">
            <h2 class="text-xl font-bold tracking-tight">Access Your Pulse</h2>
            <p class="text-sm text-slate-400 font-medium">Connect and track your transition from night to day.</p>
          </div>

          @if (authService.loading()) {
            <app-loading-spinner />
          } @else {
            <button
              (click)="signInWithGoogle()"
              class="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          }

          <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-loose">
            SECURE CLOUD SYNC ACTIVE
          </p>
        </div>

        <p class="text-[10px] text-slate-600 font-medium px-4">
          By continuing, you adopt our sophisticated approach to data privacy and behavioral tracking.
        </p>

      </div>
    </div>
  `,
  styles: [`
    .bg-login-ethereal {
      background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 80%),
                  var(--color-bg);
    }
    
    .login-page {
      @apply min-h-screen flex items-center justify-center overflow-hidden relative;
    }

    .logo-outer {
      @apply w-24 h-24 mx-auto rounded-[32px] flex items-center justify-center border border-white/5 shadow-2xl;
      background: rgba(255, 255, 255, 0.02);
    }

    .logo-inner {
      @apply w-16 h-16 rounded-[24px] flex items-center justify-center border border-indigo-500/20;
      background: rgba(99, 102, 241, 0.05);
    }

    .blob {
      @apply absolute rounded-full blur-[120px] opacity-20 pointer-events-none;
    }
    .blob-1 { @apply w-[400px] h-[400px] -top-20 -right-20 bg-indigo-500 animate-pulse; }
    .blob-2 { @apply w-[300px] h-[300px] -bottom-20 -left-20 bg-emerald-500 animate-pulse; }

    .animate-slide-up {
      animation: slideUp 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class LoginComponent {
  readonly authService: AuthService = inject(AuthService);

  async signInWithGoogle(): Promise<void> {
    await this.authService.signInWithGoogle();
  }
}
