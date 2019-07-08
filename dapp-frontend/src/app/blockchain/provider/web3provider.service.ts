import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root' 
})
export class Web3ProviderService {

  // Provides a connection to the Ethereum blockchain and contains various utility methods.
  // @Dev: FAO Joe and Fiona: The web3js library has released Typescript definitions, but I've found
  // their 'accounts' package to have a limited implementation of the reference Javascript. So, because
  // one of the main features of this application is the management of user's PPKs, I rely on a complete implementation
  // of webjs 'accounts' package as possible; and have opted not to use the Typescript definitions.
  public web3: any;

  constructor() { 
    this.web3 = new Web3(new Web3.providers.HttpProvider('http://192.168.1.71:7545'));

  }

  private createWeb3() {
   // this.web3 = new Web3(new Web3.providers.HttpProvider(environment.ethereum.provider));
   this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
   console.log(this.web3);
  }

  public getWeb3() {
    return this.web3;
  }

}
