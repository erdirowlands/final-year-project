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
  constructor(private authService: AuthService, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isWalletDecrypted.pipe(
      take(1),
      switchMap(isDecrypted => {
        if (!isDecrypted) {
          return this.authService.isWalletDecrypted;
        } else {
          return of(isDecrypted);
        }
      }),
      tap(isDecrypted => {
        if (!isDecrypted) {
            this.router.navigateByUrl('/auth')
        }
      })
    );
  }
}

/*
    if (!this.authService.isWalletDecrypted) {
      this.router.navigateByUrl('/auth');
    } else { return this.authService.isUserAuthenticated; }
  } */
