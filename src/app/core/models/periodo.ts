export interface EstadoResultados {
  ventas_netas: GLfloat;
  costo_ventas: GLfloat;
  utilidad_bruta: GLfloat;
  gastos_operativos: GLfloat;
  utilidad_operativa: GLfloat;
  resultado_financieros: GLfloat;
  utilidad_ante_impuestos: GLfloat;
  impuesto_utilidad: GLfloat;
  utilidad_neta: GLfloat;
}

export interface BalanceGeneral {
  efectivo_equivalentes: GLfloat;
  cuentas_por_cobrar: GLfloat;
  inventarios: GLfloat;
  otros_activos_circulantes: GLfloat;
  propiedades_plantas_equipos: GLfloat;
  total_activo_circulante: GLfloat;
  activos_intangibles: GLfloat;
  otros_activos_no_circulantes: GLfloat;
  total_activo_no_circulante: GLfloat;
  total_activo: GLfloat;
  cuentas_por_pagar: GLfloat;
  pasivos_acumulados: GLfloat;
  deuda_a_corto_plazo: GLfloat;
  total_pasivo_circulante: GLfloat;
  deuda_a_largo_plazo: GLfloat;
  otros_pasivos_a_largo_plazo: GLfloat;
  total_pasivo_a_largo_plazo: GLfloat;
  total_pasivo: GLfloat;
  capital_social_y_utilidades_retenidas: GLfloat;
  total_pasivo_y_capital_contable: GLfloat;
}

export interface Periodo {
  _id: string;
  id_empresa: string;
  anio: number;
  fecha_inicio: Date | string;
  fecha_fin: Date | string;
  estado_resultado: EstadoResultados | null;
  balance_general: BalanceGeneral | null;
}

export interface CreatePeriodo {
  id_empresa: string;
  anio?: number;
  fecha_inicio: Date;
  fecha_fin: Date;
}
