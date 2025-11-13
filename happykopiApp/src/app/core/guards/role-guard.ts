import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as Array<string>;
  const userRole = authService.getUserRole();

  if (userRole && requiredRoles.some(role => role.toLowerCase() === userRole.toLowerCase())) {
    return true;
  }

  console.error('Unauthorized access attempt!');
  return router.createUrlTree(['orders']);
};
