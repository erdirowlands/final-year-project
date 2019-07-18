import { Injectable } from "@angular/core";
import { Web3ProviderService } from "../provider/web3provider.service";

@Injectable({
  providedIn: "root"
})
export class WalletService {
  // TOTO Create auth service that should use fingerprint or password to provide password for loading wallet (or creating)

  private web3Instance: any;
  private electionWalletName = "university_voting_wallet";

  // Hold all of the private keys for the user. One private key is used per election,
  // Dev might have to check if wallet has a value before using it, if not,
  // call wallet.load() on it if it has been cleared from memory.
  private wallet: any;

  // TODO the loading of the wallet logic might be better servied in the login/registration component! Or maybe not?
  constructor(private web3ProviderService: Web3ProviderService) {
    this.web3Instance = this.web3ProviderService.getWeb3();
    this.initialiseWallet("password");
  }

  public initialiseWallet(password: string) {
    this.wallet = localStorage.getItem(this.electionWalletName);
    // Load the wallet if not in memory already.
    if (this.wallet !== null) {
      this. wallet = this.loadWallet('password', this.electionWalletName);
      console.log("Wallet Found! So not creating one.");
      console.log(this.wallet);
      // This will clear all wallets from memory - TODO use in auth flow when logged out.
      this.web3Instance.eth.accounts.wallet.clear();
      console.log(this.wallet);
    } else {
      console.log('No wallet found, would you like to create one?');
      this.createWallet('password');
    }
  }

  /**
   * Create an Ethereum wallet file encrypted by a password which is then saved to local storage.
   * @param password the user's password which encrypts the wallet.
   */
  private createWallet(password: string) {
    this.wallet = this.web3Instance.eth.accounts.wallet.create(1);
    this.wallet.save(password, this.electionWalletName);
    //this.wallet = this.web3Instance.eth.accounts.wallet.load("password", "university_voting_wallet");
    console.log(this.wallet);

    // let accounts;
    // This will return either the accounts from the node, or if present and in that
    // case preferentially, the accounts in the "Web 3" wallet, i.e. if I've loaded
    // a wallet from local storage or created a new one. WIll be handy for getting
    // all private keys for elections, to show which elections a user if verified for.
    // accounts = await this.web3Instance.eth.getAccounts();
    // console.log(accounts);
  }

  // TODO Change .load() to use function params.
  // TODO Should I return the wallet and pass value to caller, or set the class member wallet
  // directly here? - Think we'll go with the second option, and make this private.
  private loadWallet(password: string, walletName: string) {
    return this.web3Instance.eth.accounts.wallet.load(
      password,
      walletName
    );
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
