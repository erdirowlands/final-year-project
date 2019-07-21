import { Component, OnInit } from '@angular/core';
import { UniversityVotingService } from 'src/app/blockchain/contracts/university-voting/university-voting.service';
import { InstitutionContractService } from 'src/app/blockchain/contracts/institution-contract/institution-contract.service';
import { Institution } from './institution-details/institution.model';
import { WalletService } from 'src/app/blockchain/wallet/wallet.service';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';



@Component({
  selector: 'app-select-institution',
  templateUrl: './select-institution.page.html',
  styleUrls: ['./select-institution.page.scss']
})
export class SelectInstitutionPage implements OnInit {
  universityVotingDeployed: any;

  institutions: Institution[];

  constructor(
    private wallet: WalletService,
    private universityVotingContract: UniversityVotingService,
    private institutionContract: InstitutionContractService
  ) {}

  public institutionsObservable = new Subject<string[]>();


  /**
   * Get an instance of the University Voting contract which is responsible for
   * showing Institutions that have been created.
   */
  async ngOnInit() {
    this.universityVotingDeployed = await this.universityVotingContract.universityVotingAbstraction.at(
      environment.ethereum.universityVotingContractAddress
    );
  }

  async getInstitutionLength() {
    console.log(
      await this.universityVotingDeployed.getInstitutionsTotal.call()
    );
  }
}
