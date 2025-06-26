import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
{
  path: 'login',
  loadComponent: () =>
    import('./components/login/login.component').then((m) => m.LoginComponent),
},
{ path: '', redirectTo: 'login', pathMatch: 'full' },
{
  path: 'recognizer',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./components/face-recognizer/face-recognizer.component').then(
      (m) => m.FaceRecognizerComponent
    ),
},
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/admin-panel/admin-panel.component').then(
        (m) => m.AdminPanelComponent
      ),
  },
  { path: '**', redirectTo: '' }, // fallback to login
];