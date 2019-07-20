import { Injectable } from '@angular/core';
import { Web3ProviderService } from '../../provider/web3provider.service';

import contract from 'truffle-contract';

const universityVotingArtifact = require('../artifacts/universityVoting.json');

@Injectable({
  providedIn: 'root'
})
export class UniversityVotingService {

  universityVoting: any;

  constructor(private web3Provider: Web3ProviderService) { 
    this.initialiseUniversityVotingContract();
  }

  private initialiseUniversityVotingContract() {

    this.universityVoting = contract(universityVotingArtifact);
    this.universityVoting.setProvider(this.web3Provider.getWeb3);
  }



}