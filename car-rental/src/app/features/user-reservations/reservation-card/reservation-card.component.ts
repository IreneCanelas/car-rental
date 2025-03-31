import { Component, inject, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Reservation } from '../../../core/models/reservation.model';
import { CarService } from '../../../core/services/car.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ReservationService } from '../../../core/services/reservation.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reservation-card',
  imports: [MatCardModule, CommonModule],
  templateUrl: './reservation-card.component.html',
  styleUrl: './reservation-card.component.scss',
  standalone: true
})
export class ReservationCardComponent implements OnInit {
  @Input({ required: true }) reservation!: Reservation;
  carService = inject(CarService);
  readonly dialog = inject(MatDialog);
  reservationService = inject(ReservationService);
  readonly snackBar = inject(MatSnackBar);

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  getCarModel(carId: string) {
    let carModel;
    this.carService.getCarById(carId).subscribe(
      car => carModel = car !== undefined ? car?.model : ''
    );
    return carModel;
  }

  onEdit() {
    this.reservationService.setReservationToEdit(this.reservation);
    this.router.navigate(['/booking']);
  }

  isCancelButtonHidden(): boolean {
    const { pickup_time, status } = this.reservation;
    const pickupDate = new Date(pickup_time);
    const today = new Date();
  
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const normalizedPickup = new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate());
  
    const dayBeforePickup = new Date(normalizedPickup);
    dayBeforePickup.setDate(dayBeforePickup.getDate() - 1);
  
    const isDayBeforePickup = normalizedToday.getTime() === dayBeforePickup.getTime();
    const isNotCancelable = status === 'Cancelled' || status === 'Completed';
  
    return isDayBeforePickup || isNotCancelable;
  }
  

  onCancel(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Reservation Cancellation',
        message: `Are you sure you want to cancel this reservation?`
      }
    });
  
    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
  
      this.reservationService.deleteReservation(this.reservation.id).subscribe({
        next: () => {
          this.snackBar.open('Reservation cancelled successfully.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
        },
        error: (err) => {
          console.error('Failed to cancel reservation:', err);
          this.snackBar.open('Failed to cancel reservation. Please try again.', 'Close', {
            duration: 4000,
            panelClass: ['snackbar-error']
          });
        }
      });
    });
  }
  

}
