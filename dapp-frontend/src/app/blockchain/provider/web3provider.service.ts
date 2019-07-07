import { Injectable } from '@angular/core';
import { Web3 } from "web3";
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class Web3ProviderService {

  // Provides a connection to the Ethereum blockchain and contains various utility methods.
  private web3: any;

  // Hold all of the private keys for the user. One private key is used per election, and
  // each private key must be validated by an administrator for each election.
  private wallet: string[];

  constructor() { 
    this.createWeb3();
  }

  private createWeb3() {
    this.web3 = new Web3(new Web3.providers.HttpProvider(environment.ethereum.provider));
  }

}
