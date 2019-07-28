import { Injectable } from '@angular/core';
import { Web3ProviderService } from '../../provider/web3provider.service';
import { WalletService } from '../../wallet/wallet.service';

import { contract } from 'truffle-contract';
import { environment } from 'src/environments/environment';
const institutionArtifact = require('../artifacts/Institution.json');

const Tx = require('ethereumjs-tx').Transaction;

@Injectable({
  providedIn: 'root'
})
export class InstitutionContractService {
  private _institution: any;
  private _institutionAbstraction: any;

  constructor(private web3Provider: Web3ProviderService,     private wallet: WalletService
    ) {}

  public async generateContractAbstraction(address: string) {
    const web3 = this.web3Provider.getWeb3();
    this._institutionAbstraction = new web3.eth.Contract(
      institutionArtifact.abi,
      address
    );
  }

  public async createElectionSigner(
    electionDuration: number,
    description: string,
    walletKey: string,
    walletAddress: string,
    address: string
  ) {
    const web3 = this.web3Provider.getWeb3();
    const BN = web3.utils.BN;
    this._institutionAbstraction = new web3.eth.Contract(
      institutionArtifact.abi,
      address
    );
    const electionStartTime = await web3.eth.getBlock('latest');
    const startDateUnix = Date.now() / 1000;
    const electionStartTimeMined = new BN(electionStartTime.timestamp);
    const newendTime =  startDateUnix + 3000;
    const ok = new BN(newendTime);
    const endTime = new BN(86400);
    // electionDuration =
    //   (await electionStartTime) + time.duration.weeks(1);

    // electionDuration =  new BN(val).mul(this.days('7'))

    const createElectionMethod = this._institutionAbstraction.methods
      .createElection(electionStartTimeMined, endTime, description)
      .encodeABI();

    // const gasCost = await this.web3.eth.gasPrice;
    const currentNonce = await web3.eth.getTransactionCount(
      '0x5b9bA5f0b6ef3E8D90304D8A9C7318c8226fe372',
      'pending'
    );

    // Construct the raw transaction.
    const rawTx = {
      nonce: web3.utils.toHex(currentNonce),
      gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei')),
      gasLimit: web3.utils.toHex('5000000'),
      to: address,
      value: '0x0',
      data: createElectionMethod
    };

    // Sign the raw transaction.
    const tx = new Tx(rawTx, { chain: 'kovan', hardfork: 'petersburg' });
    const privateKey = Buffer.from('b5a9c341bb1d40be80dc731af37e34caff3eccf21b390c9cce01dade7400cfa9', 'hex');
    tx.sign(privateKey);
    const serializedTx = tx.serialize();

    // Now we want to send the raw transaction that has been signed with
    // the user's private key.
    await web3.eth
      .sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('blockHash', console.log)
      .on('receipt', console.log)
      //  .on('confirmation', console.log, console.log)
      .on('error', console.log, console.log);
  }

  public get institutionAbstraction(): any {
    return this._institutionAbstraction;
  }

  /**
   * Taken from Open Zeppelin test helpers.
   * https://github.com/OpenZeppelin/openzeppelin-test-helpers
   */
}
