import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VoitureService } from '../../services/voiture.service';
import { CalculService } from '../../services/calcul.service';
import { Voiture } from '../../models/voiture';
import { CalculResponse } from '../../models/calcul-response';

@Component({
  selector: 'app-calcul-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './calcul-form.component.html',
  styleUrls: ['./calcul-form.component.scss']
})
export class CalculFormComponent implements OnInit {
  calculForm!: FormGroup;
  voitures: Voiture[] = [];
  resultat: CalculResponse | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private voitureService: VoitureService,
    private calculService: CalculService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadVoitures();
  }

  initForm(): void {
    this.calculForm = this.fb.group({
      distance: ['', [Validators.required, Validators.min(0.1)]],
      model: ['', Validators.required]
    });
  }

  loadVoitures(): void {
    this.loading = true;
    this.voitureService.getAllVoitures().subscribe({
      next: (voitures) => {
        this.voitures = voitures;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des voitures', err);
        this.error = 'Impossible de charger la liste des voitures.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.calculForm.valid) {
      this.loading = true;
      this.resultat = null;
      this.error = null;

      const calculRequest = {
        distance: this.calculForm.value.distance,
        model: this.calculForm.value.model
      };

      this.calculService.calculTemps(calculRequest).subscribe({
        next: (response) => {
          this.resultat = response;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur lors du calcul', err);
          if (err.status === 400 && err.error?.errors) {
            this.error = Object.values(err.error.errors).join(', ');
          } else if (err.status === 404) {
            this.error = 'Modèle de voiture introuvable.';
          } else {
            this.error = 'Une erreur est survenue lors du calcul.';
          }
          this.loading = false;
        }
      });
    }
  }
}