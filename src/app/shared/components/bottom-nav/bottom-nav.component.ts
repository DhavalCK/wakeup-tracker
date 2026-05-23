import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="nav-wrapper">
      <nav class="nav-container glass-premium">
        <div class="nav-items">
          @for (item of navItems; track item.route) {
            <a
              [routerLink]="item.route"
              routerLinkActive="active"
              class="nav-item-link"
              [attr.aria-label]="item.label"
            >
              <div class="icon-box">
                <span class="material-symbols-rounded">{{ item.icon }}</span>
              </div>
              <span class="nav-label">{{ item.label }}</span>
              <div class="active-dot"></div>
            </a>
          }
        </div>
      </nav>
    </div>
  `,
  styles: [`
    .nav-wrapper {
      @apply fixed bottom-6 left-0 right-0 z-50 flex justify-center px-6;
      padding-bottom: env(safe-area-inset-bottom, 0px);
    }

    .nav-container {
      @apply w-full max-w-sm rounded-[32px] px-2 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)];
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .nav-items {
      @apply flex items-center justify-around h-14;
    }

    .nav-item-link {
      @apply relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 gap-1;
      color: #94a3b8;
      text-decoration: none;
      -webkit-tap-highlight-color: transparent;
      
      &:hover .icon-box { @apply scale-110; color: #cbd5e1; }
    }

    .icon-box {
      @apply flex items-center justify-center transition-all duration-300;
      span {
        font-size: 26px;
        font-variation-settings: 'FILL' 0, 'wght' 300;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
    }

    .nav-label {
      @apply text-[10px] font-bold uppercase tracking-widest opacity-60 transition-opacity duration-300;
    }

    .active-dot {
      @apply absolute -bottom-1 w-1 h-1 rounded-full bg-indigo-500 opacity-0 transition-all duration-300 scale-0;
    }

    /* Active State */
    .nav-item-link.active {
      @apply text-white;
      
      .icon-box span {
        @apply text-indigo-400;
        font-variation-settings: 'FILL' 1, 'wght' 400;
        transform: translateY(-2px);
        filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.5));
      }

      .nav-label { @apply opacity-100; }
      .active-dot { @apply opacity-100 scale-100 -translate-y-1; }
    }
  `],
})
export class BottomNavComponent {
  readonly navItems: NavItem[] = [
    { label: 'Feed', route: '/dashboard', icon: 'auto_awesome' },
    { label: 'Journal', route: '/history', icon: 'data_saver_on' },
    { label: 'Self', route: '/profile', icon: 'person_outline' },
  ];
}
