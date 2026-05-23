import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Signal-based state — will be wired to Firebase Auth in the next phase
  private _currentUser = signal<User | null>(null);
  private _loading = signal<boolean>(false);

  // Public readonly signals
  readonly currentUser = this._currentUser.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  // Placeholder: Google Sign-In
  async signInWithGoogle(): Promise<void> {
    console.log('[AuthService] signInWithGoogle — Firebase not yet wired');
  }

  // Placeholder: Sign Out
  async signOut(): Promise<void> {
    this._currentUser.set(null);
    console.log('[AuthService] signOut — Firebase not yet wired');
  }
}
