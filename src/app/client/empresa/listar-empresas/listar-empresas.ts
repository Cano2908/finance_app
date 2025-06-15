import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Empresa } from '../../../core/models/empresa';
import { EmpresaService } from '../empresa.service';
import { APIResponse } from '../../../core/models/response-api';
import { Navbar } from "../../../components/navbar/navbar";

@Component({
  selector: 'app-listar-empresas',
  imports: [Navbar],
  templateUrl: './listar-empresas.html',
})
export class ListarEmpresas implements OnInit {
  lista_empresas: Empresa[] = [];
  empresaSeleccionada: Empresa | null = null;
  succesEmpresaModal: boolean = false;

  constructor(
    private empresaService: EmpresaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.obtenerEmpresas();
  }

  obtenerEmpresas() {
    this.empresaService.listarEmpresas().subscribe({
      next: (response: APIResponse<Empresa[]>) => {
        this.lista_empresas = response.data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener empresas:', error);
      },
    });
  }

  seleccionarEmpresa(empresa: Empresa) {
    localStorage.setItem('empresaId', empresa._id);
    this.empresaSeleccionada = empresa;
    this.succesEmpresaModal = true;
  }
}
