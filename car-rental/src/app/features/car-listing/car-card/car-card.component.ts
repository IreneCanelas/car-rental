import { Component, Input, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';
import { Car } from '../../../core/models/car.model';

@Component({
  selector: 'app-car-card',
  imports: [MatCardModule],
  templateUrl: './car-card.component.html',
  styleUrl: './car-card.component.scss',
  standalone: true
})
export class CarCardComponent {

  @Input() car!: Car;

  constructor(private router: Router) {}
  
  goToCarDetails() {
    this.router.navigate(['/car', this.car.id]);
  }

  goToCarBooking() {
    this.router.navigate(['/booking']);
  }

}