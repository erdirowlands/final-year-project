import { Injectable } from '@angular/core';
import { WalletService } from '../blockchain/wallet/wallet.service';

import { map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isUserAuthenticated = false;
  private _logoutTimer: any;
  private _duration = 60;


  constructor(private walletService: WalletService) {}

  get isWalletDecrypted() {
    return this.walletService.wallet.asObservable().pipe(
      map(wallet => {
        if (wallet) {
          return true;
        } else {
          return false;
        }
      })
    );
  }

  login(password: string) {
    this.isUserAuthenticated = true;
    this.walletService.initialiseWallet(password);
  }

  logout() {
    this.isUserAuthenticated = false;
    this.walletService.purgeWalletFromMemory();
  }

  autoLogin() {

  }


  private autoLogout() {
    if (this._logoutTimer) {
      clearTimeout(this._logoutTimer);
    }
    this._logoutTimer = setTimeout(() => {
      this.logout();
    }, this._duration);
  }

  public get isUserAuthenticated() {
    return this._isUserAuthenticated;
  }
  public set isUserAuthenticated(value) {
    this._isUserAuthenticated = value;
  }


  public get logoutTimer(): number {
    return this._logoutTimer;
  }
  public set logoutTimer(value: number) {
    this._logoutTimer = value;
  }

}
