import { Component, OnInit } from '@angular/core';
import { UniversityVotingService } from 'src/app/blockchain/contracts/university-voting/university-voting.service';
import { InstitutionContractService } from 'src/app/blockchain/contracts/institution-contract/institution-contract.service';
import { Institution } from './institution-details/institution.model';
import { WalletService } from 'src/app/blockchain/wallet/wallet.service';

const { asciiToHex } = require("web3-utils");


@Component({
  selector: 'app-select-institution',
  templateUrl: './select-institution.page.html',
  styleUrls: ['./select-institution.page.scss']
})
export class SelectInstitutionPage implements OnInit {
  deployedUniversityVotingContract: any;

  institutions: Institution[];

  constructor(
    private wallet: WalletService,
    private universityVotingContract: UniversityVotingService,
    private institutionContract: InstitutionContractService
  ) {}

  /**
   * Get an instance of the University Voting contract which is responsible for
   * showing Institutions that have been created.
   */
  async ngOnInit() {
    this.deployedUniversityVotingContract = await this.universityVotingContract.universityVoting.deployed();
  //  this.deployedUniversityVotingContract.getInstitutionAddresses();
    const test = this.getInstitutionLength();
    console.log(test);
    console.log(this.deployedUniversityVotingContract);
  }

  async getCreatedInstitutions() {
    // Institution data
    const institutionName = 'Ulster University';
    const adminName = 'John Francis'; // An admin must be initialised with an Institution
    const newInstitutionRequestData = [institutionName, adminName];
    let newRequestDataAsBytes32;
    newRequestDataAsBytes32 = newInstitutionRequestData.map(
      newInstitutionRequestData => asciiToHex(newInstitutionRequestData)
    );
    await this.deployedUniversityVotingContract.submitInstitutionApprovalRequest(newRequestDataAsBytes32, {
      from: "0x5465340976b69551613Aa544D8beD5DdF7343A62"
    });
  }

  async getInstitutionLength() {
    await this.deployedUniversityVotingContract.getInstitutionsTotal.call();
  }

}
