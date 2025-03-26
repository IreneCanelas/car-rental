import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Car } from '../models/car.model';
import { catchError, Observable, retry, shareReplay, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CarService {

    private readonly baseUrl = '/api';

    constructor(private http: HttpClient) {}

    getCars(): Observable<Car[]> {
        return this.http.get<Car[]>(`${this.baseUrl}/cars`)
        .pipe(
            retry(3),
            catchError(error => {
                const msg = error.error instanceof ErrorEvent
                ? `Network error: ${error.error.message}`
                : `Server returned ${error.status}: ${error.message}`;
                console.error('Car service error after retries:', error);
                return throwError(() => new Error('Sorry, your request wasn’t completed. Please try again later.'));
            }),
            shareReplay({ bufferSize: 1, refCount: true })
        )
    }

}