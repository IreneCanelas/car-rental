export interface Car {
    id: string;
    manufacturer: string;
    model: string;
    license_plate: string;
    year: number;
    rate_per_day: number;
    status: CarStatus;
}

export enum CarStatus {
    AVAILABLE = 'Available',
    UNAVAILABLE = 'Unvailable'
}  
  