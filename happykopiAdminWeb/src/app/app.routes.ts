import { Routes } from '@angular/router';
import { AdminLineChart } from './admin-components/admin-line-chart/admin-line-chart';
import { DashboardCard } from './admin-components/dashboard-card/dashboard-card';
import { DashboardGcashPayment } from './admin-components/dashboard-gcash-payment/dashboard-gcash-payment';
import { DashboardCashPayment } from './admin-components/dashboard-cash-payment/dashboard-cash-payment';
import { TransHistory } from './admin-components/trans-history/trans-history';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'admin-dashboard',
        pathMatch: 'full'
    },
    {
        path: 'admin-dashboard',
        component:AdminDashboard
    },
    { 
        path: 'admin-line-chart', 
        component: AdminLineChart
    },
    { 
        path: 'dashboard-card', 
        component: DashboardCard
    },
    { 
        path: 'dashboard-gcash-payment', 
        component: DashboardGcashPayment
    },
    {
        path: 'dashboard-cash-payment',
        component: DashboardCashPayment
    },
    {
        path: 'admin-dashboard-transaction',
        component: AdminDashboard
    },
    {
        path: 'transaction',
        component: TransHistory
    },
];
