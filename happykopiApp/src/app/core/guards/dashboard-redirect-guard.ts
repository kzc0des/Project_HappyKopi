import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const dashboardRedirectGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getCurrentUser$().pipe(
    take(1),
    map(user => {
      if (user) {
        const userRole = user.role;
        if (userRole === 'Admin') {
          return router.createUrlTree(['app/dashboard/admin']);
        } else if (userRole === 'Barista') {
          return router.createUrlTree(['app/dashboard/barista']);
        }
      }

      return router.createUrlTree(['/login'])
    })
  )
};
