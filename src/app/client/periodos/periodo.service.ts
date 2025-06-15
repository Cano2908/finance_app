import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../core/enviroments/enviroments';
import { APIResponse } from '../../core/models/response-api';
import { CreatePeriodo, Periodo } from '../../core/models/periodo';

@Injectable({
  providedIn: 'root',
})
export class PeriodoService {
  apiUrl = environment.api_router;

  constructor(private http: HttpClient) {}

  listarPeriodosByEmpresa(empresaId: string) {
    return this.http.get<APIResponse<Periodo[]>>(
      `${this.apiUrl}/empresa/${empresaId}/periodo_contable/?skip=0&limit=0&order_by=anio&order_direction=asc`
    );
  }

  crearPeriodoByEmpresa(empresaId: string, periodo: CreatePeriodo) {
    return this.http.post<APIResponse<Periodo>>(
      `${this.apiUrl}/empresa/${empresaId}/periodo_contable/`,
      periodo
    );
  }
}
