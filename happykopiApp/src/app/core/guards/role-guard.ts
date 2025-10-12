import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { map, take } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as Array<string>;
  return authService.getCurrentUser$().pipe(
    take(1), 
    map(user => {      
      if (user && requiredRoles.includes(user.role)) {
        return true;
      } else {
        console.error('Unauthorized access: Required roles', requiredRoles, ', User role:', user?.role);
        return router.createUrlTree(['/login']);
      }
    })
  );
};
