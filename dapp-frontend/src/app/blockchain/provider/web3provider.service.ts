import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { ethers } from 'ethers';
const Tx = require('ethereumjs-tx').Transaction;

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Web3ProviderService {
  // Provides a connection to the Ethereum blockchain and contains various utility methods.
  // @Dev: FAO Joe and Fiona: The web3js library has released Typescript definitions, but I've found
  // their 'accounts' package to have a limited implementation of the reference Javascript. So, because
  // one of the main features of this application is the management of user's PPKs, I rely on a complete implementation
  // of webjs 'accounts' package as possible; and have opted not to use the Typescript definitions.
  public web3: any;

  constructor() {
    this.createWeb3();
  }

  private async createWeb3() {
    // this.web3 = new Web3(new Web3.providers.HttpProvider(environment.ethereum.provider));
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(environment.ethereum.provider)
    );
    console.log(this.web3);
    console.log(this.web3.eth.getAccounts());
  }



  public submitInstitutionRequestSigner(artifact: any, artifactAddress: string, requestData: string[],  walletKey: string) {

    const web3Contract = this.web3;
    const myContract = new web3Contract.eth.Contract(
      artifact.abi,
      artifactAddress
    );

    const newRequestDataAsBytes32 = requestData.map(requestArray =>
      ethers.utils.formatBytes32String(requestArray)
    );

    let method1 = myContract.methods.submitInstitutionApprovalRequest(newRequestDataAsBytes32).encodeABI();

    
    const method1 = myContract.methods
      .approveInstitutionRequest('0xeCDED0f569Ccd0FcEF2bc359e6F742BA1d6e533A')
      .encodeABI();

    const privateKey = Buffer.from(
      '5D0A44B2F735738D8D121CF8866D45A516582C5DCFACD05E79F431FD3BBE1B98',
      'hex'
    );
    const gasCost = await web33.eth.gasPrice;

    const theNonce = await web33.eth.getTransactionCount(
      '0xeCDED0f569Ccd0FcEF2bc359e6F742BA1d6e533A',
      'pending'
    );

    // const walletAccount = this.wallet.wallet[0];

    // this.wallet.wallet.add(pk);
    //  const walletAccount = this.wallet.wallet[2];

    const rawTx = {
      nonce: this.web3.utils.toHex(theNonce),
      gasPrice: this.web3.utils.toHex(toWei('2', 'gwei')),
      gasLimit: web33.utils.toHex('5000000'),
      to: environment.ethereum.universityVotingContractAddress,
      value: '0x0',
      data: method1
    };
    const tx = new Tx(rawTx, { chain: 'kovan', hardfork: 'petersburg' });
    tx.sign(privateKey);

    const serializedTx = tx.serialize();

    // Institution data
    const result = web33.eth
      .sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('transactionHash', console.log)
      .on('receipt', console.log)
      .on('confirmation', console.log)
      .on('error', console.log);
  }
  catch(err) {
    console.log(err);
    const errorString = err.toString();
    let sanitisedError;
    switch (errorString) {
      // tslint:disable-next-line: max-line-length
      case 'Error: Returned error: VM Exception while processing transaction: revert You have an outstanding request, please wait for that to be processed -- Reason given: You have an outstanding request, please wait for that to be processed.':
        sanitisedError =
          'You have an outstanding request, please wait for that to be processed';
        break;
      case 'Error: Returned error: VM Exception while processing transaction: revert This approval has already been submitted!':
        sanitisedError = 'This approval has already been submitted!';
        break;
      default:
        sanitisedError = errorString;
        break;
    }
  }

  public getWeb3() {
    return this.web3;
  }
}
