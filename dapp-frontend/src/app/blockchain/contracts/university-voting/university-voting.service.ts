import { Injectable } from '@angular/core';
import { Web3ProviderService } from '../../provider/web3provider.service';

import { contract } from 'truffle-contract';
const universityVotingArtifact = require('../artifacts/UniversityVoting.json');

@Injectable({
  providedIn: 'root'
})
export class UniversityVotingService {

  public Institution: any;

  constructor(private web3Provider: Web3ProviderService) { }

  private initialiseUniversityVotingContract() {
    this.Institution = contract(universityVotingArtifact);
    this.Institution.setProvider(this.web3Provider.getWeb3);
  }

}