import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Route guard — redirects to provider-login if session is missing.
 * Mirrors banking-app pattern: memory-first check, then sessionStorage fallback.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  router.navigate(['/provider-login'], { replaceUrl: true });
  return false;
};
