import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

export const HOME_GUARD: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.isLoggedIn$.pipe(
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return true;
      }

      router.navigate(['auth/login']);
      return false;
    })
  );
};

export const AUTH_GUARD: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.isLoggedIn$.pipe(
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        return true;
      }

      router.navigate(['home']);
      return false;
    })
  );
};
