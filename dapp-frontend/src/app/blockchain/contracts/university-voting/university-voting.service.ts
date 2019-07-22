import { Injectable } from '@angular/core';
import { Web3ProviderService } from '../../provider/web3provider.service';

import { environment } from 'src/environments/environment';




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
    this._universityVotingAbstraction = new web3.eth.Contract(universityVotingArtifact.abi, environment.ethereum.universityVotingContractAddress);
  }



  public get universityVotingAbstraction(): any {
    return this._universityVotingAbstraction;
  }

 



}