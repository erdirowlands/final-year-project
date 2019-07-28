import { Injectable } from '@angular/core';
import { WalletService } from '../blockchain/wallet/wallet.service';

import { map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _logoutTimer: any;
  private _duration = 60;

  constructor(private walletService: WalletService) {}

  public authenticateWallet(password: string) {
    this.walletService.initialiseWallet(password);
  }

  public checkForWalletFile() {
    return this.walletService.checkForWalletFile();
  }

  public secureWallet() {
    this.walletService.secureWallet();
  }

  public initialiseWallet() {
    this.walletService.initialiseWeb3Wallet();
  }

  get isWalletDecrypted() {
    return this.walletService._keypairObservable.asObservable().pipe(
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
    this.walletService.initialiseWallet(password);
  }

  logout() {
    this.walletService.secureWallet();
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


  public get logoutTimer(): number {
    return this._logoutTimer;
  }
  public set logoutTimer(value: number) {
    this._logoutTimer = value;
  }

}
