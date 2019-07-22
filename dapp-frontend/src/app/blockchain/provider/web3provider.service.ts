import { Injectable } from '@angular/core';
import Web3 from 'web3';
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

  public getWeb3() {
    return this.web3;
  }

  public offlineTransactionSigner() {
    const web33 = this.web3.getWeb3();

    const myContract = new web33.eth.Contract(
      universityVotingArtifact.abi,
      environment.ethereum.universityVotingContractAddress
    );

    const institutionRequest = new InstitutionApprovalRequest(
      institutionName,
      adminName
    );
    const requestArray = [
      institutionRequest.adminName,
      institutionRequest.institutionName
    ];

    const newRequestDataAsBytes32 = requestArray.map(requestArray =>
      ethers.utils.formatBytes32String(requestArray)
    );

    console.log(newRequestDataAsBytes32);

    // let method1 = myContract.methods.submitInstitutionApprovalRequest(newRequestDataAsBytes32).encodeABI();
    //  let method1 = myContract.methods.submitInstitutionApprovalRequest("[0x6173647300000000000000000000000000000000000000000000000000000000, 0x6869000000000000000000000000000000000000000000000000000000000000]").encodeABI();
    //  let method1 = myContract.methods.submitInstitutionApprovalRequest(['0x6173647300000000000000000000000000000000000000000000000000000000', '0x6869000000000000000000000000000000000000000000000000000000000000']).encodeABI();
    const method1 = myContract.methods
      .approveInstitutionRequest('0xeCDED0f569Ccd0FcEF2bc359e6F742BA1d6e533A')
      .encodeABI();
    // let method1 = myContract.methods.submitInstitutionApprovalRequest(newRequestDataAsBytes32).encodeABI();

    const method1Hex = asciiToHex(method1);

    // const privateKey = new Buffer('0x83bd955d4e7bad3b941f4c438ff0b05546b4d1dbc1ff2e3b276dcc70fdd36eec', 'hex');

    const privateKey = Buffer.from(
      '5D0A44B2F735738D8D121CF8866D45A516582C5DCFACD05E79F431FD3BBE1B98',
      'hex'
    );

    // let pk = web33.eth.accounts.privateKeyToAccount('0x5D0A44B2F735738D8D121CF8866D45A516582C5DCFACD05E79F431FD3BBE1B98');

    //
    const gasCost = await web33.eth.gasPrice;

    const theNonce = await web33.eth.getTransactionCount(
      '0xeCDED0f569Ccd0FcEF2bc359e6F742BA1d6e533A',
      'pending'
    );

    // const walletAccount = this.wallet.wallet[0];

    // this.wallet.wallet.add(pk);
    //  const walletAccount = this.wallet.wallet[2];

    const rawTx = {
      nonce: web33.utils.toHex(theNonce),
      gasPrice: web33.utils.toHex(toWei('2', 'gwei')),
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
}
