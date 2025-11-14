import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from './login/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$().pipe(
    map(isLoggedIn => {
      if (isLoggedIn) {
        // If logged in, redirect to the admin dashboard
        router.navigate(['/admin/dashboard']);
        return false;
      }
      return true;
    })
  );
};