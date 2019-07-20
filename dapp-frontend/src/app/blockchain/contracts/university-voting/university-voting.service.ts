import { Injectable } from '@angular/core';
import { Web3ProviderService } from '../../provider/web3provider.service';

import { contract } from 'truffle-contract';
const universityVotingArtifact = require('../artifacts/UniversityVoting.json');

@Injectable({
  providedIn: 'root'
})
export class UniversityVotingService {

  private _universityVoting: any;

  constructor(private web3Provider: Web3ProviderService) { 
    this.initialiseUniversityVotingContract();
  }

  private initialiseUniversityVotingContract() {
    this._universityVoting = contract(universityVotingArtifact);
    this._universityVoting.setProvider(this.web3Provider.getWeb3);
  }

  public get universityVoting(): any {
    return this._universityVoting;
  }

}