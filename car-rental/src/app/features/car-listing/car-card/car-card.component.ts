import { Component, Input, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';
import { Car } from '../../../core/models/car.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-car-card',
  imports: [MatCardModule, CommonModule],
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

  goToCarBooking(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/booking', this.car.id]);
  }

}