// auth.guard.ts (Angular 17+ standalone)
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isAuth = auth.isLoggedIn();
  console.log('🛡 Auth Guard -> Logged In?', isAuth);

  if (isAuth) return true;

  router.navigate(['/login']);
  return false;
};