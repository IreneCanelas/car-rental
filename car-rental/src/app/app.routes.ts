// TODO: what variables should i use 
// empty vs ** for default
// and @defer lazy loading
// params id

import { Routes } from '@angular/router';
import { CarListingComponent } from './features/car-listing/car-listing.component';
import { CarDetailsComponent } from './features/car-details/car-details.component';
import { CarBookingComponent } from './features/car-booking/car-booking.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'cars',
        pathMatch: 'full'
    },
    {
        path: 'cars',
        component: CarListingComponent
    },
    {
        path: 'car',
        component: CarDetailsComponent
    },
    {
        path: 'booking',
        component: CarBookingComponent
    }
];
