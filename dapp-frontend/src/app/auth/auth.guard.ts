import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanLoad,
  Route,
  UrlSegment, 
  Router
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, tap, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { WalletService } from '../blockchain/wallet/wallet.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private authService: AuthService, private router: Router, private walletService: WalletService) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): boolean | Observable<boolean> | Promise<boolean> {
    if (this.walletService.userIsAuthenticated === null) {
      this.router.navigateByUrl('/auth');
    } else { return this.authService.isUserAuthenticated; }
  }
}
