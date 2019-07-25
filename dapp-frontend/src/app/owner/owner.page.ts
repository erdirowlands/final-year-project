import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { UniversityVotingService } from 'src/app/blockchain/contracts/university-voting/university-voting.service';
import { WalletService } from 'src/app/blockchain/wallet/wallet.service';
import { Web3ProviderService } from 'src/app/blockchain/provider/web3provider.service';

import { environment } from 'src/environments/environment';
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
  areApprovalsLoading = true;


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

  async approveRequest(submittingAddress: string) {
    {
      this.loadingCtrl
        .create({ keyboardClose: true, message: 'Sending request to Ethereum...' })
        .then(async loadingEl => {
          try {
            loadingEl.present();
            await this.universityVotingContract.approveInstitutionRequestSigner(
              submittingAddress
            );
            loadingEl.dismiss();
            this.router.navigate(['/institutions/tabs/view']);
            this.showSucessfulAlert();
          } catch (err) {
            console.log(err);
            const errorString = err.toString();
            let sanitisedError;
            switch (errorString) {
              // tslint:disable-next-line: max-line-length
                          
              case 'Error: Transaction ran out of gas. Please provide more gas:':
                sanitisedError =
                  'You have an outstanding request, please wait for that to be processed';
                break;
              case 'Error: Returned error: VM Exception while processing transaction: revert You have an outstanding request, please wait for that to be processed -- Reason given: You have an outstanding request, please wait for that to be processed.':
                sanitisedError =
                  'You have an outstanding request, please wait for that to be processed';
                break;
              case 'Error: Returned error: VM Exception while processing transaction: revert This approval has already been submitted!':
                sanitisedError = 'This approval has already been submitted!';
                break;
              default:
                sanitisedError = errorString;
                break;
            }
            loadingEl.dismiss();
            this.router.navigate(['/institutions/tabs/view']);
            this.showDeniedAlert(sanitisedError);
          }
        });
    }
  }

  async getApprovalRequests() {
    await this.universityVotingAbstraction.methods
      ._approvalRequestArray()
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
      this.areApprovalsLoading = false;
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


  private showDeniedAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'New institution request denied',
        message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

  private showSucessfulAlert() {
    this.alertCtrl
      .create({
        header:
          'Request submitted. We just need to verify your university status. Please check back later.',
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

}
