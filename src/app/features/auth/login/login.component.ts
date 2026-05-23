import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoadingSpinnerComponent],
  template: `
    <div class="login-page">
      <!-- Animated background blobs -->
      <div class="bg-blob bg-blob--1"></div>
      <div class="bg-blob bg-blob--2"></div>
      <div class="bg-blob bg-blob--3"></div>

      <div class="login-container">
        <!-- Logo & Branding -->
        <div class="login-brand animate-fade-in">
          <div class="brand-icon">
            <span class="material-symbols-rounded brand-icon__symbol">alarm</span>
          </div>
          <h1 class="brand-name">Wakeup<span class="brand-accent">Tracker</span></h1>
          <p class="brand-tagline">Build better sleep habits, one morning at a time.</p>
        </div>

        <!-- Features preview -->
        <div class="features-list animate-slide-up">
          @for (feature of features; track feature.icon) {
            <div class="feature-chip">
              <span class="material-symbols-rounded feature-chip__icon">{{ feature.icon }}</span>
              <span>{{ feature.label }}</span>
            </div>
          }
        </div>

        <!-- Login Card -->
        <div class="login-card glass animate-slide-up">
          <div class="login-card__header">
            <h2 class="login-card__title">Get Started</h2>
            <p class="login-card__subtitle">Sign in to track your sleep journey</p>
          </div>

          @if (authService.loading()) {
            <app-loading-spinner />
          } @else {
            <button
              class="google-btn"
              (click)="signInWithGoogle()"
              aria-label="Sign in with Google"
            >
              <svg class="google-btn__logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span class="google-btn__text">Continue with Google</span>
            </button>

            <div class="divider-row">
              <span class="divider-line"></span>
              <span class="divider-text">or</span>
              <span class="divider-line"></span>
            </div>

            <p class="login-card__note">
              <span class="material-symbols-rounded" style="font-size:14px; vertical-align:-2px;">lock</span>
              Your data is private & secure
            </p>
          }
        </div>

        <!-- Footer -->
        <p class="login-footer">By signing in, you agree to our Terms & Privacy Policy</p>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100svh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0d0d0f;
      position: relative;
      overflow: hidden;
      padding: 24px 20px;
    }

    /* Animated gradient blobs */
    .bg-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
    }
    .bg-blob--1 {
      width: 300px;
      height: 300px;
      top: -80px;
      right: -60px;
      background: radial-gradient(circle, rgba(108, 99, 255, 0.18) 0%, transparent 70%);
      animation: float 8s ease-in-out infinite;
    }
    .bg-blob--2 {
      width: 250px;
      height: 250px;
      bottom: 120px;
      left: -80px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%);
      animation: float 10s ease-in-out infinite reverse;
    }
    .bg-blob--3 {
      width: 180px;
      height: 180px;
      top: 40%;
      right: -40px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%);
      animation: float 12s ease-in-out infinite 2s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-24px); }
    }

    .login-container {
      width: 100%;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 28px;
      position: relative;
      z-index: 1;
    }

    /* Brand */
    .login-brand {
      text-align: center;
    }

    .brand-icon {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      background: linear-gradient(135deg, rgba(108, 99, 255, 0.25), rgba(108, 99, 255, 0.1));
      border: 1px solid rgba(108, 99, 255, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      box-shadow: 0 0 32px rgba(108, 99, 255, 0.2);
    }

    .brand-icon__symbol {
      font-size: 36px;
      color: #8b84ff;
      font-variation-settings: 'FILL' 1;
    }

    .brand-name {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #f1f1f3;
      margin: 0 0 8px;
    }

    .brand-accent {
      color: #6c63ff;
      background: linear-gradient(135deg, #6c63ff, #8b84ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-tagline {
      font-size: 14px;
      color: #9ca3af;
      margin: 0;
      line-height: 1.5;
    }

    /* Features */
    .features-list {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .feature-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      border-radius: 100px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 12px;
      color: #9ca3af;
    }

    .feature-chip__icon {
      font-size: 14px;
      color: #6c63ff;
      font-variation-settings: 'FILL' 1;
    }

    /* Login card */
    .login-card {
      width: 100%;
      border-radius: 24px;
      padding: 28px 24px;
    }

    .login-card__header {
      margin-bottom: 24px;
      text-align: center;
    }

    .login-card__title {
      font-size: 20px;
      font-weight: 700;
      color: #f1f1f3;
      margin: 0 0 4px;
    }

    .login-card__subtitle {
      font-size: 13px;
      color: #9ca3af;
      margin: 0;
    }

    /* Google button */
    .google-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      width: 100%;
      padding: 14px 20px;
      border-radius: 14px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.06);
      cursor: pointer;
      transition: all 0.2s ease;
      -webkit-tap-highlight-color: transparent;
    }

    .google-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.18);
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }

    .google-btn:active {
      transform: translateY(0);
    }

    .google-btn__logo {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .google-btn__text {
      font-size: 15px;
      font-weight: 600;
      color: #f1f1f3;
    }

    /* Divider */
    .divider-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 16px 0;
    }
    .divider-line {
      flex: 1;
      height: 1px;
      background: rgba(255, 255, 255, 0.08);
    }
    .divider-text {
      font-size: 12px;
      color: #6b7280;
    }

    .login-card__note {
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      margin: 0;
    }

    .login-footer {
      font-size: 11px;
      color: #4b5563;
      text-align: center;
      margin: 0;
    }
  `],
})
export class LoginComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly features = [
    { icon: 'bedtime', label: 'Sleep Tracking' },
    { icon: 'alarm', label: 'Wakeup Logs' },
    { icon: 'insights', label: 'Analytics' },
  ];

  async signInWithGoogle(): Promise<void> {
    await this.authService.signInWithGoogle();
  }
}
