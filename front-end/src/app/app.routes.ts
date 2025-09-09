import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/products/products.component').then((m) => m.ProductsComponent),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./components/reports/reports.component').then((m) => m.ReportsComponent),
  },
  {
    path: 'logs',
    loadComponent: () => import('./components/logs/logs.component').then((m) => m.LogsComponent),
  },
  { path: '**', redirectTo: '/products' },
];
