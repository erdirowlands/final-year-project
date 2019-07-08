import { Injectable } from '@angular/core';
import Web3 from 'web3'
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class Web3ProviderService {

  // Provides a connection to the Ethereum blockchain and contains various utility methods.
  public web3: Web3;

  // Hold all of the private keys for the user. One private key is used per election, and
  // each private key must be validated by an administrator for each election.
  private wallet: string[];

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
