import { Component, OnInit, signal, computed } from '@angular/core';
import { CarStateService } from '../../core/state/car-state.service';
import { MatCardModule } from '@angular/material/card';
import { CarCardComponent } from './car-card/car-card.component';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-car-listing',
  standalone: true,
  imports: [
    MatCardModule,
    CarCardComponent,
    NgForOf,
    NgIf,
    MatProgressSpinner,
    ReactiveFormsModule,
    CommonModule,
    MatLabel,
    MatFormField,
    MatInputModule,
    MatSlideToggleModule,
    MatSelect,
    MatOption
  ],
  templateUrl: './car-listing.component.html',
  styleUrl: './car-listing.component.scss'
})
export class CarListingComponent implements OnInit {
  readonly isLoading = computed(() => this.carState.cars().length === 0);

  constructor(public carState: CarStateService) {}

  ngOnInit() {
    this.carState.loadCars();
  }

  onFilterChange(event: Event) {
    this.carState.setFilterText((event.target as HTMLInputElement).value);
  }

  onSortChange(order: 'asc' | 'desc') {
    this.carState.setSortOrder(order);
  }

  onToggleAvailability() {
    this.carState.toggleAvailableOnly();
  }
}