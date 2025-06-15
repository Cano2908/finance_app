import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../empresa.service';
import { CreateEmpresa, Empresa } from '../../../core/models/empresa';
import { Router } from '@angular/router';
import { APIResponse } from '../../../core/models/response-api';
import { Navbar } from '../../../components/navbar/navbar';

@Component({
  selector: 'app-registrar-empresa',
  imports: [FormsModule, Navbar],
  templateUrl: './registrar-empresa.html',
})
export class RegistrarEmpresa {
  createEmpresa: CreateEmpresa = {
    nombre: '',
    rfc: '',
  };

  succesModal: boolean = false;
  errorModal: boolean = false;

  constructor(
    private empresaService: EmpresaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  crearEmpresa() {
    this.empresaService.crearEmpresa(this.createEmpresa).subscribe({
      next: (_: APIResponse<Empresa>) => {
        this.succesModal = true;
        this.cdr.detectChanges();
      },
      error: (_) => {
        this.errorModal = true;
        this.cdr.detectChanges();
      },
    });
  }

  cerrarModal() {
    this.router.navigate(['empresa/listar-empresas']);
  }
}
