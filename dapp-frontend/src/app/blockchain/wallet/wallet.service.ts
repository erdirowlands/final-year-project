import { Injectable } from '@angular/core';
import { Web3ProviderService } from '../provider/web3provider.service';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(private web3ProviderService: Web3ProviderService) { }

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
   * Create an Ethereum wallet file encrypted by a password which is saved to local storage.
   * @param password the user's password which encrypts the wallet.
   */
  public createWallet(password: string) {
    const wallet = this.web3ProviderService.getWeb3().accounts.wallet.create();
    wallet.save(password);
  }
}
