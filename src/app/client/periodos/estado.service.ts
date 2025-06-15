import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../core/enviroments/enviroments';
import { APIResponse } from '../../core/models/response-api';
import { EstadoResultados } from '../../core/models/periodo';

@Injectable({
  providedIn: 'root',
})
export class EstadoService {
  apiUrl = environment.api_router;

  constructor(private http: HttpClient) {}

  obtenerEstadoByPeriodo(periodoId: string) {
    return this.http.get<APIResponse<EstadoResultados>>(
      `${this.apiUrl}/periodo_contable/${periodoId}/estado_resultados/`
    );
  }

  crearEstadoByPeriodo(periodoId: string, estadoResultados: EstadoResultados) {
    return this.http.post<APIResponse<EstadoResultados>>(
      `${this.apiUrl}/periodo_contable/${periodoId}/estado_resultados/`,
      estadoResultados
    );
  }

  crearEstadoByFile(periodoId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<APIResponse<EstadoResultados>>(
      `${this.apiUrl}/periodo_contable/${periodoId}/estado_resultados/file/`,
      formData
    );

  }

  actualizarEstadoByPeriodo(
    periodoId: string,
    estadoResultados: EstadoResultados
  ) {
    return this.http.put<APIResponse<EstadoResultados>>(
      `${this.apiUrl}/periodo_contable/${periodoId}/estado_resultados/`,
      estadoResultados
    );
  }

  eliminarEstadoByPeriodo(periodoId: string) {
    return this.http.delete<APIResponse<EstadoResultados>>(
      `${this.apiUrl}/periodo_contable/${periodoId}/estado_resultados/`
    );
  }
}
