import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, retry, shareReplay, tap, throwError } from 'rxjs';
import { CreateReservationResponse, Reservation, ReservationRequest, ReservationStatus } from '../models/reservation.model';
import { LocalStorageService } from './local-storage.service';
import { CarService } from './car.service';

@Injectable({
  providedIn: 'root'
})

export class ReservationService {
  private readonly baseUrl = '/api';
  readonly localStorage = inject(LocalStorageService);
  readonly carService = inject(CarService);

  private readonly _reservations = signal<Reservation[]>([]);
  readonly reservations = this._reservations.asReadonly();
  private readonly _reservationToEdit = signal<Reservation | null>(null);
  readonly reservationToEdit = this._reservationToEdit.asReadonly();
  readonly isEditing = computed(() => this._reservationToEdit() !== null);

  constructor(private readonly http: HttpClient) { }

  private saveToStorage(): void {
    localStorage.setItem('reservations', JSON.stringify(this._reservations()));
  }  

  setReservationToEdit(reservation: Reservation): void {
    this._reservationToEdit.set(reservation);
  }
  
  clearReservationToEdit(): void {
    this._reservationToEdit.set(null);
  }

  getReservationsByUserName(userName: string) {
    return computed(() =>
      this.reservations().filter(r => r.customer_name === userName)
    );
  }

  getReservationsFromLocalStorage() {
    try {
      const rawReservations = this.localStorage.getData('reservations');
      const reservations: Reservation[] = rawReservations ? JSON.parse(rawReservations) : [];
      this._reservations.set(reservations);
    } catch (error) {
      console.error('Error reading reservations from storage:', error);
    }
  }

  createReservation(payload: ReservationRequest): Observable<CreateReservationResponse> {
    return this.http.post<CreateReservationResponse>(`${this.baseUrl}/reservations`, payload).pipe(
      retry(3),
      catchError(this.handleError),
      tap(res => {
        if (res.success) {
          this.saveReservationOnLocalStorage(payload);
        }
      })
    );
  }

  updateReservation(reservationId: string, payload: ReservationRequest): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.baseUrl}/reservations/${reservationId}`, payload).pipe(
      retry(3),
      catchError(this.handleError),
      tap(res => {
        if (res) {
          this.updateReservationOnLocalStorage(reservationId, payload);
        }
      })
    );
  }

  deleteReservation(reservationId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/reservations/${reservationId}`).pipe(
      retry(3),
      tap(() => {
        const raw = this.localStorage.getData('reservations');
        const reservations: Reservation[] = raw ? JSON.parse(raw) : [];
  
        const index = reservations.findIndex(r => r.id === reservationId);
        if (index === -1) {
          console.error(`Reservation with ID ${reservationId} not found.`);
          return;
        }
  
        reservations[index].status = ReservationStatus.CANCELLED;
  
        this.localStorage.saveData('reservations', JSON.stringify(reservations));
        this._reservations.set(reservations);
      }),
      catchError(this.handleError)
    );
  }  

  private handleError(error: HttpErrorResponse) {
    let msg = 'An unknown error occurred.';

    if (error.error instanceof ErrorEvent) {
      msg = `Network error: ${error.error.message}`;
    } else {
      const backendMessage = error.error?.message || error.message || error.statusText;
      msg = `Server returned ${error.status}: ${backendMessage}`;
    }

    console.error('Reservation service error after retries:', msg);

    return throwError(() =>
      new Error(error.error?.message || 'Sorry, your request couldn’t be completed. Please try again later.')
    );
  }

  getTotalPriceReservation(pickup_time: string, dropoff_time: string, dailyRate: number) {
    const pickup = new Date(pickup_time);
    const dropoff = new Date(dropoff_time);
    const days = Math.max(1, Math.ceil((dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)));
    const totalPrice = parseFloat((dailyRate * days).toFixed(2));

    return totalPrice;
  }

  scheduleAutoConfirm(reservationId: string): void {
    setTimeout(() => {
      const updated = this._reservations().map(res =>
        res.id === reservationId && res.status === ReservationStatus.PENDING
          ? { ...res, status: ReservationStatus.CONFIRMED }
          : res
      );
  
      this._reservations.set(updated);
      this.saveToStorage();
    }, 60000); 
  }

  saveReservationOnLocalStorage(payload: ReservationRequest): void {
    const raw = this.localStorage.getData('reservations');
    const reservations: Reservation[] = raw ? JSON.parse(raw) : [];
    const reservationID = Math.random().toString(36).substring(2, 10);

    this.carService.getCarById(payload.car_id).pipe(
      map((car) => {
        if (!car) throw new Error(`Car with ID ${payload.car_id} not found`);

        const totalPrice = this.getTotalPriceReservation(
          payload.pickup_time,
          payload.dropoff_time,
          car.rate_per_day
        );

        const fullReservation: Reservation = {
          id: reservationID,
          ...payload,
          total_price: totalPrice,
          status: ReservationStatus.PENDING
        };

        reservations.push(fullReservation);
        this.localStorage.saveData('reservations', JSON.stringify(reservations));
        this._reservations.set(reservations);
        this.scheduleAutoConfirm(reservationID);

        return fullReservation;
      }),
      catchError(this.handleError)
    ).subscribe();
  }

  updateReservationOnLocalStorage(reservationId: string, payload: ReservationRequest): void {
    const raw = this.localStorage.getData('reservations');
    const reservations: Reservation[] = raw ? JSON.parse(raw) : [];

    const index = reservations.findIndex(r => r.id === reservationId);
    if (index === -1) {
      throwError(() => new Error(`Reservation with ID ${reservationId} not found.`));
    }

    this.carService.getCarById(payload.car_id).pipe(
      map((car) => {
        if (!car) throw new Error(`Car with ID ${payload.car_id} not found.`);

        const totalPrice = this.getTotalPriceReservation(
          payload.pickup_time,
          payload.dropoff_time,
          car.rate_per_day
        );

        const updated: Reservation = {
          id: reservationId,
          ...payload,
          total_price: totalPrice,
          status: ReservationStatus.PENDING
        };

        reservations[index] = updated;
        this.localStorage.saveData('reservations', JSON.stringify(reservations));
        this._reservations.set(reservations);

        return updated;
      }),
      catchError(this.handleError)
    ).subscribe();
  }
}