export enum StatusEmpresa {
  ACTIVO = 'Activo',
  INACTIVO = 'Inactivo',
}

export interface Empresa {
  _id: string;
  nombre: string;
  rfc: string;
  status: StatusEmpresa;
}

export interface CreateEmpresa {
  nombre: string;
  rfc: string;
}
