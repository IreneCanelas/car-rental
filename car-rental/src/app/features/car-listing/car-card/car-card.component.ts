import { Component, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-card',
  imports: [MatCardModule],
  templateUrl: './car-card.component.html',
  styleUrl: './car-card.component.scss',
  standalone: true
})
export class CarCardComponent {

  constructor(private router: Router) {}
  
  // TODO: ROTA DINAMICA, tornar isto em apenas uma função de rotas
  goToCarDetails() {
    // this.router.navigate(['/book', carId]);

    this.router.navigate(['/car']);
  }

  // com params do id do carro
  goToCarBooking() {
    this.router.navigate(['/booking']);
  }

}