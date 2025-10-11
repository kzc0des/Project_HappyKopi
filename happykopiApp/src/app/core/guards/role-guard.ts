import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as Array<string>;
  const user = authService.getCurrentUser$().subscribe({
    next: (response) => response,
    error: (err) => console.error(err)
  });
  const userRole = user.role;
  return true;
};
