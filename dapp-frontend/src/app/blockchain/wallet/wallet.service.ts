import { Injectable } from '@angular/core';
import { Web3ProviderService } from '../provider/web3provider.service';

import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import Bip39 from 'bip39';
import HDKey from 'hdkey';

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

  public _keypairObservable = new BehaviorSubject<string[]>(null);

  private _keypair: KeyPair;

  private _electionWalletName = 'university_voting_system_wallet';

  // TODO the loading of the wallet logic might be better servied in the login/registration component! Or maybe not?
  // Well, we can provide this service to auth/login!!
  constructor(private web3ProviderService: Web3ProviderService) {
    this._web3Instance = this.web3ProviderService.getWeb3();
    this._wallet = this._web3Instance.eth.accounts.wallet;
  //  this.getKeyPair("password"); // TODO FOR DEV SO I CAN LOGIN AUTOMAGICALLY

  }

  public initialiseWallet(password: string) {
    const walletName = localStorage.getItem(this._electionWalletName);
    // Load the wallet if not in memory already.
    if (walletName !== null) {
      this.getKeyPair(password);
      console.log(this._wallet);
      console.log('Wallet Found! So not creating one.');
      // this._usefr = this.wallet;
    } else {
      console.log('No wallet found, would you like to create one?');
      this.registerWallet(password);
    }
  }

  public registerWallet(password: string) {
    const newWallet = this.createWallet(password);
    this._keypairObservable.next(this._wallet);
    this._keypair = new KeyPair(
      this._wallet[0].address,
      this._wallet[0].privateKey,
      this._wallet[1].address,
      this._wallet[1].privateKey
    );
  }

  public checkForWalletFile() {
    const walletName = localStorage.getItem(this._electionWalletName);
    // Load the wallet if not in memory already.
    if (walletName !== null) {
      return true;
    } else {
      return false;
    }
  }

  public getKeyPair(password: string) {
    const accs = this.loadWallet(password, this._electionWalletName);

    console.log('ACCS:', accs);
    if (this._keypair == null) {
      console.log(`Observed new accounts`);
      this._keypairObservable.next(accs);
      this._keypair = new KeyPair(
        accs[0].address,
        accs[0].privateKey,
        accs[1].address,
        accs[1].privateKey
      );
      console.log(this._keypair);
    }
  }

  public secureWallet() {
    this.secureWeb3Wallet();
    this.secureObservableKeyPair();
    this.secureKeyPair();
  }

  /**
   * Sets the Web3 wallet's keypairs at all indexes to null.
   */
  private secureWeb3Wallet() {
    this._wallet.clear();
  }

  /**
   * Sets the Web3 wallet's keypairs at all indexes to null.
   */
  private secureObservableKeyPair() {
    this._keypairObservable.next(null);
  }

  /**
   * Sets the key-pair model's properties to null..
   */
  private secureKeyPair() {
    this._keypair.adminAddress = null;
    this._keypair.adminPrivateKey = null;
    this._keypair.voterAddress = null;
    this._keypair.voterPrivateKey = null;
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

  public generateRecoveryPhrase() {
    return Bip39.generateMnemonic();
  }

  public generateAccountFromMnemonic(mnemonic: string) {
    const seed = Bip39.mnemonicToSeed(mnemonic);
    let root = HDKey.HDKey;
    root = HDKey.fromMasterSeed(seed);
    this._keypair.adminPrivateKey = root.privateKey.toString('hex');
    const account = this._web3Instance.eth.accounts.privateKeyToAccount(
      '0x' + this._keypair.adminPrivateKey
    );
    this._keypair.adminAddress = account.address;
  }

  public initialiseWeb3Wallet() {
    this._web3Instance = this.web3ProviderService.getWeb3();
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

  public get keypair(): KeyPair {
    return this._keypair;
  }

  public async signTransaction(
    candidateAddress: string,
    password: string,
    params: string[]
  ) {
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
