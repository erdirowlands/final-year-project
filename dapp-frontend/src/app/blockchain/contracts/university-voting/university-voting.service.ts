import { Injectable } from '@angular/core';
import { Web3ProviderService } from '../../provider/web3provider.service';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';

const Tx = require('ethereumjs-tx').Transaction;
let universityVotingArtifact = require('../artifacts/UniversityVoting.json');

@Injectable({
  providedIn: 'root'
})
export class UniversityVotingService {
  private _universityVotingAbstraction: any;
  private web3;

  constructor(private web3Provider: Web3ProviderService) {
    this.web3 = this.web3Provider.getWeb3;
    this.generateContractAbstraction();
  }

  private async generateContractAbstraction() {
    const web3 = this.web3Provider.getWeb3();
    this._universityVotingAbstraction = new web3.eth.Contract(
      universityVotingArtifact.abi,
      environment.ethereum.universityVotingContractAddress
    );
  }

  public async submitInstitutionRequestSigner(
    artifact: any,
    artifactAddress: string,
    submittingAddress: string,
    requestData: string[],
    walletKey: string
  ) {
    const web3Contract = this.web3;
    const myContract = new web3Contract.eth.Contract(
      artifact.abi,
      artifactAddress
    );

    const newRequestDataAsBytes32 = requestData.map(requestArray =>
      ethers.utils.formatBytes32String(requestArray)
    );

    const submitInstitutionContractMethod = myContract.methods
      .submitInstitutionApprovalRequest(newRequestDataAsBytes32)
      .encodeABI();

    const gasCost = await this.web3.eth.gasPrice;
    const currentNonce = await this.web3.eth.getTransactionCount(
      '0xeCDED0f569Ccd0FcEF2bc359e6F742BA1d6e533A',
      'pending'
    );

    // Construct the raw transaction.
    const rawTx = {
      nonce: this.web3.utils.toHex(currentNonce),
      gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('2', 'gwei')),
      gasLimit: this.web3.utils.toHex('5000000'),
      to: artifactAddress,
      value: '0x0',
      data: submitInstitutionContractMethod
    };

    // Sign the raw transaction.
    const tx = new Tx(rawTx, { chain: 'kovan', hardfork: 'petersburg' });
    const privateKey = Buffer.from(walletKey, 'hex');
    tx.sign(privateKey);
    const serializedTx = tx.serialize();

    // Now we want to send the raw transaction that has been signed with
    // the user's private key.
      this.web3.eth
        .sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', console.log)
        .sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('transactionHash', console.log)
        .on('receipt', console.log)
        .on('confirmation', console.log)
        .on('error', console.log);
    
  }

  public get universityVotingAbstraction(): any {
    return this._universityVotingAbstraction;
  }

}
