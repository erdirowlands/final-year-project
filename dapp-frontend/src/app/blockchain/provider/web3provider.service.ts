import { Injectable } from '@angular/core';
import Web3 from 'web3'
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class Web3ProviderService {

  // Provides a connection to the Ethereum blockchain and contains various utility methods.
  // For Joe and Fiona: The web3js library has released Typescript definitions, but I've found
  // their accounts package to have a limited implementation. So, because one of the main
  // features of this application is to manage user's PPKs, I rely on the complete implementation 
  // of webjs accounts package and have opted not to use the Typescript definitions.
  public web3: any;



  constructor() { 
    this.createWeb3();
  }

  private async createWeb3() {
   // this.web3 = new Web3(new Web3.providers.HttpProvider(environment.ethereum.provider));
   this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
  }

  public getWeb3() {
    return this.web3;
  }

}
