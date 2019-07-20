import { Component, OnInit } from '@angular/core';
import { InstitutionContractService } from './institution-contract.service';



@Component({
  selector: 'app-institution-contract',
  templateUrl: './institution-contract.page.html',
  styleUrls: ['./institution-contract.page.scss'],
})
export class InstitutionContractPage implements OnInit {

  constructor(private institutionContract: InstitutionContractService) { }

  deployedInstitutionContract: any;

  async ngOnInit() {
    this.deployedInstitutionContract = await this.institutionContract.institution.deployed();

  }

}
