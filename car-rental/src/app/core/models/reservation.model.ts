// TODO: confirm name convention and floating-point

export interface Reservation {
    id: string;
    car_id: string;
    customer_name: string;
    pickup_time: string;
    dropoff_time: string;
    total_price: number;
    status: ReservationStatus;
}

export interface ReservationRequest {
    car_id: string;
    customer_name: string;
    pickup_time: string;
    dropoff_time: string;
}

export interface CreateReservationResponse {
    reservation_id: string;
    success: boolean;
}

export enum ReservationStatus {
    CONFIRMED = 'Confirmed',
    CANCELLED = 'Cancelled',
    COMPLETED = 'Completed',
}  
  