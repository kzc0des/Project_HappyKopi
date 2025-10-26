import { Routes } from '@angular/router';
import { AdminDashboard } from './modules/admin-dashboard/admin-dashboard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'admin/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'admin/dashboard',
        component: AdminDashboard
    }
];
