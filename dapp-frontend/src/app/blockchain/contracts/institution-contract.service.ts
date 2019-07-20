import { Injectable } from '@angular/core';
import { Web3ProviderService } from '../provider/web3provider.service';

@Injectable({
  providedIn: 'root'
})
export class InstitutionContractService {

  constructor(private web3Provider: Web3ProviderService) { }
}
