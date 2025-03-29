import { Component, inject, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Reservation } from '../../../core/models/reservation.model';
import { CarService } from '../../../core/services/car.service';
import { Car } from '../../../core/models/car.model';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
  car?: Car;

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
    console.log('Editar reserva:', this.reservation.id);
    // TODO: Navegar para tela de edição ou abrir modal
  }

  onCancel(reservationID: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Reservation Cancelation',
        message: `Are you sure you want to cancel this reservation?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      console.log('Cancelar reserva:', this.reservation.id);
      // TODO: mudar status no serviço
    });
  }

}
