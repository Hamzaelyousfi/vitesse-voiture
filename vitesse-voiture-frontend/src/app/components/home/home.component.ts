// src/app/components/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculFormComponent } from '../calcul-form/calcul-form.component';
import { VoitureListComponent } from '../voiture-list/voiture-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CalculFormComponent, VoitureListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  showCalculator: boolean = true;
  constructor() { }

  toggleView() {
    this.showCalculator = !this.showCalculator;
  }
}