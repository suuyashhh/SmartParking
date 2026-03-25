import { Routes } from "@angular/router";
import { expand } from "rxjs";

export const PARKING_ROUTES : Routes = [
    {
        path:'',
        redirectTo:'dashboard',
        pathMatch:'full'
    },
    {
        path:'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path:'parking-provider',
        loadComponent: () => import('./parking-provider/parking-provider.component').then(m => m.ParkingProviderComponent)
    }
];