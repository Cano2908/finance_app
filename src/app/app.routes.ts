import { Routes } from '@angular/router';
import { AuthGuard } from './auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'empresa',
    loadChildren: () =>
      import('./client/empresa/empresa.routes').then((m) => m.EMPRESA_ROUTES),
    canActivate: [AuthGuard],
  },
  {
    path: 'periodo',
    loadChildren: () =>
      import('./client/periodos/periodo.routes').then((m) => m.PERIODO_ROUTERS),
    canActivate: [AuthGuard],
  },
];
