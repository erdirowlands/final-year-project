import { Injectable } from '@angular/core';
import { Web3ProviderService } from '../../provider/web3provider.service';

import TruffleContract from 'truffle-contract';

declare var require: any;

var universityVotingArtifact = require('../artifacts/UniversityVoting.json');

@Injectable({
  providedIn: 'root'
})
export class UniversityVotingService {

  private _universityVotingAbstraction: any;

  constructor(private web3Provider: Web3ProviderService) { 
    this.generateContractAbstraction();
  }

  private async  generateContractAbstraction() {
    const web3 = this.web3Provider.getWeb3();
    this._universityVotingAbstraction = TruffleContract(universityVotingArtifact);
    this._universityVotingAbstraction.setProvider(web3.currentProvider);
  }

  public get universityVotingAbstraction(): any {
    return this._universityVotingAbstraction;
  }

 



}