import { Component, OnInit } from '@angular/core';
import { UniversityVotingService } from 'src/app/blockchain/contracts/university-voting/university-voting.service';
import { InstitutionContractService } from 'src/app/blockchain/contracts/institution-contract/institution-contract.service';
import { WalletService } from 'src/app/blockchain/wallet/wallet.service';
import { InstitutionApprovalRequest } from './institution-approval-request.model';
@Component({
  selector: 'app-institution-approval-request',
  templateUrl: './institution-approval-request.page.html',
  styleUrls: ['./institution-approval-request.page.scss'],
})
export class InstitutionApprovalRequestPage implements OnInit {

  constructor(private wallet: WalletService,
    private universityVotingContract: UniversityVotingService,
    private institutionContract: InstitutionContractService) { }

  ngOnInit() {
  }

  async approveRequest() {
    const result = await this.universityVotingDeployed.approveInstitutionRequest(
      '0xBEF3a23a6ac01b16F601D1620681cf207ff55aF0',
      { from: '0x5b9bA5f0b6ef3E8D90304D8A9C7318c8226fe372' }
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
    const result = await this.universityVotingDeployed.submitInstitutionApprovalRequest(
      newRequestDataAsBytes32,
      {
        from: '0xBEF3a23a6ac01b16F601D1620681cf207ff55aF0'
      }
    );
    console.log(result);
  }

}
