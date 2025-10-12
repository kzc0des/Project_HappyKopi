import { Routes } from '@angular/router';
import { Login } from './modules/auth/login/login';
import { authGuard } from './core/guards/auth-guard';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AdminDashboard } from './modules/dashboard/admin-dashboard/admin-dashboard';
import { roleGuard } from './core/guards/role-guard';
import { BaristaDashboard } from './modules/dashboard/barista-dashboard/barista-dashboard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'dashboard',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            {
                path: 'admin',
                component: AdminDashboard,
                canActivate: [roleGuard],
                data: { roles: ['Admin']}
            },
            {
                path: 'barista',
                component: BaristaDashboard,
                canActivate: [roleGuard],
                data: { roles: ['Barista']}
            }
        ]
    }
];
