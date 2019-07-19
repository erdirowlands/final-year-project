import { Injectable } from '@angular/core';
import { Web3ProviderService } from '../provider/web3provider.service';

import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { KeyPair } from './key-pair.model';


@Injectable({
  providedIn: 'root'
})
export class WalletService {
  // TOTO Create auth service that should use fingerprint or password to provide password for loading wallet (or creating)

  // Provide access to the web3js API and provides a connection to the Ethereum blockchain.
  // The instance is injected by the web3Provider service as can be seen in the constructor.
  private _web3Instance: any;

  // Hold all of the private keys for the user. One private key is used per election,
  // Dev might have to check if wallet has a value before using it, if not,
  // call wallet.load() on it if it has been cleared from memory.
  // Can provide this instance to the rest of the app :) 
  private _wallet: any;

  private _keypairObservable = new BehaviorSubject<string[]>(null);

  private _keypair: KeyPair;

  private _electionWalletName = 'university_voting_system_wallet';

  // TODO the loading of the wallet logic might be better servied in the login/registration component! Or maybe not?
  // Well, we can provide this service to auth/login!!
  constructor(private web3ProviderService: Web3ProviderService) {
    this._web3Instance = this.web3ProviderService.getWeb3();
    this._wallet = this._web3Instance.eth.accounts.wallet;
    this.initialiseWallet('password');
  }

  public initialiseWallet(password: string) {
    const walletName = localStorage.getItem(this._electionWalletName);
    // Load the wallet if not in memory already.
    if (walletName !== null) {
      this.loadWallet('password', this._electionWalletName);
      this.getKeyPair();
      console.log('Wallet Found! So not creating one.');
      //this._usefr = this.wallet;
    } else {
      console.log('No wallet found, would you like to create one?');
      this.createWallet('password');
    }
  }

  private async getKeyPair() {
    let accs = await this.loadWallet('password', this._electionWalletName);
     
     /* Could implement some error handling here - not sure what yet, wrong password? Think that''ll be for initialise wallet
      if (err != null) {
        alert(`There was an error fetching your accounts.`);
        return;
      }

      // Get the initial account balance so it can be displayed.
      if (accs.length == 0) {
        alert(`Couldn't get any accounts! Make sure your Ethereum client is configured correctly.`);
        return;
      }
      */
     console.log(accs);
      if (this._keypair == null   ) {
        console.log(`Observed new accounts`);
        this._keypairObservable.next(accs);
        this._keypair= new KeyPair(
          accs[0],
          accs[1],
        );
        console.log(this._keypair);
      }
  }

  /**
   * Sets the Web3 wallet's keypairs at all indexes to null.
   */
  public secureWeb3Wallet() {
    this._wallet.clear();
  }

  /**
   * Sets the key-pair model's properties to null..
   */
  public secureKeyPair() {
    this._keypair.address = null;
    this._keypair.privateKey = null;
  }

  /**
   * Create an Ethereum wallet file encrypted by a password which is then saved to local storage.
   * Two public-private key pairs are generated. The pair at index 0 is for users when acting as
   * Institution admins. The pair at index 1 is for users acting as voters in an election. Both pairs are stored
   * in the same wallet because a user can be an admin and a voter, and this also drastically simplifies
   * wallet management in that the user doesn't have to remember two passwords.
   * @param password the user's password which encrypts the wallet.
   */
  private createWallet(password: string) {
    this._wallet.create(2);
    this._wallet.save(password, this._electionWalletName);
  }

  // TODO Change .load() to use function params.
  // TODO Should I return the wallet and pass value to caller, or set the class member wallet
  // directly here? - Think we'll go with the second option, and make this private.
  private loadWallet(password: string, walletName: string) {
    this._wallet.load(password, walletName);
    return this._wallet;
  }

  /**
   * Create an Ethereum account with public and private key that is used for a
   * unique Election.
   */
  public createAccount(password: string) {
    const newAccount = this._web3Instance.eth.accounts.create();
  }

  get userIsAuthenticated() {
    return this._keypairObservable.asObservable().pipe(
      map(keypair => {
        return !!keypair[0];
      })
    );
  }

  public get wallet(): any {
    return this._wallet;
  }
  public set wallet(value: any) {
    this._wallet = value;
  }

  public get web3Instance(): any {
    return this._web3Instance;
  }

  public async signTransaction(candidateAddress: string, password: string, params: string[]) {
    // const wallet:
    if (this._wallet !== undefined) {
      // Shouldn't be undefined as the user will be logged in!
      //    const loadedWallet = this.loadWallet(password);
    }
    // this._wallet
    const transactionParameters = {
      to: candidateAddress,
      // from: this.accountAddress,
      gasPrice: 5000000000,
      gasLimit: 21000
      // chainId: 3
    };
  }

}

