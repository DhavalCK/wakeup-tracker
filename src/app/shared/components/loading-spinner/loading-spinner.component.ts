import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="spinner-wrapper" role="status" aria-label="Loading">
      <div class="spinner">
        <div class="spinner__ring"></div>
        <div class="spinner__ring spinner__ring--inner"></div>
        <div class="spinner__dot"></div>
      </div>
    </div>
  `,
  styles: [`
    .spinner-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    }

    .spinner {
      position: relative;
      width: 48px;
      height: 48px;
    }

    .spinner__ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2px solid transparent;
      border-top-color: #6c63ff;
      animation: spin 1.2s linear infinite;
    }

    .spinner__ring--inner {
      inset: 8px;
      border-top-color: rgba(108, 99, 255, 0.4);
      animation-duration: 0.8s;
      animation-direction: reverse;
    }

    .spinner__dot {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #6c63ff;
      box-shadow: 0 0 8px rgba(108, 99, 255, 0.8);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class LoadingSpinnerComponent {}
