import { Injectable } from '@angular/core';
import { Environment } from './environment';
import { Web3 } from "web3";


@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  private web3: any;

  constructor() { 
    this.web3 = new Web3(new Web3.providers.HttpProvider(Environment.ethereum.provider));
  }
}
