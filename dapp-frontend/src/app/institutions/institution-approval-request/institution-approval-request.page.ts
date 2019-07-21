import { Component, OnInit } from '@angular/core';
import { UniversityVotingService } from 'src/app/blockchain/contracts/university-voting/university-voting.service';
import { InstitutionContractService } from 'src/app/blockchain/contracts/institution-contract/institution-contract.service';
import { WalletService } from 'src/app/blockchain/wallet/wallet.service';
import { InstitutionApprovalRequest } from './institution-approval-request.model';

const { asciiToHex } = require('web3-utils');

@Component({
  selector: 'app-institution-approval-request',
  templateUrl: './institution-approval-request.page.html',
  styleUrls: ['./institution-approval-request.page.scss']
})
export class InstitutionApprovalRequestPage implements OnInit {
  universityVotingDeployed: any;

  constructor(
    private wallet: WalletService,
    private universityVotingContract: UniversityVotingService,
    private institutionContract: InstitutionContractService
  ) {}

  async ngOnInit() {
    this.universityVotingDeployed = await this.universityVotingContract.universityVotingAbstraction.at(
      '0x69888797C2472C54340003525B7692b2608b0C7e'
    );
  }

  async approveRequest() {
    const result = await this.universityVotingDeployed.approveInstitutionRequest(
      '0xBEF3a23a6ac01b16F601D1620681cf207ff55aF0',
      { from: '0x5b9bA5f0b6ef3E8D90304D8A9C7318c8226fe372' }
    );
    console.log(result.logs[0]);
  }

  async newInstitutionRequest(institutionName: string, adminName: string) {
    // Institution data
    const institutionRequest = new InstitutionApprovalRequest(
      institutionName,
      adminName
    );

    // Create array to use the convenient map function when converting to hex.
    const requestArray = [
      institutionRequest.adminName,
      institutionRequest.institutionName
    ];
    let newRequestDataAsBytes32 = requestArray.map(requestArray =>
      asciiToHex(requestArray)
    );
    const result = await this.universityVotingDeployed.submitInstitutionApprovalRequest(
      newRequestDataAsBytes32,
      {
        from: this.wallet.keypair[0]
      }
    );
    console.log(result);
  }
}
