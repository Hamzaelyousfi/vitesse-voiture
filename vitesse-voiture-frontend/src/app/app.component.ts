import { Component } from '@angular/core';
import { HomeComponent } from './components/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  styleUrls: ['./app.component.scss'], 
  imports: [HomeComponent],
  template: '<app-home></app-home>'
})
export class AppComponent {
  title = 'Calculateur de Temps de Trajet';
}