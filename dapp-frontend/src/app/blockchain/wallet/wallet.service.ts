import { Injectable } from '@angular/core';
import { Web3ProviderService } from '../provider/web3provider.service';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  // TOTO Create auth service that should use fingerprint or password to provide password for loading wallet (or creating)

  // Provide access to the web3js API and provides a connection to the Ethereum blockchain.
  // The instance is injected by the web3Provider service as can be seen in the constructor.
  private web3Instance: any;

  // Hold all of the private keys for the user. One private key is used per election,
  // Dev might have to check if wallet has a value before using it, if not,
  // call wallet.load() on it if it has been cleared from memory.
  private wallet: any;

  private electionWalletName = 'university_voting_wallet';



  // TODO the loading of the wallet logic might be better servied in the login/registration component! Or maybe not?
  // Well, we can provide this service to auth/login!!
  constructor(private web3ProviderService: Web3ProviderService) {
    this.web3Instance = this.web3ProviderService.getWeb3();
    this.wallet = this.web3Instance.eth.accounts.wallet;
    this.initialiseWallet('password');
  }

  public initialiseWallet(password: string) {
    const walletName = localStorage.getItem(this.electionWalletName);
    // Load the wallet if not in memory already.
    if (walletName !== null) {
      this.loadWallet('password', this.electionWalletName);
      console.log('Wallet Found! So not creating one.');
      this.wallet.clear();
    } else {
      console.log('No wallet found, would you like to create one?');
      this.createWallet('password');
      this.wallet.clear();
    }
  }

  /**
   * Create an Ethereum wallet file encrypted by a password which is then saved to local storage.
   * @param password the user's password which encrypts the wallet.
   */
  private createWallet(password: string) {
    this.wallet.create(1);
    this.wallet.save(password, this.electionWalletName);
  }

  // TODO Change .load() to use function params.
  // TODO Should I return the wallet and pass value to caller, or set the class member wallet
  // directly here? - Think we'll go with the second option, and make this private.
  private loadWallet(password: string, walletName: string) {
    this.wallet.load(password, walletName);
  }

  /**
   * Create an Ethereum account with public and private key that is used for a
   * unique Election.
   */
  public createAccount(password: string) {
    const newAccount = this.web3Instance.eth.accounts.create();
  }

  public async signVotingTransaction(
    candidateAddress: string,
    password: string
  ) {
    // const wallet:
    if (this.wallet !== undefined) {
      // Shouldn't be undefined as the user will be logged in!
      //    const loadedWallet = this.loadWallet(password);
    }
    // this.wallet
    const transactionParameters = {
      to: candidateAddress,
      // from: this.accountAddress,
      gasPrice: 5000000000,
      gasLimit: 21000
      // chainId: 3
    };

    // this.web3Instance.signVotingTransaction();
  }
}
