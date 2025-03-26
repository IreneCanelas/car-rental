import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, shareReplay, throwError } from 'rxjs';
import { CreateReservationResponse, Reservation, ReservationRequest } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})

export class ReservationService {
    private readonly baseUrl = '/api';

    constructor(private readonly http: HttpClient) {}
  
    getReservations(userId: string): Observable<Reservation[]> {
      return this.http.get<Reservation[]>(`${this.baseUrl}/reservations?userId=${userId}`).pipe(
        retry(3),
        catchError(this.handleError),
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }
  
    createReservation(payload: ReservationRequest): Observable<CreateReservationResponse> {
      return this.http.post<CreateReservationResponse>(`${this.baseUrl}/reservations`, payload).pipe(
        retry(3),
        catchError(this.handleError)
      );
    }
  
    updateReservation(reservationId: string, payload: ReservationRequest): Observable<Reservation> {
      return this.http.put<Reservation>(`${this.baseUrl}/reservations/${reservationId}`, payload).pipe(
        retry(3),
        catchError(this.handleError)
      );
    }
  
    deleteReservation(reservationId: string): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/reservations/${reservationId}`).pipe(
        retry(3),
        catchError(this.handleError)
      );
    }
  
    private handleError(error: HttpErrorResponse) {
      const msg = error.error instanceof ErrorEvent
        ? `Network error: ${error.error.message}`
        : `Server returned ${error.status}: ${error.message}`;
      console.error('Reservation service error after retries:', msg);
      return throwError(() => new Error('Sorry, your request couldn’t be completed. Please try again later.'));
    }
}