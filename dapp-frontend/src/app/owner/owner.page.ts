import { Component, OnInit } from '@angular/core';
import { UniversityVotingService } from 'src/app/blockchain/contracts/university-voting/university-voting.service';
import { WalletService } from 'src/app/blockchain/wallet/wallet.service';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.page.html',
  styleUrls: ['./owner.page.scss']
})
export class OwnerPage implements OnInit {
  universityVotingDeployed: any;

  constructor(
    private wallet: WalletService,
    private universityVotingContract: UniversityVotingService
  ) {}

  async ngOnInit() {
    this.universityVotingDeployed = await this.universityVotingContract.universityVotingAbstraction.at(
      '0x9eEf1e027dc0DECF5a73b7D83c93010A091a0a7e'
    );
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
      if (
        error ==
        'Error: Returned error: VM Exception while processing transaction: revert Approval not found -- Reason given: Approval not found.'
      ) {
        console.log('HI');
      }
      console.log(error);
    }
  }
}
