import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../core/enviroments/enviroments';
import { APIResponse } from '../../core/models/response-api';
import { BalanceGeneral } from '../../core/models/periodo';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  apiUrl = environment.api_router;

    constructor(private http: HttpClient) {}

    obtenerBalanceByPeriodo(periodoId: string) {
      return this.http.get<APIResponse<BalanceGeneral>>(
        `${this.apiUrl}/periodo_contable/${periodoId}/balance_general/`
      );
    }

    crearBalanceByPeriodo(periodoId: string, balanceGeneral: BalanceGeneral) {
      return this.http.post<APIResponse<BalanceGeneral>>(
        `${this.apiUrl}/periodo_contable/${periodoId}/balance_general/`,
        balanceGeneral
      );
    }

    crearBalanceByFile(periodoId: string, file: File) {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<APIResponse<BalanceGeneral>>(
          `${this.apiUrl}/periodo_contable/${periodoId}/balance_general/file/`,
          formData
        );

      }

    actualizarBalanceByPeriodo(
      periodoId: string,
      balanceGeneral: BalanceGeneral
    ) {
      return this.http.put<APIResponse<BalanceGeneral>>(
        `${this.apiUrl}/periodo_contable/${periodoId}/balance_general/`,
        balanceGeneral
      );
    }

    eliminarBalanceByPeriodo(periodoId: string) {
      return this.http.delete<APIResponse<BalanceGeneral>>(
        `${this.apiUrl}/periodo_contable/${periodoId}/balance_general/`
      );
    }
}
