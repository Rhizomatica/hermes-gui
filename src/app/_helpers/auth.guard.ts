import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {

    const currentUser = this.authenticationService.currentUserValue;

    if (currentUser) {
      return true;
    }

    return this.router.createUrlTree(
      ['/login'],
      { queryParams: { returnUrl: state.url } }
    );
  }
}