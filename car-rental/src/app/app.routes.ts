import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'cars',
    pathMatch: 'full'
  },
  {
    path: 'cars',
    title: 'All Cars',
    loadComponent: () => import('./features/car-listing/car-listing.component').then(m => m.CarListingComponent)
  },
  {
    path: 'car/:id',
    title: 'Car Details',
    loadComponent: () => import('./features/car-details/car-details.component').then(m => m.CarDetailsComponent)
  },
  {
    path: 'booking',
    title: 'Book a Car',
    loadComponent: () => import('./features/car-booking/car-booking.component').then(m => m.CarBookingComponent)
  },
  {
    path: 'reservations',
    title: 'User Reservations',
    loadComponent: () => import('./features/user-reservations/user-reservations.component').then(m => m.UserReservationsComponent)
  },
  {
    path: 'booking/:id',
    loadComponent: () => import('./features/car-booking/car-booking.component').then(m => m.CarBookingComponent),
  }
  /*,
  {
    path: '**',
    title: 'Page Not Found',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }*/
];

