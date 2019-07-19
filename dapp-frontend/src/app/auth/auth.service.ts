import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isUserAuthenticated = false;
  private _logoutTimer: any;
  private _duration = 60;


  constructor() { }

  login() {
    this.isUserAuthenticated = true;
  }

  logout() {
    this.isUserAuthenticated = false;
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
