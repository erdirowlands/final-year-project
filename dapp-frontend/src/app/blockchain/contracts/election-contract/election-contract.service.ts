import { Injectable } from '@angular/core';
import { Web3ProviderService } from '../../provider/web3provider.service';
import { WalletService } from '../../wallet/wallet.service';

const electionArtifact = require('../artifacts/Election.json');

const Tx = require('ethereumjs-tx').Transaction;

@Injectable({
  providedIn: 'root'
})
export class ElectionContractService {
  private _electionAbstraction: any;

  constructor(private web3Provider: Web3ProviderService,     private wallet: WalletService
    ) {}

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

  public async deriveAddVoterMethod(
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

  public async deriveVoteMethod(
    candidateAddress: string,
    tokenWeight: number,
    contractAddress: string
  ) {
    const web3 = this.web3Provider.getWeb3();
    this._electionAbstraction = new web3.eth.Contract(
      electionArtifact.abi,
      contractAddress
    );
    const contractMethod = this._electionAbstraction.methods
      .vote(candidateAddress, tokenWeight)
      .encodeABI();
    return contractMethod;
  }

  public async deriveBeginElection(
    contractAddress: string
  ) {
    const web3 = this.web3Provider.getWeb3();
    this._electionAbstraction = new web3.eth.Contract(
      electionArtifact.abi,
      contractAddress
    );
    const contractMethod = this._electionAbstraction.methods
      .beginElection()
      .encodeABI();
    return contractMethod;
  }

  public async deriveEndlection(
    contractAddress: string
  ) {
    const web3 = this.web3Provider.getWeb3();
    this._electionAbstraction = new web3.eth.Contract(
      electionArtifact.abi,
      contractAddress
    );
    const contractMethod = this._electionAbstraction.methods
      .concludeElection()
      .encodeABI();
    return contractMethod;
  }



  public async signMethodTransaction(method: any, contractAddress: string
  ) {

    const contractMethod = this._electionAbstraction.methods
    .addNewCandidate('0x386A43f2268541d8CfbAe2c522FA6612011eA994', 'James', '0x8806e832b2a34dfcEb2E584A9b1D0fd3305F6685')
    .encodeABI();
    const web3 = this.web3Provider.getWeb3();
    // const gasCost = await this.web3.eth.gasPrice;
    const currentNonce = await web3.eth.getTransactionCount(
      '0X5B9BA5F0B6EF3E8D90304D8A9C7318C8226FE372'
    );

    // Construct the raw transaction.
    const rawTx = {
      nonce: web3.utils.toHex(currentNonce),
      gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei')),
      gasLimit: web3.utils.toHex('5000000'),
      to: contractAddress,
      value: '0x0',
      data: contractMethod
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
