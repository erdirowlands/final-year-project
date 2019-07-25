import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { UniversityVotingService } from 'src/app/blockchain/contracts/university-voting/university-voting.service';
import { WalletService } from 'src/app/blockchain/wallet/wallet.service';
import { Web3ProviderService } from 'src/app/blockchain/provider/web3provider.service';

import { environment } from 'src/environments/environment.prod';
import { Router } from '@angular/router';
@Component({
  selector: 'app-owner',
  templateUrl: './owner.page.html',
  styleUrls: ['./owner.page.scss']
})
export class OwnerPage implements OnInit {
  universityVotingAbstraction: any;
  public requestsObservable = new Subject<string[]>();
  approvalRequestAddresses: string[] = [];
  isLoading = false;

  constructor(
    private web3Provider: Web3ProviderService,
    private wallet: WalletService,
    private universityVotingContract: UniversityVotingService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  async ngOnInit() {
    this.universityVotingAbstraction = this.universityVotingContract.universityVotingAbstraction;
    await this.getApprovalRequests();
  }
  async ionViewWillEnter() {
    this.isLoading = true;
    await this.refreshApprovalRequests();
  }

  async approveRequest() { 
    let result;
    try {
      result = await this.universityVotingAbstraction.approveInstitutionRequest(
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

  async getApprovalRequests() {
    await this.universityVotingAbstraction.methods
      .getApprovalRequestAddresses()
      .call({ from: this.wallet.keypair.adminAddress }, (error, addresses) => {
        if (addresses === undefined || addresses.length == 0) {
          return;
        }
        if (
          !this.approvalRequestAddresses ||
          this.approvalRequestAddresses.length !== addresses.length ||
          this.approvalRequestAddresses[0] !== this.approvalRequestAddresses[0]
        ) {
          console.log('New Approval RQs detected');

          this.requestsObservable.next(addresses);
          this.isLoading = false;
          this.approvalRequestAddresses = addresses;
        }
        console.log(
          'Checking request refresh time: ' + this.approvalRequestAddresses
        );
        console.log(this.approvalRequestAddresses);
        console.log(error);
        this.isLoading = false;
      });
  }

  refreshApprovalRequests() {
    this.requestsObservable.subscribe(addresses => {
      this.approvalRequestAddresses = addresses;
      setInterval(
        () => this.getApprovalRequests(),
        environment.institutionObservableRefresh.kovanTimeout
      );
      console.log('Refresh: event');
    });
  }
}
