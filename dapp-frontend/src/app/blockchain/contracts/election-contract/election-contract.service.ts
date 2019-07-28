import { Injectable } from '@angular/core';
import { Web3ProviderService } from '../../provider/web3provider.service';

const electionArtifact = require('../artifacts/Election.json');

const Tx = require('ethereumjs-tx').Transaction;

@Injectable({
  providedIn: 'root'
})
export class ElectionContractService {
  private _electionAbstraction: any;

  constructor(private web3Provider: Web3ProviderService) {}

  public async deriveAddCandidateMethod(
    adminAddress: string,
    candidateName: string,
    candidateAddress: string,
    contractAddress: string
  ) {
    const web3 = this.web3Provider.getWeb3();
    this._electionAbstraction = new web3.eth.Contract(
      electionArtifact.abi,
      contractAddress
    );
    const contractMethod = this._electionAbstraction.methods
      .addNewCandidate(adminAddress, candidateName, candidateAddress)
      .encodeABI();
    return contractMethod;
  }

  public async deriveAddVoterethod(
    voterAddress: string,
    adminAddress: string,
    tokenAmount: number,
    contractAddress: string
  ) {
    const web3 = this.web3Provider.getWeb3();
    this._electionAbstraction = new web3.eth.Contract(
      electionArtifact.abi,
      contractAddress
    );
    const contractMethod = this._electionAbstraction.methods
      .addNewVoter(voterAddress, adminAddress, tokenAmount)
      .encodeABI();
    return contractMethod;
  }

  public async addCandidate(
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
    const privateKey = Buffer.from(
      'b5a9c341bb1d40be80dc731af37e34caff3eccf21b390c9cce01dade7400cfa9',
      'hex'
    );
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
}
