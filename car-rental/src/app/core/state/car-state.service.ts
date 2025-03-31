import { Injectable, signal, computed } from '@angular/core';
import { Car, CarStatus } from '../models/car.model';
import { CarService } from '../services/car.service';

@Injectable({ providedIn: 'root' })
export class CarStateService {
    private readonly _cars = signal<Car[]>([]);
    private readonly _selectedCar = signal<Car | null>(null);

    readonly cars = this._cars.asReadonly();
    readonly selectedCar = this._selectedCar.asReadonly();

    readonly carsLoaded = computed(() => this._cars().length > 0);

    readonly availableCars = computed(() => this._cars().filter(c => c.status === CarStatus.AVAILABLE));
    readonly unAvailableCars = computed(() => this._cars().filter(c => c.status === CarStatus.UNAVAILABLE));

    readonly filterText = signal('');
    readonly showAvailableOnly = signal(false);
    readonly sortOrder = signal<'asc' | 'desc'>('asc');

    readonly filteredCars = computed(() => {
        const filter = this.filterText().toLowerCase();
        const onlyAvailable = this.showAvailableOnly();
        const order = this.sortOrder();

        return this.cars()
            .filter(car => {
                const matchesModel = car.model.toLowerCase().includes(filter) ||
                    car.manufacturer.toLowerCase().includes(filter);
                const matchesAvailability = !onlyAvailable || car.status === CarStatus.AVAILABLE;
                return matchesModel && matchesAvailability;
            })
            .sort((a, b) => {
                return order === 'asc'
                    ? a.rate_per_day - b.rate_per_day
                    : b.rate_per_day - a.rate_per_day;
            });
    });

    constructor(private carService: CarService) { }

    loadCars(): void {
        this.carService.getCars().subscribe({
            next: (cars) => this._cars.set(cars),
            error: (err) => {
                console.error('Failed to load cars:', err);
                this._cars.set([]);
            }
        });
    }

    setSelectedCarById(id: string): void {
        const car = this._cars().find(c => c.id === id) ?? null;
        this._selectedCar.set(car);
    }

    getCarById(id: string): Car | undefined {
        return this._cars().find(c => c.id === id);
    }

    clearSelected(): void {
        this._selectedCar.set(null);
    }

    getCarRateById = (carId: string) => computed(() => {
        const car = this._cars().find(c => c.id === carId);
        return car?.rate_per_day ?? 0;
    });

    setFilterText(text: string) {
        this.filterText.set(text);
    }

    toggleAvailableOnly() {
        this.showAvailableOnly.update(value => !value);
    }

    setSortOrder(order: 'asc' | 'desc') {
        this.sortOrder.set(order);
    }

}
