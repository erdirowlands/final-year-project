import { Component, OnInit } from '@angular/core';
import { UniversityVotingService } from 'src/app/blockchain/contracts/university-voting/university-voting.service';
import { InstitutionContractService } from 'src/app/blockchain/contracts/institution-contract/institution-contract.service';
import { Institution } from './institution-details/institution.model';
import { WalletService } from 'src/app/blockchain/wallet/wallet.service';

const { asciiToHex } = require('web3-utils');

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

  /**
   * Get an instance of the University Voting contract which is responsible for
   * showing Institutions that have been created.
   */
  async ngOnInit() {
    this.universityVotingDeployed = await this.universityVotingContract.universityVotingAbstraction.at(
      '0x9eEf1e027dc0DECF5a73b7D83c93010A091a0a7e'
    );
    //  this.universityVotingDeployed.getInstitutionAddresses();
    //  const test = this.newInstitutionRequest();
    this.approveRequest();
    //  this.approveRequest();
    //  console.log(this.universityVotingDeployed);
  }

  async approveRequest() {
    let result;
    try {
      result = await this.universityVotingDeployed.approveInstitutionRequest(
        '0xBEF3a23a6ac01b16F601D1620681cf207ff55aF0',
        { from: '0x5b9bA5f0b6ef3E8D90304D8A9C7318c8226fe372' }
      );
      console.log(result.logs[0]);
    } catch (error) {
      console.log(error);

    }
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
    const result = await this.universityVotingDeployed.submitInstitutionApprovalRequest(
      newRequestDataAsBytes32,
      {
        from: '0xBEF3a23a6ac01b16F601D1620681cf207ff55aF0'
      }
    );
    console.log(result);
  }

  async getInstitutionLength() {
    console.log(
      await this.universityVotingDeployed.getInstitutionsTotal.call()
    );
  }
}
