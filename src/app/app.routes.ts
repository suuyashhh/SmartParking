import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'Parking',
    pathMatch: 'full'
  },
  {
    path: 'provider-login',
    loadComponent: () =>
      import('./pages/provider-login/provider-login.component').then(
        (m) => m.ProviderLoginComponent
      )
  },
  {
    path: 'Parking',
    loadComponent: () =>
      import('./components/landing/landing.component').then(
        (m) => m.LandingComponent
      ),
    loadChildren: () =>
      import('./components/parking.routes').then((m) => m.PARKING_ROUTES)
  },
];
