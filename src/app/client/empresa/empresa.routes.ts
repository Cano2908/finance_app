import { ListarEmpresas } from './listar-empresas/listar-empresas';
import { RegistrarEmpresa } from './registrar-empresa/registrar-empresa';

export const EMPRESA_ROUTES = [
  {
    path: 'registrar-empresa',
    component: RegistrarEmpresa,
  },
  {
    path: 'listar-empresas',
    component: ListarEmpresas,
  },
];
