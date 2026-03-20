import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'Parking',
        pathMatch: 'full'
    },
    {
        path: 'Parking',
        loadComponent: () => import('./components/landing/landing.component').then(m => m.LandingComponent),
        loadChildren: () => import('./components/parking.routes').then(m => m.PARKING_ROUTES)
    },
];
