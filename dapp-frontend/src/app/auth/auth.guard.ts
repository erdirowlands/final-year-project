import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, tap, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { WalletService } from '../blockchain/wallet/wallet.service';
import { AuthPage } from './auth.page';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(
    private authService: AuthService,
    private wallet: WalletService,
    private router: Router
  ) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.wallet.keypair) {
      if (this.wallet.keypair.adminAddress) {
        return true;
      }
    } else {
      this.router.navigateByUrl('/auth');
    }
  }
}

/*
    if (!this.authService.isWalletDecrypted) {
      this.router.navigateByUrl('/auth');
    } else { return this.authService.isUserAuthenticated; }
  } */
