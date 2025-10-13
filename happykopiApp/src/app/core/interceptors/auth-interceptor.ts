import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('jwt_token');

  if (!token) {
    return next(req);
  }

  const clonedRequest = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401) {
        localStorage.removeItem('jwt_token');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
