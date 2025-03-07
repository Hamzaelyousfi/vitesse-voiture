import { Routes } from '@angular/router';
import { CalculFormComponent } from './components/calcul-form/calcul-form.component';
import { VoitureListComponent } from './components/voiture-list/voiture-list.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
   { path: '', component: HomeComponent },
  { path: '', component: CalculFormComponent },
  { path: 'voitures', component: VoitureListComponent },
  { path: '**', redirectTo: '' }
];
