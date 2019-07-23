import { Injectable } from '@angular/core';
import { Web3ProviderService } from '../../provider/web3provider.service';

import { contract } from 'truffle-contract';
const institutionArtifact = require('../artifacts/Institution.json');

@Injectable({
  providedIn: 'root'
})
export class InstitutionContractService {
  private _institution: any;
  private institutionAbstraction: any;

  constructor(private web3Provider: Web3ProviderService) {}

  public async generateContractAbstraction(address: string) {
    const web3 = this.web3Provider.getWeb3();
    this.institutionAbstraction = new web3.eth.Contract(
      institutionArtifact.abi,
      address
    );
  }

  public get institution(): any {
    return this._institution;
  }
}
