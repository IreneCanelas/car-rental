import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Car, CarStatus } from '../models/car.model';
import { Reservation, ReservationStatus } from '../models/reservation.model';

export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        const cars: Car[] = [
            { id: '1',  manufacturer: 'Toyota',    model: 'Camry',     license_plate: 'ABC123', year: 2021, rate_per_day: 50, status: CarStatus.AVAILABLE },
            { id: '2',  manufacturer: 'Honda',     model: 'Accord',    license_plate: 'XYZ789', year: 2020, rate_per_day: 45, status: CarStatus.UNAVAILABLE },
            { id: '3',  manufacturer: 'Ford',      model: 'Mustang',   license_plate: 'FOR123', year: 2019, rate_per_day: 65, status: CarStatus.AVAILABLE },
            { id: '4',  manufacturer: 'Chevrolet', model: 'Malibu',    license_plate: 'CHE456', year: 2018, rate_per_day: 40, status: CarStatus.AVAILABLE },
            { id: '5',  manufacturer: 'BMW',       model: '3 Series',  license_plate: 'BMW789', year: 2022, rate_per_day: 75, status: CarStatus.UNAVAILABLE },
            { id: '6',  manufacturer: 'Audi',      model: 'A4',        license_plate: 'AUD321', year: 2023, rate_per_day: 80, status: CarStatus.AVAILABLE },
            { id: '7',  manufacturer: 'Tesla',     model: 'Model 3',   license_plate: 'TES123', year: 2023, rate_per_day: 100, status: CarStatus.AVAILABLE },
            { id: '8',  manufacturer: 'Nissan',    model: 'Altima',    license_plate: 'NIS456', year: 2022, rate_per_day: 38, status: CarStatus.UNAVAILABLE },
            { id: '9',  manufacturer: 'Hyundai',   model: 'Elantra',   license_plate: 'HYU789', year: 2021, rate_per_day: 33, status: CarStatus.AVAILABLE },
            { id: '10', manufacturer: 'Kia',       model: 'Sorento',   license_plate: 'KIA012', year: 2020, rate_per_day: 37, status: CarStatus.AVAILABLE }
          ];
    
        const reservations: Reservation[] = [
            { id: '1', car_id: '1', customer_name: 'John Doe', pickup_time: '2025-03-26T10:00:00Z', dropoff_time: '2025-03-30T10:00:00Z', total_price: 200, status: ReservationStatus.CONFIRMED }
        ];
    
        return { cars, reservations };
    }

    post(reqInfo: RequestInfo) {
        const collection = (reqInfo as any).collectionName;
        const utils = (reqInfo as any).utils;
      
        if (collection === 'reservations') {
          return utils.createResponse$(() => ({
            status: 200,
            body: {
              success: true,
              reservation_id: '123'
            }
          }));
        }
      
        return undefined;
      }
      
      
}