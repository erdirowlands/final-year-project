import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // tslint:disable-next-line: variable-name
  private _isUserAuthenticated = false;

  constructor() { }

  login() {
    this.isUserAuthenticated = true;
  }

  logout() {
    this.isUserAuthenticated = false;
  }

  public get isUserAuthenticated() {
    return this._isUserAuthenticated;
  }
  public set isUserAuthenticated(value) {
    this._isUserAuthenticated = value;
  }


}
