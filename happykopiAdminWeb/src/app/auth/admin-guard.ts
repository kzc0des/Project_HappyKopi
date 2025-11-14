import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from './login/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getCurrentUser$().pipe(
    map(user => {
      if (user && user.role.toLowerCase() === 'admin') {
        return true;
      }
      router.navigate(['/login']);
      return false;
    })
  );
};
