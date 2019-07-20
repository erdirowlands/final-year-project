import { Component, OnInit } from '@angular/core';
import { UniversityVotingService } from 'src/app/blockchain/contracts/university-voting/university-voting.service';
import { InstitutionContractService } from 'src/app/blockchain/contracts/institution-contract/institution-contract.service';
import { Institution } from './institution-details/institution.model';


@Component({
  selector: 'app-select-institution',
  templateUrl: './select-institution.page.html',
  styleUrls: ['./select-institution.page.scss']
})
export class SelectInstitutionPage implements OnInit {
  deployedUniversityVotingContract: any;

  institutions: Institution[];

  constructor(
    private universityVotingContract: UniversityVotingService,
    private institutionContract: InstitutionContractService
  ) {}

  /**
   * Get an instance of the University Voting contract which is responsible for
   * showing Institutions that have been created.
   */
  async ngOnInit() {
    this.deployedUniversityVotingContract = await this.universityVotingContract.universityVoting.deployed();
  //  this.getCreatedInstitutions(); 
  console.log(this.deployedUniversityVotingContract);
  }

  async getCreatedInstitutions() {
    this.deployedUniversityVotingContract.getInstitutionAddresses.call();
  }
}
