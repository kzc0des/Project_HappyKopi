import { Routes } from '@angular/router';
import { Login } from './modules/auth/login/login';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'Login',
        pathMatch: 'full'
    },
    {
        path: 'Login',
        component: Login
    }
];
