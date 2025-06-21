import { Routes } from '@angular/router';
import { HomePage } from './home/home.page'; // solo si usas HomePage

export const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      { path: '', redirectTo: 'registro', pathMatch: 'full' },
      { path: 'registro', loadComponent: () => import('./registro/registro.page').then(m => m.RegistroPage) },
      { path: 'lista', loadComponent: () => import('./lista/lista.page').then(m => m.ListaPage) },
      { path: 'validacion', loadComponent: () => import('./validacion/validacion.page').then(m => m.ValidacionPage) }
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
