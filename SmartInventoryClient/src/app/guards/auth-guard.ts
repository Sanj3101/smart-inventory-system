import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    // 1️⃣ Check login
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles = route.data['roles'] as string[];

    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = this.authService.getRole();

      if (!userRole || !allowedRoles.includes(userRole)) {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    return true;
  }
}
