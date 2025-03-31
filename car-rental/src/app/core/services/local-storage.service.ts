import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class LocalStorageService {

    public saveData(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    public getData(key: string) {
        return localStorage.getItem(key)
    }

    public removeData(key: string) {
        localStorage.removeItem(key);
    }

    public clearData() {
        localStorage.clear();
    }

    public getReservations(key: string) {
        const raw = this.getData('reservations');
        return raw ? JSON.parse(raw) : [];
    }

}