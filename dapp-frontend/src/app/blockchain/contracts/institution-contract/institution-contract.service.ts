import { Injectable } from '@angular/core';
import { Web3ProviderService } from '../../provider/web3provider.service';

import { contract } from 'truffle-contract';
const institutionArtifact = require('../artifacts/Institution.json');

@Injectable({
  providedIn: 'root'
})
export class InstitutionContractService {

  public Institution: any;

  constructor(private web3Provider: Web3ProviderService) { }

  private initialiseInstitutionContract() {
    this.Institution = contract(institutionArtifact);
    this.Institution.setProvider(this.web3Provider.getWeb3);
  }

}
