import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Voiture } from '../../models/voiture';
import { VoitureService } from '../../services/voiture.service';
import { VoitureFormComponent } from '../voiture-form/voiture-form.component';

@Component({
  selector: 'app-voiture-list',
  standalone: true,
  imports: [CommonModule, VoitureFormComponent],
  templateUrl: './voiture-list.component.html',
  styleUrls: ['./voiture-list.component.scss'],
})
export class VoitureListComponent implements OnInit {
  voitures: Voiture[] = [];
  selectedVoiture: Voiture | null = null;
  isEditing = false;
  isAdding = false;

  constructor(private voitureService: VoitureService) { }

  ngOnInit(): void {
    this.loadVoitures();
  }

  loadVoitures(): void {
    this.voitureService.getAllVoitures().subscribe({
      next: (data) => {
        this.voitures = data;
      },
      error: (error) => {
        console.error('Error fetching voitures:', error);
      }
    });
  }

  addVoiture(): void {
    this.isAdding = true;
    this.isEditing = false;
    this.selectedVoiture = {
      model: '',
      kmh: 0,
      caracteristiques: []
    };
  }

  editVoiture(voiture: Voiture): void {
    this.isEditing = true;
    this.isAdding = false;
    this.selectedVoiture = { ...voiture };
  }

  viewDetails(voiture: Voiture): void {
    this.selectedVoiture = { ...voiture };
    this.isEditing = false;
    this.isAdding = false;
  }

  deleteVoiture(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette voiture?')) {
      this.voitureService.deleteVoiture(id).subscribe({
        next: () => {
          this.loadVoitures();
          if (this.selectedVoiture?.id === id) {
            this.selectedVoiture = null;
          }
        },
        error: (error) => {
          console.error('Error deleting voiture:', error);
        }
      });
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.isAdding = false;
    this.selectedVoiture = null;
  }

  saveVoiture(voiture: Voiture): void {
    if (this.isAdding) {
      this.voitureService.createVoiture(voiture).subscribe({
        next: () => {
          this.loadVoitures();
          this.cancelEdit();
        },
        error: (error) => {
          console.error('Error creating voiture:', error);
        }
      });
    } else if (this.isEditing && voiture.id) {
      this.voitureService.updateVoiture(voiture.id, voiture).subscribe({
        next: () => {
          this.loadVoitures();
          this.cancelEdit();
        },
        error: (error) => {
          console.error('Error updating voiture:', error);
        }
      });
    }
  }
}