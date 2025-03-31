import { Component, computed, inject, Input, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import {MatChipsModule} from '@angular/material/chips';
import { CarService } from '../../core/services/car.service';
import { Car } from '../../core/models/car.model';
import { CommonModule } from '@angular/common';
import { CarStateService } from '../../core/state/car-state.service';

@Component({
  selector: 'app-car-details',
  imports: [MatCardModule, MatIconModule, MatChipsModule, CommonModule],
  templateUrl: './car-details.component.html',
  styleUrl: './car-details.component.scss',
  standalone: true
})
export class CarDetailsComponent {
  private route = inject(ActivatedRoute);
  private carState = inject(CarStateService);
  private router = inject(Router);

  readonly carId = this.route.snapshot.paramMap.get('id') ?? '';

  readonly car = computed(() => this.carState.getCarById(this.carId));

  constructor() {
    if (!this.car()) {
      console.warn('Car not found, redirecting...');
      this.router.navigate(['/cars']);
    }
  }

  goBack() {
    this.router.navigate(['']);
  }

  goToCarBooking(): void {
    this.router.navigate(['/booking', this.carId]);
  }
}
