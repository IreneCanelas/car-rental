import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CarCardComponent } from './car-card/car-card.component';
import { CarService } from '../../core/services/car.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Car } from '../../core/models/car.model';
import { NgForOf, NgIf } from '@angular/common';
import { MatProgressSpinner, MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-car-listing',
  standalone: true,
  imports: [MatCardModule, CarCardComponent, NgForOf, NgIf, MatProgressSpinner],
  templateUrl: './car-listing.component.html',
  styleUrl: './car-listing.component.scss'
})
export class CarListingComponent implements OnInit {

  cars = signal<Car[]>([]);

  constructor(private carService: CarService) {}

  ngOnInit() {
    this.carService.getCars().subscribe(this.cars.set);
  }

}
