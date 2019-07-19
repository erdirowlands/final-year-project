import { Injectable } from '@angular/core';
import { WalletService } from '../blockchain/wallet/wallet.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isUserAuthenticated = false;
  private _logoutTimer: any;
  private _duration = 60;


  constructor(private walletService: WalletService) {}

  login(password: string) {
    this.isUserAuthenticated = true;
    this.walletService.initialiseWallet(password);
  }

  logout() {
    this.isUserAuthenticated = false;
    this.walletService.purgeWalletFromMemory(password);
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
