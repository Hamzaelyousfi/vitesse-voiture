import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalculRequest } from '../models/calcul-request';
import { CalculResponse } from '../models/calcul-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalculService {
  
  private apiUrl = `${environment.apiUrl}/api/calcul/temps`;

  constructor(private http: HttpClient) { }

  calculTemps(calculRequest: CalculRequest): Observable<CalculResponse> {
    return this.http.post<CalculResponse>(this.apiUrl, calculRequest);
  }
}