import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CarService } from '../../core/services/car.service';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { CarStatus } from '../../core/models/car.model';
import { MatDatepickerModule, MatDateRangeInput, MatDateRangePicker } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { Reservation, ReservationRequest } from '../../core/models/reservation.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { ReservationService } from '../../core/services/reservation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-car-booking',
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    CommonModule,
    MatLabel,
    MatFormField,
    MatInputModule,
    MatOption,
    MatSelectModule,
    MatDatepickerModule,
    MatDateRangeInput,
    MatDateRangePicker,
    MatNativeDateModule,
    MatTimepickerModule
  ],
  templateUrl: './car-booking.component.html',
  styleUrl: './car-booking.component.scss',
  standalone: true
})
export class CarBookingComponent implements OnInit {
  private storedName = '';
  readonly carService = inject(CarService);
  readonly dialog = inject(MatDialog);
  readonly reservationService = inject(ReservationService);
  readonly snackBar = inject(MatSnackBar);
  private activatedRoute = inject(ActivatedRoute);
  readonly totalPrice = signal<number>(0);

  form: FormGroup;
  cars = toSignal(this.carService.getCars(), { initialValue: [] });
  minDate = new Date();
  carIdFromRoute = '';

  readonly reservationToEdit = this.reservationService.reservationToEdit;
  readonly isEditing = this.reservationService.isEditing;

  availableCars = computed(() =>
    this.cars().filter(car => car.status === CarStatus.AVAILABLE)
  );

  unavailableCars = computed(() =>
    this.cars().filter(car => car.status === CarStatus.UNAVAILABLE)
  );

  get userName() {
    return this.form.get('user_name');
  }

  get carId() {
    return this.form.get('car_id');
  }

  get pickupTime() {
    return this.form.get('pickup_time');
  }

  get dropoffTime() {
    return this.form.get('dropoff_time');
  }

  get pickupDate() {
    return this.form.get('date_range.start');
  }

  get dropoffDate() {
    return this.form.get('date_range.end');
  }

  constructor(
    private fb: FormBuilder,
    private router: Router) {
    this.storedName = localStorage.getItem('user_name') || '';

    this.form = this.fb.group({
      user_name: [this.storedName,
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(25)
      ]],
      car_id: [this.carIdFromRoute, Validators.required],
      date_range: this.fb.group({
        start: [null, Validators.required],
        end: [null, Validators.required]
      }),
      pickup_time: ['', Validators.required],
      dropoff_time: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    const carId = this.activatedRoute.snapshot.paramMap.get('id');
    this.carIdFromRoute = carId ? carId : '';
    if (this.carIdFromRoute) {
      this.form.patchValue({ car_id: this.carIdFromRoute });
    }

    this.minDate.setDate(this.minDate.getDate() + 1);

    const existingRes = this.reservationToEdit();
    if (existingRes) {
      this.populateFormForEdit(existingRes);
    }

    this.form.valueChanges.subscribe(() => {
      this.updateTotalPrice();
    });
    
  }

  populateFormForEdit(reservation: Reservation) {
    this.form.patchValue({
      user_name: reservation.customer_name,
      car_id: reservation.car_id,
      date_range: {
        start: new Date(reservation.pickup_time),
        end: new Date(reservation.dropoff_time),
      },
      pickup_time: new Date(reservation.pickup_time),
      dropoff_time: new Date(reservation.dropoff_time),
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toTimeString().slice(0, 5);
  }

  combineDateAndTime(date: Date, time: string | Date): Date {
    const baseDate = new Date(date);

    if (time instanceof Date) {
      baseDate.setHours(time.getHours(), time.getMinutes(), 0, 0);
    } else if (typeof time === 'string') {
      const [hours, minutes] = time.split(':').map(Number);
      baseDate.setHours(hours, minutes, 0, 0);
    } else {
      throw new Error('Invalid time value');
    }

    return baseDate;
  }

  getPickupAndDropoffDate() {
    const startDate: Date = this.form.value.date_range?.start;
    const endDate: Date = this.form.value.date_range?.end;
    const pickupTime: string = this.form.value.pickup_time;
    const dropoffTime: string = this.form.value.dropoff_time;

    if (!startDate || !endDate || !pickupTime || !dropoffTime) {
      throw new Error('Missing date or time input.');
    }

    const pickup = this.combineDateAndTime(startDate, pickupTime);
    const dropoff = this.combineDateAndTime(endDate, dropoffTime);

    return { pickup, dropoff };
  }

  private updateTotalPrice(): void {
    const carId = this.form.value.car_id;
    const start = this.form.value.date_range?.start;
    const end = this.form.value.date_range?.end;
    const pickupTime = this.form.value.pickup_time;
    const dropoffTime = this.form.value.dropoff_time;
  
    if (!carId || !start || !end || !pickupTime || !dropoffTime) {
      this.totalPrice.set(0);
      return;
    }
  
    this.carService.getCarById(carId).subscribe(car => {
      if (!car) {
        this.totalPrice.set(0);
        return;
      }

      const { pickup, dropoff } = this.getPickupAndDropoffDate();
      
      const total = this.reservationService.getTotalPriceReservation(pickup.toISOString(), dropoff.toISOString(), car?.rate_per_day);
  
      this.totalPrice.set(total);
    });
  }
  
  
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const userName = this.userName?.value;
    if (userName !== this.storedName) {
      localStorage.setItem('user_name', userName);
      this.storedName = userName;
    }

    const { pickup, dropoff } = this.getPickupAndDropoffDate();
    const carId = this.form.value.car_id;

    const reservation: ReservationRequest = {
      car_id: carId,
      customer_name: userName,
      pickup_time: pickup.toISOString(),
      dropoff_time: dropoff.toISOString()
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Reservation',
        message: `Do you want to book this car from:\n\n${pickup.toLocaleString('pt-PT')} to ${dropoff.toLocaleString('pt-PT')}?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      if (this.isEditing()) {
        const reservationId = this.reservationToEdit()?.id!;
        this.reservationService.updateReservation(reservationId, reservation).subscribe({
          next: () => {
            this.snackBar.open('Reservation edited!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            this.form.reset();
            this.reservationService.clearReservationToEdit();
            this.router.navigate(['/reservations'])
          },
          error: (err) => {
            console.error('Reservation error:', err);

            const message =
              err?.error?.message || err?.message || 'Something went wrong.';

            this.snackBar.open(`${message}`, 'Dismiss', {
              duration: 4000,
              panelClass: 'snackbar-error'
            });
          }
        });
      }
      else {
        this.reservationService.createReservation(reservation).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open('Reservation created!', 'Close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              });
              this.form.reset();
              this.router.navigate(['/reservations'])
            } else {
              this.snackBar.open('Failed to create reservation.', 'Dismiss', {
                duration: 4000,
                panelClass: 'snackbar-error'
              });
            }
          },
          error: (err) => {
            console.error('Reservation error:', err);

            const message =
              err?.error?.message || err?.message || 'Something went wrong.';

            this.snackBar.open(`${message}`, 'Dismiss', {
              duration: 4000,
              panelClass: 'snackbar-error'
            });
          }
        });
      }
    })
  }
}
