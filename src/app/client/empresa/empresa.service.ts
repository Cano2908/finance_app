import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../core/enviroments/enviroments';
import { APIResponse } from '../../core/models/response-api';
import { CreateEmpresa, Empresa } from '../../core/models/empresa';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  apiUrl = environment.api_router;

  constructor(private http: HttpClient) {}

  listarEmpresas() {
    return this.http.get<APIResponse<Empresa[]>>(
      `${this.apiUrl}/empresa/?skip=0&limit=0&order_by=rfc&order_direction=asc`
    );
  }

  obtenerEmpresaPorId(id_empresa: string) {
    return this.http.get<APIResponse<Empresa>>(
      `${this.apiUrl}/empresa/${id_empresa}`
    );
  }

  crearEmpresa(empresa: CreateEmpresa) {
    return this.http.post<APIResponse<Empresa>>(
      `${this.apiUrl}/empresa/`,
      empresa
    );
  }
}
