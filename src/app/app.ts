import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';
import { BottomNavComponent } from './shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BottomNavComponent],
  template: `
    <div class="app-shell">
      <main class="app-main" [class.has-bottom-nav]="showBottomNav()">
        <router-outlet />
      </main>
      @if (showBottomNav()) {
        <app-bottom-nav />
      }
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      flex-direction: column;
      min-height: 100svh;
      background: #0d0d0f;
    }

    .app-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .app-main.has-bottom-nav {
      padding-bottom: calc(68px + env(safe-area-inset-bottom, 0px));
    }
  `],
})
export class App {
  private readonly router = inject(Router);

  // Routes on which the bottom nav should be hidden
  private readonly AUTH_ROUTES = new Set(['/login']);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly showBottomNav = computed(() => {
    const url = this.currentUrl();
    const basePath = '/' + (url.split('/')[1] ?? '');
    return !this.AUTH_ROUTES.has(basePath);
  });
}
