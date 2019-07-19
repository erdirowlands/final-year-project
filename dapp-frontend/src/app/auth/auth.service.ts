import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isUserAuthenticated = false;
  private _logoutTimer: number;


  constructor() { }

  login() {
    this.isUserAuthenticated = true;
  }

  logout() {
    this.isUserAuthenticated = false;
  }

  autoLogin() {

  }


  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
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
