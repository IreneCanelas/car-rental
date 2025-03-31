import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReservationCardComponent } from './reservation-card/reservation-card.component';
import { ReservationService } from '../../core/services/reservation.service';
import { Reservation } from '../../core/models/reservation.model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-reservations',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
    MatLabel,
    MatFormField,
    MatInputModule,
    ReservationCardComponent,
    MatCardModule,
    MatProgressSpinner,
    NgFor,
    NgIf],
  templateUrl: './user-reservations.component.html',
  styleUrl: './user-reservations.component.scss',
  standalone: true
})
export class UserReservationsComponent implements OnInit {
  private storedName: string;

  form: FormGroup;
  reservations!: Signal<Reservation[]>;

  reservationService = inject(ReservationService);

  constructor(
    private fb: FormBuilder) {

    this.storedName = localStorage.getItem('user_name') || '';

    this.form = this.fb.group({
      user_name: [this.storedName,
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(25)
      ]]
    })
  }

  ngOnInit() {
    this.reservationService.getReservationsFromLocalStorage();
    this.reservations = this.reservationService.getReservationsByUserName(this.storedName);
  }

  get userName() {
    return this.form.get('user_name');
  }

  isSaveButtonDisabled() {
    return (this.userName?.value === this.storedName) || this.form.invalid;
  }

  saveUserName() {
    const userName = this.userName?.value;
    localStorage.setItem('user_name', userName);
    this.storedName = userName;
    this.reservations = this.reservationService.getReservationsByUserName(userName);
  }
}
