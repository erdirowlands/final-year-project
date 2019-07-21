import { Injectable } from '@angular/core';
import { Web3ProviderService } from '../../provider/web3provider.service';

import TruffleContract from 'truffle-contract';

declare var require: any;

var universityVotingArtifact = require('../artifacts/UniversityVoting.json');

@Injectable({
  providedIn: 'root'
})
export class UniversityVotingService {

  universityVoting: any;

  constructor(private web3Provider: Web3ProviderService) { 
    this.initialiseUniversityVotingContract();
  }

  private async  initialiseUniversityVotingContract() {
    const web3 = this.web3Provider.getWeb3();
    this.universityVoting = TruffleContract(universityVotingArtifact);
    this.universityVoting.setProvider(web3.currentProvider);
    await this.universityVoting.at("0xbc2b9A6D47B4859fc0E7CEf50E8b4336520Eafcd");
    console.log(this.universityVoting);
  }



}