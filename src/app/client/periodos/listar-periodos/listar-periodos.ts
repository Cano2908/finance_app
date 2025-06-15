import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  BalanceGeneral,
  EstadoResultados,
  Periodo,
} from '../../../core/models/periodo';
import { EmpresaService } from '../../empresa/empresa.service';
import { PeriodoService } from '../periodo.service';
import { format } from '@formkit/tempo';
import { APIResponse } from '../../../core/models/response-api';
import { Empresa, StatusEmpresa } from '../../../core/models/empresa';
import { Navbar } from '../../../components/navbar/navbar';
import { FormsModule } from '@angular/forms';
import { EstadoService } from '../estado.service';
import { BalanceService } from '../balance.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReporteService } from '../report.service';

// Enums y tipos para mejor tipado
export enum TipoDocumento {
  ESTADO_RESULTADOS = 'estado_resultados',
  BALANCE_GENERAL = 'balance_general',
}

export enum AccionModal {
  CARGAR = 'cargar',
  VER = 'ver',
  EDITAR = 'editar',
}

export interface EstadoModal {
  tipo: TipoDocumento | null;
  accion: AccionModal | null;
  abierto: boolean;
  periodoId: string;
}

export interface ConfiguracionCampo {
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
}

@Component({
  selector: 'app-listar-periodos',
  standalone: true,
  templateUrl: './listar-periodos.html',
  imports: [Navbar, FormsModule, CommonModule],
})
export class ListarPeriodos implements OnInit {
  // Datos principales
  periodos: Periodo[] = [];
  empresa: Empresa = {
    _id: '',
    nombre: '',
    rfc: '',
    status: StatusEmpresa.ACTIVO,
  };

  // Estado del modal unificado
  modalState: EstadoModal = {
    tipo: null,
    accion: null,
    abierto: false,
    periodoId: '',
  };

  // Estados de formularios
  estadoForm: EstadoResultados = this.getEmptyEstadoForm();
  balanceForm: BalanceGeneral = this.getEmptyBalanceForm();

  // Estados de edición
  modoEdicion = false;
  modoCargaManual = false;
  mostrarConfirmacionEliminacion = false;

  // Datos originales para cancelación
  datosOriginales: EstadoResultados | BalanceGeneral | null = null;

  // Archivo seleccionado
  archivo: File | null = null;

  // Configuracion para generar reporte
  configurarReporte = false;
  periodosSeleccionados: string[] = []; // Array de años seleccionados
  generandoReporte = false;

  // Configuraciones de campos
  readonly camposEstadoResultados: ConfiguracionCampo[] = [
    {
      key: 'ventas_netas',
      label: 'Ventas Netas',
      placeholder: 'Ingrese las ventas netas',
      required: true,
    },
    {
      key: 'costo_ventas',
      label: 'Costo de Ventas',
      placeholder: 'Ingrese el costo de ventas',
      required: true,
    },
    {
      key: 'utilidad_bruta',
      label: 'Utilidad Bruta',
      placeholder: 'Ingrese la utilidad bruta',
      required: true,
    },
    {
      key: 'gastos_operativos',
      label: 'Gastos Operativos',
      placeholder: 'Ingrese los gastos operativos',
      required: true,
    },
    {
      key: 'utilidad_operativa',
      label: 'Utilidad Operativa',
      placeholder: 'Ingrese la utilidad operativa',
      required: true,
    },
    {
      key: 'resultado_financieros',
      label: 'Resultados Financieros',
      placeholder: 'Ingrese los resultados financieros',
      required: true,
    },
    {
      key: 'utilidad_ante_impuestos',
      label: 'Utilidad antes de Impuestos',
      placeholder: 'Ingrese la utilidad antes de impuestos',
      required: true,
    },
    {
      key: 'impuesto_utilidad',
      label: 'Impuesto sobre la Utilidad',
      placeholder: 'Ingrese el impuesto sobre la utilidad',
      required: true,
    },
    {
      key: 'utilidad_neta',
      label: 'Utilidad Neta',
      placeholder: 'Ingrese la utilidad neta',
      required: true,
    },
  ];

  readonly camposBalanceGeneral: ConfiguracionCampo[] = [
    {
      key: 'efectivo_equivalentes',
      label: 'Efectivo y Equivalentes',
      placeholder: 'Ingrese efectivo y equivalentes',
      required: true,
    },
    {
      key: 'cuentas_por_cobrar',
      label: 'Cuentas por Cobrar',
      placeholder: 'Ingrese cuentas por cobrar',
      required: true,
    },
    {
      key: 'inventarios',
      label: 'Inventarios',
      placeholder: 'Ingrese inventarios',
      required: true,
    },
    {
      key: 'otros_activos_circulantes',
      label: 'Otros Activos Circulantes',
      placeholder: 'Ingrese otros activos circulantes',
      required: true,
    },
    {
      key: 'propiedades_plantas_equipos',
      label: 'Propiedades, Plantas y Equipos',
      placeholder: 'Ingrese PP&E',
      required: true,
    },
    {
      key: 'total_activo_circulante',
      label: 'Total Activo Circulante',
      placeholder: 'Ingrese total activo circulante',
      required: true,
    },
    {
      key: 'activos_intangibles',
      label: 'Activos Intangibles',
      placeholder: 'Ingrese activos intangibles',
      required: true,
    },
    {
      key: 'otros_activos_no_circulantes',
      label: 'Otros Activos No Circulantes',
      placeholder: 'Ingrese otros activos no circulantes',
      required: true,
    },
    {
      key: 'total_activo_no_circulante',
      label: 'Total Activo No Circulante',
      placeholder: 'Ingrese total activo no circulante',
      required: true,
    },
    {
      key: 'total_activo',
      label: 'Total Activo',
      placeholder: 'Ingrese total activo',
      required: true,
    },
    {
      key: 'cuentas_por_pagar',
      label: 'Cuentas por Pagar',
      placeholder: 'Ingrese cuentas por pagar',
      required: true,
    },
    {
      key: 'pasivos_acumulados',
      label: 'Pasivos Acumulados',
      placeholder: 'Ingrese pasivos acumulados',
      required: true,
    },
    {
      key: 'deuda_a_corto_plazo',
      label: 'Deuda a Corto Plazo',
      placeholder: 'Ingrese deuda a corto plazo',
      required: true,
    },
    {
      key: 'total_pasivo_circulante',
      label: 'Total Pasivo Circulante',
      placeholder: 'Ingrese total pasivo circulante',
      required: true,
    },
    {
      key: 'deuda_a_largo_plazo',
      label: 'Deuda a Largo Plazo',
      placeholder: 'Ingrese deuda a largo plazo',
      required: true,
    },
    {
      key: 'otros_pasivos_a_largo_plazo',
      label: 'Otros Pasivos a Largo Plazo',
      placeholder: 'Ingrese otros pasivos a largo plazo',
      required: true,
    },
    {
      key: 'total_pasivo_a_largo_plazo',
      label: 'Total Pasivo a Largo Plazo',
      placeholder: 'Ingrese total pasivo a largo plazo',
      required: true,
    },
    {
      key: 'total_pasivo',
      label: 'Total Pasivo',
      placeholder: 'Ingrese total pasivo',
      required: true,
    },
    {
      key: 'capital_social_y_utilidades_retenidas',
      label: 'Capital Social y Utilidades Retenidas',
      placeholder: 'Ingrese capital social y utilidades retenidas',
      required: true,
    },
    {
      key: 'total_pasivo_y_capital_contable',
      label: 'Total Pasivo y Capital Contable',
      placeholder: 'Ingrese total pasivo y capital contable',
      required: true,
    },
  ];

  // Enums para el template
  readonly TipoDocumento = TipoDocumento;
  readonly AccionModal = AccionModal;

  constructor(
    private empresaService: EmpresaService,
    private periodoService: PeriodoService,
    private estadoService: EstadoService,
    private balanceService: BalanceService,
    private reporteService: ReporteService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.obtenerEmpresa();
    this.obtenerPeriodos();
  }

  // Métodos de inicialización
  private getEmptyEstadoForm(): EstadoResultados {
    return {
      ventas_netas: 0,
      costo_ventas: 0,
      utilidad_bruta: 0,
      gastos_operativos: 0,
      utilidad_operativa: 0,
      resultado_financieros: 0,
      utilidad_ante_impuestos: 0,
      impuesto_utilidad: 0,
      utilidad_neta: 0,
    };
  }

  private getEmptyBalanceForm(): BalanceGeneral {
    return {
      efectivo_equivalentes: 0,
      cuentas_por_cobrar: 0,
      inventarios: 0,
      otros_activos_circulantes: 0,
      propiedades_plantas_equipos: 0,
      total_activo_circulante: 0,
      activos_intangibles: 0,
      otros_activos_no_circulantes: 0,
      total_activo_no_circulante: 0,
      total_activo: 0,
      cuentas_por_pagar: 0,
      pasivos_acumulados: 0,
      deuda_a_corto_plazo: 0,
      total_pasivo_circulante: 0,
      deuda_a_largo_plazo: 0,
      otros_pasivos_a_largo_plazo: 0,
      total_pasivo_a_largo_plazo: 0,
      total_pasivo: 0,
      capital_social_y_utilidades_retenidas: 0,
      total_pasivo_y_capital_contable: 0,
    };
  }

  // Getters para el template
  get currentFormData(): EstadoResultados | BalanceGeneral {
    return this.modalState.tipo === TipoDocumento.ESTADO_RESULTADOS
      ? this.estadoForm
      : this.balanceForm;
  }

  get currentFields(): ConfiguracionCampo[] {
    return this.modalState.tipo === TipoDocumento.ESTADO_RESULTADOS
      ? this.camposEstadoResultados
      : this.camposBalanceGeneral;
  }

  get modalTitle(): string {
    const tipo =
      this.modalState.tipo === TipoDocumento.ESTADO_RESULTADOS
        ? 'Estado de Resultados'
        : 'Balance General';
    const accion =
      this.modalState.accion === AccionModal.CARGAR ? 'Cargar' : 'Ver';
    return `${accion} ${tipo}`;
  }

  // Métodos de obtención de datos
  obtenerEmpresa(): void {
    const empresaId = localStorage.getItem('empresaId');
    if (!empresaId) {
      console.error('No se ha seleccionado una empresa.');
      return;
    }

    this.empresaService.obtenerEmpresaPorId(empresaId).subscribe({
      next: (response: APIResponse<Empresa>) => {
        this.empresa = response.data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener la empresa:', error);
      },
    });
  }

  obtenerPeriodos(): void {
    const empresaId = localStorage.getItem('empresaId');
    if (!empresaId) {
      console.error('No se ha seleccionado una empresa.');
      return;
    }

    this.periodoService.listarPeriodosByEmpresa(empresaId).subscribe({
      next: (response: APIResponse<Periodo[]>) => {
        this.periodos = response.data.map((periodo) => ({
          ...periodo,
          fecha_inicio: format(new Date(periodo.fecha_inicio), 'full'),
          fecha_fin: format(new Date(periodo.fecha_fin), 'full'),
        }));
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener periodos:', error);
      },
    });
  }

  // Métodos para manejo de modales
  abrirModal(
    tipo: TipoDocumento,
    accion: AccionModal,
    periodoId: string
  ): void {
    this.modalState = {
      tipo,
      accion,
      abierto: true,
      periodoId,
    };

    this.resetearEstados();

    if (accion === AccionModal.VER) {
      this.cargarDatosExistentes(tipo, periodoId);
    }
  }

  cerrarModal(): void {
    this.modalState = {
      tipo: null,
      accion: null,
      abierto: false,
      periodoId: '',
    };
    this.resetearEstados();
  }

  private resetearEstados(): void {
    this.modoEdicion = false;
    this.modoCargaManual = false;
    this.mostrarConfirmacionEliminacion = false;
    this.archivo = null;
    this.datosOriginales = null;
    this.estadoForm = this.getEmptyEstadoForm();
    this.balanceForm = this.getEmptyBalanceForm();
  }

  // Métodos para carga de datos existentes
  private cargarDatosExistentes(tipo: TipoDocumento, periodoId: string): void {
    if (tipo === TipoDocumento.ESTADO_RESULTADOS) {
      this.cargarEstadoResultados(periodoId);
    } else {
      this.cargarBalanceGeneral(periodoId);
    }
  }

  private cargarEstadoResultados(periodoId: string): void {
    this.estadoService.obtenerEstadoByPeriodo(periodoId).subscribe({
      next: (response: APIResponse<EstadoResultados>) => {
        this.estadoForm = { ...response.data };
        this.datosOriginales = { ...response.data };
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener estado:', error);
        this.cerrarModal();
      },
    });
  }

  private cargarBalanceGeneral(periodoId: string): void {
    this.balanceService.obtenerBalanceByPeriodo(periodoId).subscribe({
      next: (response: APIResponse<BalanceGeneral>) => {
        this.balanceForm = { ...response.data };
        this.datosOriginales = { ...response.data };
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener balance:', error);
        this.cerrarModal();
      },
    });
  }

  // Métodos para manejo de archivos
  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    const extensionesPermitidas = ['csv', 'xls', 'xlsx'];

    if (!extension || !extensionesPermitidas.includes(extension)) {
      alert('Solo se permiten archivos CSV o Excel (.csv, .xls, .xlsx)');
      input.value = '';
      return;
    }

    this.archivo = file;
    console.log('Archivo seleccionado:', file.name);
  }

  // Métodos para guardar datos
  guardar(): void {
    if (this.modoCargaManual) {
      this.guardarManual();
    } else {
      this.subirArchivo();
    }
  }

  private guardarManual(): void {
    if (!this.modalState.periodoId) {
      console.error('No se ha seleccionado un periodo.');
      return;
    }

    if (this.modalState.tipo === TipoDocumento.ESTADO_RESULTADOS) {
      this.guardarEstadoManual();
    } else {
      this.guardarBalanceManual();
    }
  }

  private guardarEstadoManual(): void {
    this.estadoService
      .crearEstadoByPeriodo(this.modalState.periodoId, this.estadoForm)
      .subscribe({
        next: () => {
          alert('Estado guardado exitosamente');
          this.cerrarModal();
          this.obtenerPeriodos();
        },
        error: (error) => {
          console.error('Error al guardar el estado:', error);
          alert('Error al guardar el estado. Por favor, inténtalo de nuevo.');
        },
      });
  }

  private guardarBalanceManual(): void {
    this.balanceService
      .crearBalanceByPeriodo(this.modalState.periodoId, this.balanceForm)
      .subscribe({
        next: () => {
          alert('Balance guardado exitosamente');
          this.cerrarModal();
          this.obtenerPeriodos();
        },
        error: (error) => {
          console.error('Error al guardar el balance:', error);
          alert('Error al guardar el balance. Por favor, inténtalo de nuevo.');
        },
      });
  }

  private subirArchivo(): void {
    if (!this.archivo || !this.modalState.periodoId) {
      alert('Seleccione un archivo válido');
      return;
    }

    if (this.modalState.tipo === TipoDocumento.ESTADO_RESULTADOS) {
      this.guardarEstadoArchivo();
    } else {
      this.guardarBalanceArchivo();
    }
  }

  guardarEstadoArchivo() {
    if (!this.archivo || !this.modalState.periodoId) {
      alert('Seleccione un archivo válido');
      return;
    }

    this.estadoService
      .crearEstadoByFile(this.modalState.periodoId, this.archivo)
      .subscribe({
        next: () => {
          alert('Estado cargado exitosamente');
          this.cerrarModal();
          this.obtenerPeriodos();
        },
        error: (error) => {
          if (error.status === 404 && error.error && error.error.message) {
            alert(error.error.message);
          } else {
            console.error('Error al cargar el estado desde archivo:', error);
            alert('Error al cargar el estado. Por favor, inténtalo de nuevo.');
          }
        },
      });
  }

  guardarBalanceArchivo() {
    if (!this.archivo || !this.modalState.periodoId) {
      alert('Seleccione un archivo válido');
      return;
    }

    this.balanceService
      .crearBalanceByFile(this.modalState.periodoId, this.archivo)
      .subscribe({
        next: () => {
          alert('Balance cargado exitosamente');
          this.cerrarModal();
          this.obtenerPeriodos();
        },
        error: (error) => {
          if (error.status === 404 && error.error && error.error.message) {
            alert(error.error.message);
          } else {
            console.error('Error al cargar el estado desde archivo:', error);
            alert('Error al cargar el estado. Por favor, inténtalo de nuevo.');
          }
        },
      });
  }

  // Métodos para edición
  habilitarEdicion(): void {
    this.modoEdicion = true;
    this.datosOriginales =
      this.modalState.tipo === TipoDocumento.ESTADO_RESULTADOS
        ? { ...this.estadoForm }
        : { ...this.balanceForm };
  }

  guardarEdicion(): void {
    if (!this.modalState.periodoId) return;

    if (this.modalState.tipo === TipoDocumento.ESTADO_RESULTADOS) {
      this.actualizarEstado();
    } else {
      this.actualizarBalance();
    }
  }

  private actualizarEstado(): void {
    this.estadoService
      .actualizarEstadoByPeriodo(this.modalState.periodoId, this.estadoForm)
      .subscribe({
        next: () => {
          alert('Estado actualizado correctamente');
          this.cerrarModal();
          this.obtenerPeriodos();
        },
        error: () => {
          alert('Error al actualizar el estado');
        },
      });
  }

  private actualizarBalance(): void {
    this.balanceService
      .actualizarBalanceByPeriodo(this.modalState.periodoId, this.balanceForm)
      .subscribe({
        next: () => {
          alert('Balance actualizado correctamente');
          this.cerrarModal();
          this.obtenerPeriodos();
        },
        error: () => {
          alert('Error al actualizar el balance');
        },
      });
  }

  cancelarEdicion(): void {
    if (this.datosOriginales) {
      if (this.modalState.tipo === TipoDocumento.ESTADO_RESULTADOS) {
        this.estadoForm = { ...(this.datosOriginales as EstadoResultados) };
      } else {
        this.balanceForm = { ...(this.datosOriginales as BalanceGeneral) };
      }
    }
    this.modoEdicion = false;
  }

  // Métodos para eliminación
  mostrarConfirmacionEliminar(): void {
    this.mostrarConfirmacionEliminacion = true;
  }

  confirmarEliminacion(): void {
    if (!this.modalState.periodoId) return;

    if (this.modalState.tipo === TipoDocumento.ESTADO_RESULTADOS) {
      this.eliminarEstado();
    } else {
      this.eliminarBalance();
    }
  }

  private eliminarEstado(): void {
    this.estadoService
      .eliminarEstadoByPeriodo(this.modalState.periodoId)
      .subscribe({
        next: () => {
          alert('Estado eliminado exitosamente');
          this.cerrarModal();
          this.obtenerPeriodos();
        },
        error: () => {
          alert('Error al eliminar el estado');
        },
      });
  }

  private eliminarBalance(): void {
    this.balanceService
      .eliminarBalanceByPeriodo(this.modalState.periodoId)
      .subscribe({
        next: () => {
          alert('Balance eliminado exitosamente');
          this.cerrarModal();
          this.obtenerPeriodos();
        },
        error: () => {
          alert('Error al eliminar el balance');
        },
      });
  }

  agregarPeriodo() {
    console.log('Navegando a registrar periodo');
    this.router.navigate(['periodo/registrar-periodo']);
  }

  cancelarEliminacion(): void {
    this.mostrarConfirmacionEliminacion = false;
  }

  // Métodos auxiliares
  toggleModoCarga(): void {
    this.modoCargaManual = !this.modoCargaManual;
    this.archivo = null;
  }

  // Método para verificar si un periodo tiene datos cargados
  tieneDocumentoCargado(periodo: Periodo, tipo: TipoDocumento): boolean {
    return tipo === TipoDocumento.ESTADO_RESULTADOS
      ? !!periodo.estado_resultado
      : !!periodo.balance_general;
  }

  // Método para obtener el valor de un campo del formulario
  getFieldValue(fieldKey: string): number {
    const form = this.currentFormData as any;
    return form[fieldKey] || 0;
  }

  // Método para establecer el valor de un campo del formulario
  setFieldValue(fieldKey: string, value: number): void {
    if (this.modalState.tipo === TipoDocumento.ESTADO_RESULTADOS) {
      (this.estadoForm as any)[fieldKey] = value;
    } else {
      (this.balanceForm as any)[fieldKey] = value;
    }
  }

  getInputValueSafe(event: Event): number {
    if (event.target && 'value' in event.target) {
      const value = (event.target as HTMLInputElement).value;
      return value ? +value : 0;
    }
    return 0;
  }

  abrirModalReporte() {
    this.configurarReporte = true;
    this.periodosSeleccionados = []; // Limpiar selección anterior
  }

  // Método para cerrar el modal de configuración
  cerrarModalReporte() {
    this.configurarReporte = false;
    this.periodosSeleccionados = [];
    this.generandoReporte = false;
  }

  // Método para alternar selección de período
  togglePeriodoSeleccion(anio: string) {
    const index = this.periodosSeleccionados.indexOf(anio);
    if (index > -1) {
      // Si ya está seleccionado, lo removemos
      this.periodosSeleccionados.splice(index, 1);
    } else {
      // Si no está seleccionado, lo agregamos
      this.periodosSeleccionados.push(anio);
    }
  }

  get periodosCompletos() {
    return this.periodos.filter(
      (periodo) =>
        this.tieneDocumentoCargado(periodo, TipoDocumento.ESTADO_RESULTADOS) &&
        this.tieneDocumentoCargado(periodo, TipoDocumento.BALANCE_GENERAL)
    );
  }

  // Método para verificar si un período está seleccionado
  esPeriodoSeleccionado(anio: string): boolean {
    return this.periodosSeleccionados.includes(anio);
  }

  // Método para seleccionar todos los períodos
  seleccionarTodos() {
    this.periodosSeleccionados = this.periodos
      .filter(
        (p) =>
          this.tieneDocumentoCargado(p, TipoDocumento.ESTADO_RESULTADOS) &&
          this.tieneDocumentoCargado(p, TipoDocumento.BALANCE_GENERAL)
      )
      .map((p) => p.anio.toString());
  }

  // Método para deseleccionar todos los períodos
  deseleccionarTodos() {
    this.periodosSeleccionados = [];
  }

  // Método para generar el reporte
  async generarReporte(): Promise<void> {
    if (this.periodosSeleccionados.length <= 1) {
      alert('Debe seleccionar al menos dos periodos para generar el reporte.');
      return;
    }

    const periodos = this.periodosSeleccionados
      .map(Number)
      .sort((a, b) => a - b);

    const sonConsecutivos = periodos.every((anio, index) => {
      if (index === 0) return true;
      return anio === periodos[index - 1] + 1;
    });

    if (!sonConsecutivos) {
      alert('Los periodos seleccionados deben ser años consecutivos.');
      return;
    }

    this.generandoReporte = true;

    try {
      const response = await this.reporteService
        .generarReporte(this.empresa._id, this.periodosSeleccionados)
        .toPromise();

      if (response?.status === 200 && response.body) {
        this.descargarArchivo(response.body, response.headers);
        this.cerrarModalReporte();
        this.cdr.detectChanges();
        this.mostrarMensajeExito('📄 Reporte generado exitosamente');
      } else {
        this.mostrarMensajeError('Error inesperado: no se recibió el archivo.');
      }
    } catch (error) {
      console.error('🚨 Error al generar reporte:', error);
      this.mostrarMensajeError('Error al generar el reporte.');
    } finally {
      this.generandoReporte = false;
    }
  }

  // Método para descargar el archivo
  private descargarArchivo(data: any, headers: any) {
    // Crear un blob con los datos del archivo
    const blob = new Blob([data], {
      type: headers['content-type'] || 'application/octet-stream',
    });

    // Crear URL para el blob
    const url = window.URL.createObjectURL(blob);

    // Crear elemento <a> para la descarga
    const link = document.createElement('a');
    link.href = url;

    // Obtener el nombre del archivo desde los headers o usar uno por defecto
    const filename =
      this.obtenerNombreArchivo(headers) ||
      `Reporte Financiero de ${this.empresa.nombre}.xlsx`;
    link.download = filename;

    // Disparar la descarga
    document.body.appendChild(link);
    link.click();

    // Limpiar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Método para obtener el nombre del archivo desde los headers
  private obtenerNombreArchivo(headers: any): string | null {
    const contentDisposition = headers['content-disposition'];
    if (contentDisposition) {
      const matches = contentDisposition.match(/filename="([^"]+)"/);
      return matches ? matches[1] : null;
    }
    return null;
  }

  // Métodos para mostrar mensajes (puedes usar tu sistema de notificaciones)
  private mostrarMensajeExito(mensaje: string) {
    // Implementar según tu sistema de notificaciones
    alert('Éxito: ' + mensaje);
  }

  private mostrarMensajeError(mensaje: string) {
    // Implementar según tu sistema de notificaciones
    console.error('Error:', mensaje);
  }
}
