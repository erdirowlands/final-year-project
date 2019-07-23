import { Component, OnInit } from '@angular/core';
import { InstitutionContractService } from 'src/app/blockchain/contracts/institution-contract/institution-contract.service';


@Component({
  selector: 'app-institution-details',
  templateUrl: './institution-details.page.html',
  styleUrls: ['./institution-details.page.scss'],
})
export class InstitutionDetailsPage implements OnInit {

  constructor(private institutionContract: InstitutionContractService) { }

  ngOnInit() {
    this.institutionContract.generateContractAbstraction("");
  }

}
