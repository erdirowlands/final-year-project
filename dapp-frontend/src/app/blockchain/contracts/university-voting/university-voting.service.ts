import { Injectable } from '@angular/core';
import { Web3ProviderService } from '../../provider/web3provider.service';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import { WalletService } from '../../wallet/wallet.service';
const { asciiToHex } = require("web3-utils");

const Tx = require('ethereumjs-tx').Transaction;
const universityVotingArtifact = require('../artifacts/UniversityVoting.json');

@Injectable({
  providedIn: 'root'
})
export class UniversityVotingService {
  private _universityVotingAbstraction: any;
  private web3;

  constructor(
    private web3Provider: Web3ProviderService,
    private wallet: WalletService
  ) {
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
    requestData: string[],
    walletKey: string,
    walletAddress: string
  ) {
    const requestArray = [requestData[0], requestData[1]];
    const newRequestDataAsBytes32 = requestArray.map(format =>
      asciiToHex(format)
    );

    const submitInstitutionContractMethod = this._universityVotingAbstraction.methods
      .submitInstitutionApprovalRequest(newRequestDataAsBytes32)
      .encodeABI();

    const web3 = this.web3Provider.getWeb3();
    // const gasCost = await this.web3.eth.gasPrice;
    const currentNonce = await web3.eth.getTransactionCount(
      walletAddress,
      'pending'
    );

    // Construct the raw transaction.
    const rawTx = {
      nonce: web3.utils.toHex(currentNonce),
      gasPrice: web3.utils.toHex(web3.utils.toWei('70', 'gwei')),
      gasLimit: web3.utils.toHex('5000000'),
      to: environment.ethereum.universityVotingContractAddress,
      value: '0x0',
      data: submitInstitutionContractMethod
    };

    // Sign the raw transaction.
    const tx = new Tx(rawTx, { chain: 'kovan', hardfork: 'petersburg' });
    const privateKey = Buffer.from(walletKey.substring(2), 'hex');
    tx.sign(privateKey);
    const serializedTx = tx.serialize();

    // Now we want to send the raw transaction that has been signed with
    // the user's private key.
    web3.eth
      .sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('transactionHash', console.log)
      .on('receipt', console.log)
      .on('confirmation', console.log, console.log)
      .on('error', console.error);
  }

  public get universityVotingAbstraction(): any {
    return this._universityVotingAbstraction;
  }

  public async getInstitutionLength() {
    await this._universityVotingAbstraction.methods
      .getInstitutionsTotal()
      .call(
        { from: this.wallet.keypair.adminAddress },
        (error, result) => {
          if(error) {
            console.log('NOO' + error);
          }
          console.log('Insitution array length is ' + result);
          
        }
      );
  }
}
