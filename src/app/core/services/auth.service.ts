import { Injectable, signal, computed, inject } from '@angular/core';
import { 
  Auth, 
  authState, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User as FirebaseUser 
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { filter, map, switchMap, tap } from 'rxjs';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);
  private readonly router = inject(Router);

  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Core Auth State Signal
  private readonly _firebaseUser = toSignal(authState(this.auth));
  
  // Computed User Signal
  readonly currentUser = computed(() => {
    const fbUser = this._firebaseUser();
    if (!fbUser) return null;
    
    return {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: fbUser.displayName,
      photoURL: fbUser.photoURL,
    } as User;
  });

  readonly isAuthenticated = computed(() => !!this._firebaseUser());
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor() {
    // Automatically sync user to Firestore when they log in
    authState(this.auth).pipe(
      filter(user => !!user),
      switchMap(user => this.updateUserData(user!))
    ).subscribe();
  }

  async signInWithGoogle(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    const provider = new GoogleAuthProvider();
    
    try {
      await signInWithPopup(this.auth, provider);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Login error:', error);
      this._error.set(error.message || 'Failed to sign in with Google');
    } finally {
      this._loading.set(false);
    }
  }

  async signOut(): Promise<void> {
    this._loading.set(true);
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Logout error:', error);
      this._error.set('Failed to sign out');
    } finally {
      this._loading.set(false);
    }
  }

  private updateUserData(user: FirebaseUser) {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: serverTimestamp(),
    };
    return from(setDoc(userRef, data, { merge: true }));
  }

  clearError() {
    this._error.set(null);
  }
}
