import { Injectable } from '@angular/core';
import { Web3ProviderService } from '../../provider/web3provider.service';

import { contract } from 'truffle-contract';
const institutionArtifact = require('../artifacts/Institution.json');

@Injectable({
  providedIn: 'root'
})
export class InstitutionContractService {

  private _institution: any;

  constructor(private web3Provider: Web3ProviderService) { 
    this.initialiseInstitutionContract();
  }

  private initialiseInstitutionContract() {
   // this._institution = contract(institutionArtifact);
  //  this._institution.setProvider(this.web3Provider.getWeb3);
  }

  public get institution(): any {
    return this._institution;
  }

}
