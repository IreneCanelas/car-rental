import { Component, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';
import {MatChipsModule} from '@angular/material/chips';

@Component({
  selector: 'app-car-details',
  imports: [MatCardModule, MatIconModule, MatChipsModule],
  templateUrl: './car-details.component.html',
  styleUrl: './car-details.component.scss',
  standalone: true
})
export class CarDetailsComponent {

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['']);
  }

}
