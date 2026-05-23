import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  activeIcon: string;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bottom-nav">
      <div class="bottom-nav__inner">
        @for (item of navItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="active"
            class="nav-item"
            [attr.aria-label]="item.label"
          >
            <div class="nav-item__icon-wrap">
              <span class="material-symbols-rounded nav-item__icon">{{ item.icon }}</span>
              <div class="nav-item__glow"></div>
            </div>
            <span class="nav-item__label">{{ item.label }}</span>
          </a>
        }
      </div>
    </nav>
  `,
  styles: [`
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: rgba(20, 20, 23, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid rgba(255, 255, 255, 0.07);
      box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.5);
      padding-bottom: env(safe-area-inset-bottom, 0px);
    }

    .bottom-nav__inner {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 68px;
      max-width: 480px;
      margin: 0 auto;
      padding: 0 8px;
    }

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      flex: 1;
      height: 100%;
      padding: 8px 4px;
      text-decoration: none;
      color: #6b7280;
      transition: color 0.2s ease;
      position: relative;
      -webkit-tap-highlight-color: transparent;
    }

    .nav-item__icon-wrap {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 32px;
      border-radius: 10px;
      transition: background 0.2s ease;
    }

    .nav-item__icon {
      font-size: 22px;
      font-variation-settings: 'FILL' 0, 'wght' 400;
      transition: all 0.2s ease;
    }

    .nav-item__glow {
      position: absolute;
      inset: 0;
      border-radius: 10px;
      background: rgba(108, 99, 255, 0.2);
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .nav-item__label {
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.02em;
      transition: color 0.2s ease;
    }

    .nav-item.active {
      color: #6c63ff;
    }

    .nav-item.active .nav-item__icon-wrap {
      background: rgba(108, 99, 255, 0.12);
    }

    .nav-item.active .nav-item__icon {
      font-variation-settings: 'FILL' 1, 'wght' 500;
      filter: drop-shadow(0 0 6px rgba(108, 99, 255, 0.6));
    }

    .nav-item.active .nav-item__glow {
      opacity: 1;
    }

    .nav-item.active .nav-item__label {
      font-weight: 600;
    }

    .nav-item:active .nav-item__icon-wrap {
      transform: scale(0.92);
    }
  `],
})
export class BottomNavComponent {
  readonly navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'space_dashboard',
      activeIcon: 'space_dashboard',
    },
    {
      label: 'History',
      route: '/history',
      icon: 'history',
      activeIcon: 'history',
    },
    {
      label: 'Profile',
      route: '/profile',
      icon: 'person',
      activeIcon: 'person',
    },
  ];
}
