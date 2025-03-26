import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CarCardComponent } from './car-card/car-card.component';

@Component({
  selector: 'app-car-listing',
  standalone: true,
  imports: [MatCardModule, CarCardComponent],
  templateUrl: './car-listing.component.html',
  styleUrl: './car-listing.component.scss'
})
export class CarListingComponent {
}
