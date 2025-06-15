import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PeriodoService } from '../periodo.service';
import { Router } from '@angular/router';
import { CreatePeriodo } from '../../../core/models/periodo';
import { Navbar } from '../../../components/navbar/navbar';
import { FormsModule } from '@angular/forms';
import { Empresa, StatusEmpresa } from '../../../core/models/empresa';
import { EmpresaService } from '../../empresa/empresa.service';
import { APIResponse } from '../../../core/models/response-api';

@Component({
  selector: 'app-registrar-periodos',
  imports: [Navbar, FormsModule],
  templateUrl: './registrar-periodos.html',
})
export class RegistrarPeriodos implements OnInit {
  createPeriodo: CreatePeriodo = {
    id_empresa: '',
    anio: undefined,
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
  };

  empresa: Empresa = {
    _id: '',
    nombre: '',
    rfc: '',
    status: StatusEmpresa.ACTIVO,
  };

  succesModal: boolean = false;
  errorModal: boolean = false;

  constructor(
    private empresaService: EmpresaService,
    private periodoService: PeriodoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.obtenerEmpresa();
  }

  obtenerEmpresa() {
    const empresaId = localStorage.getItem('empresaId');

    if (!empresaId) {
      console.error('No se ha seleccionado una empresa.');
      return;
    }

    this.empresaService.obtenerEmpresaPorId(empresaId).subscribe({
      next: (response: APIResponse<Empresa>) => {
        this.empresa = response.data;
        this.createPeriodo.id_empresa = this.empresa._id;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener la empresa:', error);
      },
    });
  }

  crearPeriodo() {
    const empresaId = localStorage.getItem('empresaId');
    if (!empresaId) {
      console.error('No se ha seleccionado una empresa.');
      return;
    }

    this.createPeriodo.id_empresa = empresaId;

    if (this.createPeriodo.anio) {
      const anio = this.createPeriodo.anio;

      this.createPeriodo.fecha_inicio = new Date(anio, 0, 1);
      this.createPeriodo.fecha_fin = new Date(anio, 11, 31);
    }

    console.log('Empresa ID:', empresaId);
    console.log('Datos del periodo a crear:', this.createPeriodo);

    this.periodoService
      .crearPeriodoByEmpresa(empresaId, this.createPeriodo)
      .subscribe({
        next: () => {
          this.succesModal = true;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorModal = true;
          this.cdr.detectChanges();
        },
      });
  }

  cerrarModal() {
    this.router.navigate(['periodo/listar-periodos']);
  }
}
