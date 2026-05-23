import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  template: `
    <div class="relative">
      <!-- Profile Button -->
      <button 
        (click)="toggleMenu()"
        class="profile-frame group transition-all"
        [class.ring-2]="isOpen()"
        [class.ring-indigo-500/50]="isOpen()"
      >
        @if (authService.currentUser()?.photoURL) {
          <img 
            [src]="authService.currentUser()?.photoURL" 
            [alt]="authService.currentUser()?.displayName"
            class="w-full h-full rounded-2xl object-cover"
          />
        } @else {
          <span class="material-symbols-rounded text-indigo-400">person</span>
        }
      </button>

      <!-- Dropdown Menu -->
      @if (isOpen() && authService.currentUser(); as user) {
        <div class="absolute right-0 mt-3 w-64 glass-premium rounded-[24px] p-2 shadow-2xl z-50 animate-fade-in border border-white/5">
          <div class="p-4 border-b border-white/5 space-y-1">
            <p class="text-sm font-bold truncate text-white">
              {{ user.displayName }}
            </p>
            <p class="text-[10px] font-bold text-slate-500 truncate uppercase tracking-widest">
              {{ user.email }}
            </p>
          </div>
          
          <div class="p-2 space-y-1">
            <button 
              (click)="authService.signOut()"
              class="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 text-slate-300 transition-all group"
            >
              <div class="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                <span class="material-symbols-rounded text-red-400 text-lg">logout</span>
              </div>
              <span class="text-sm font-bold">Sign Out</span>
            </button>
          </div>
        </div>

        <!-- Backdrop for closing -->
        <div 
          class="fixed inset-0 z-40" 
          (click)="closeMenu()"
        ></div>
      }
    </div>
  `,
  styles: [`
    .profile-frame {
      @apply w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 bg-white/5 overflow-hidden;
    }
  `],
})
export class ProfileMenuComponent {
  readonly authService = inject(AuthService);
  readonly isOpen = signal(false);

  toggleMenu() {
    this.isOpen.update(v => !v);
  }

  closeMenu() {
    this.isOpen.set(false);
  }
}
