import { Injectable } from '@angular/core';
import { Web3ProviderService } from '../provider/web3provider.service';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(private web3ProviderService: Web3ProviderService) { }

  // Hold a user's collection of private keys. Each private key is unique
  // to an Election.
  // @Dev might have to check if wallet has a value before using it, if not, 
  // call wallet.load() on it if it has been cleared from memory.
  private wallet: any;
  private web3Instance: any = this.web3ProviderService.getWeb3();

  public createAccountAndWallet(password: string) {
    // Create the PPK.
    const newAccount = this.web3ProviderService.getWeb3().eth.accounts.create();
    // Generate an Ethereum Wallet.
    const wallet = this.web3ProviderService.getWeb3().accounts.wallet.create();
    // Add the PPK to the wallet and save to local storage.
    wallet.add(newAccount);
    wallet.save(password);
    return wallet;
  }

  /**
   * Create an Ethereum wallet file encrypted by a password which is then saved to local storage.
   * @param password the user's password which encrypts the wallet.
   */
  public createWallet(password: string) {
    this.wallet = this.web3Instance.accounts.wallet.create();
    this.wallet.save(password);
    // Encrypt the in-memory wallet.
    this.wallet.encrypt(password);
  }

  public loadWallet(password: string) {
    return this.web3Instance.eth.accounts.wallet.load(password);
  }

  /**
   * Create an Ethereum account with public and private key that is used for a
   * unique Election.
   */
  public createAccount(password: string) {
    const newAccount = this.web3Instance.eth.accounts.create();
  }

  public async signVotingTransaction(candidateAddress: string, password: string) {

    if (this.wallet !== undefined) {
      this.loadWallet(password)
    }
    this.wallet
    const transactionParameters = {
      to: candidateAddress,
      //from: this.accountAddress,
      value: this.web3.utils.toWei(amount.toString(), 'ether'),
      gasPrice: 5000000000,
      gasLimit: 21000,
      //chainId: 3
    };

    this.web3Instance.signVotingTransaction();
  }
}
