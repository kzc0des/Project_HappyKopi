import { Routes } from '@angular/router';
import { Login } from './modules/auth/login/login';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login
    }
];
