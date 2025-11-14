import { Routes } from '@angular/router';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { Login } from './auth/login/login';
import { adminGuard } from './auth/admin-guard';
import { TransHistory } from './admin-components/trans-history/trans-history';
import { loginGuard } from './auth/login.guard';

export const routes: Routes = [
  // Default redirect to login page
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  // Login route, protected by loginGuard so logged-in users can't access it
  {
    path: 'login',
    component: Login,
    canActivate: [loginGuard],
  },
  // Admin parent route, protected by adminGuard
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard', // Redirect /admin to /admin/dashboard
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: AdminDashboard,
      },
      {
        path: 'transactions',
        component: TransHistory,
      },
      // Add other admin-specific routes here as children
      // e.g., { path: 'users', component: UsersComponent }
    ],
  },
  // Wildcard route for any other path, redirects to login
  {
    path: '**',
    redirectTo: 'login',
  },
];
