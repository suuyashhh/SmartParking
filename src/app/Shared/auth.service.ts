import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private user: any = null;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = sessionStorage.getItem('provider_user');
      if (stored) {
        this.user = JSON.parse(stored);
      }
    }
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }

  setCurrentUser(user: any): void {
    this.user = user;
    sessionStorage.setItem('provider_user', JSON.stringify(user));
  }

  getCurrentUser(): any {
    return this.user;
  }

  logout(): void {
    this.user = null;
    sessionStorage.removeItem('provider_user');
  }
}
