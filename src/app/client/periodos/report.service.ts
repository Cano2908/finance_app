import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../core/enviroments/enviroments';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  apiUrl = environment.api_router;

  constructor(private http: HttpClient) {}

  generarReporte(
    empresaId: string,
    anios: string[]
  ): Observable<HttpResponse<Blob>> {
    const aniosNumeros = anios
      .map((anio) => parseInt(anio, 10))
      .sort((a, b) => a - b);
    const params = aniosNumeros.map((anio) => `anios=${anio}`).join('&');

    return this.http.get(
      `${this.apiUrl}/empresa/${empresaId}/reporte_final/?${params}`,
      {
        responseType: 'blob',
        observe: 'response',
      }
    );
  }
}
