import { Injectable } from '@angular/core';
import { Web3ProviderService } from '../provider/web3provider.service';

@Injectable({
  providedIn: 'root'
})
export class WalletService {


  private web3Instance: any;

  // Hold all of the private keys for the user. One private key is used per election,
  // Dev might have to check if wallet has a value before using it, if not,
  // call wallet.load() on it if it has been cleared from memory.
  private wallet: any;

  constructor(private web3ProviderService: Web3ProviderService) {
    this.web3Instance = this.web3ProviderService.getWeb3();
  }

  /**
   * Create an Ethereum wallet file encrypted by a password which is then saved to local storage.
   * @param password the user's password which encrypts the wallet.
   */
  public createWallet(password: string) {
   this.wallet  = this.web3Instance.eth.accounts.wallet.create(1);
   console.log(this.wallet);
  }

  public loadWallet(password: string, electionName: string) {
    return this.web3Instance.eth.accounts.wallet.load(password, 'electionName');
  }

  /**
   * Create an Ethereum account with public and private key that is used for a
   * unique Election.
   */
  public createAccount(password: string) {
    const newAccount = this.web3Instance.eth.accounts.create();
  }

  public async signVotingTransaction(candidateAddress: string, password: string) {

    //const wallet: 
    if (this.wallet !== undefined) {
  //    const loadedWallet = this.loadWallet(password);
    }
    //this.wallet
    const transactionParameters = {
      to: candidateAddress,
      //from: this.accountAddress,
      gasPrice: 5000000000,
      gasLimit: 21000,
      //chainId: 3
    };

   // this.web3Instance.signVotingTransaction();
  }
}
