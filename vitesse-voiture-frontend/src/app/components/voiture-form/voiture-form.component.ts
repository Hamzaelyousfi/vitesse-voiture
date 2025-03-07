import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Voiture } from '../../models/voiture';

@Component({
  selector: 'app-voiture-form',
  templateUrl: './voiture-form.component.html',
  styleUrls: ['./voiture-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class VoitureFormComponent implements OnChanges {
  @Input() voiture: Voiture | null = null;
  @Input() isEditing = false;
  @Input() isAdding = false;
  @Output() save = new EventEmitter<Voiture>();
  @Output() cancel = new EventEmitter<void>();

  voitureForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.voitureForm = this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['voiture'] && this.voiture) {
      this.resetForm();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      id: [null],
      model: ['', [Validators.required]],
      kmh: [0, [Validators.required, Validators.min(1)]],
      caracteristiques: this.fb.array([])
    });
  }

  resetForm(): void {
    this.caracteristiquesArray.clear();

    if (this.voiture?.caracteristiques) {
      this.voiture.caracteristiques.forEach(carac => {
        this.addCaracteristique(carac);
      });
    }

    this.voitureForm.patchValue({
      id: this.voiture?.id,
      model: this.voiture?.model,
      kmh: this.voiture?.kmh
    });
  }

  get caracteristiquesArray(): FormArray {
    return this.voitureForm.get('caracteristiques') as FormArray;
  }

  addCaracteristique(value: string = ''): void {
    this.caracteristiquesArray.push(this.fb.control(value, Validators.required));
  }

  removeCaracteristique(index: number): void {
    this.caracteristiquesArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.voitureForm.valid) {
      this.save.emit(this.voitureForm.value);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}