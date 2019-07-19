import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InstitutionsService {

  // tslint:disable-next-line: variable-name
  private _institutions = [];

  constructor() { }

  public get institutions() {
    return this._institutions;
  }
  public set institutions(value) {
    this._institutions = value;
  }

}
