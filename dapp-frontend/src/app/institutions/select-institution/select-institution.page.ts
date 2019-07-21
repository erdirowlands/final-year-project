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
    this.deployedUniversityVotingContract = await this.universityVotingContract.universityVoting.at("0xbc2b9A6D47B4859fc0E7CEf50E8b4336520Eafcd");
  //  this.deployedUniversityVotingContract.getInstitutionAddresses();
  //  const test = this.newInstitutionRequest();
    this.approveRequest();
  //  console.log(this.deployedUniversityVotingContract);
  }

  async approveRequest() {
    let result = await this.deployedUniversityVotingContract.approveInstitutionRequest(
      "0x38e15764EeD3c197577F9f42c3F40A2c51AD4f88",
      { from: "0x5465340976b69551613Aa544D8beD5DdF7343A62" }
    );
    console.log(result.logs[0]);

  }

  async newInstitutionRequest() {
    // Institution data
    const institutionName = 'Ulster University';
    const adminName = 'John Francis'; // An admin must be initialised with an Institution
    const newInstitutionRequestData = [institutionName, adminName];
    let newRequestDataAsBytes32;
    newRequestDataAsBytes32 = newInstitutionRequestData.map(
      newInstitutionRequestData => asciiToHex(newInstitutionRequestData)
    );
    let result = await this.deployedUniversityVotingContract.submitInstitutionApprovalRequest(newRequestDataAsBytes32, {
      from: "0x38e15764EeD3c197577F9f42c3F40A2c51AD4f88"
    });
    console.log(result);
  }

  async getInstitutionLength() {
    await this.deployedUniversityVotingContract.getInstitutionsTotal.call();
  }

}
