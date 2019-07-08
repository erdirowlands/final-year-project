import { Injectable } from '@angular/core';
import Web3 from 'web3'
import { Web3ProviderService } from '../provider/web3provider.service';
import Accounts from 'web3/eth/accounts';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  // Hold a user's collection of private keys. Each private key is unique
  // to an Election.
  // @Dev might have to check if wallet has a value before using it, if not,
  // call wallet.load() on it if it has been cleared from memory.
  private walletConstruct: Accounts;
  private web3Instance: Web3;

  constructor(private web3ProviderService: Web3ProviderService) {
    this.web3Instance = this.web3ProviderService.getWeb3();
  }

  /**
   * Create an Ethereum wallet file encrypted by a password which is then saved to local storage.
   * @param password the user's password which encrypts the wallet.
   */
  public createWallet(password: string) {
    this.walletConstruct[0] = this.web3Instance.eth.accounts.wallet.create(1, this.web3Instance.utils.randomHex.toString());
    this.walletConstruct.wallet.save(password);
    // Encrypt the class member "wallet" because it's still in memory.
    this.walletConstruct[0].encrypt(password);
  }

  public loadWallet(password: string) {
    return this.web3Instance.eth.accounts.wallet.load(password, 'web3js_wallet');
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
    if (this.walletConstruct !== undefined) {
      const loadedWallet = this.loadWallet(password);
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
