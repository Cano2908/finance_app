import { ListarPeriodos } from "./listar-periodos/listar-periodos";
import { RegistrarPeriodos } from "./registrar-periodos/registrar-periodos";

export const PERIODO_ROUTERS   = [
  {
    path: 'registrar-periodo',
    component: RegistrarPeriodos,
  },
  {
    path: 'listar-periodos',
    component: ListarPeriodos,
  },
];
