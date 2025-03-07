import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Voiture } from '../models/voiture';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VoitureService {
  private apiUrl = `${environment.apiUrl}/api/voitures`;

  constructor(private http: HttpClient) { }

  getAllVoitures(): Observable<Voiture[]> {
    return this.http.get<Voiture[]>(this.apiUrl);
  }

  getVoiture(id: number): Observable<Voiture> {
    return this.http.get<Voiture>(`${this.apiUrl}/${id}`);
  }

  createVoiture(voiture: Voiture): Observable<Voiture> {
    return this.http.post<Voiture>(this.apiUrl, voiture);
  }

  updateVoiture(id: number, voiture: Voiture): Observable<Voiture> {
    return this.http.put<Voiture>(`${this.apiUrl}/${id}`, voiture);
  }

  deleteVoiture(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}