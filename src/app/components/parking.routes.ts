import { Routes } from "@angular/router";
import { authGuard } from '../Shared/auth.guard';

export const PARKING_ROUTES : Routes = [
    {
        path:'',
        redirectTo:'dashboard',
        pathMatch:'full'
    },
    {
        path:'dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path:'parking-provider',
        canActivate: [authGuard],
        loadComponent: () => import('./parking-provider/parking-provider.component').then(m => m.ParkingProviderComponent)
    },
    {
        path:'providerlogin',
        redirectTo: '/provider-login',
        pathMatch: 'full'
    }
];

