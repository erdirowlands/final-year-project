import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { InstitutionContractService } from 'src/app/blockchain/contracts/institution-contract/institution-contract.service';
import { WalletService } from 'src/app/blockchain/wallet/wallet.service';
import { Web3ProviderService } from 'src/app/blockchain/provider/web3provider.service';
import { NgForm } from '@angular/forms';

const institutionArtifact = require('../../blockchain/contracts/artifacts/Institution.json');

@Component({
  selector: 'app-create-election',
  templateUrl: './create-election.page.html',
  styleUrls: ['./create-election.page.scss']
})
export class CreateElectionPage implements OnInit {

  institutionAbstraction: any;
  institutionAddress: string;

  constructor(
    private web3: Web3ProviderService,
    private wallet: WalletService,
    private institutionContract: InstitutionContractService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  private async createNewElection(duration: number, description: string) {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Sending request to Ethereum...'
      })
      .then(async loadingEl => {
        try {
          loadingEl.present();
          // Institution data

          // Create array to use the convenient map function when converting to hex in
          // submitInstitutionRequestSigner
          const startDateUnix = Date.now() / 1000;

          await this.institutionContract.createElectionSigner(
            duration,
            description,
            this.wallet.keypair.adminPrivateKey,
            this.wallet.keypair.adminAddress,
            this.institutionAddress
            // '0x5D0A44B2F735738D8D121CF8866D45A516582C5DCFACD05E79F431FD3BBE1B98',
            // '0xeCDED0f569Ccd0FcEF2bc359e6F742BA1d6e533A'
          );
          loadingEl.dismiss();
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
          this.showDeniedAlert(sanitisedError);
        }
      });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
   
    const description = form.value.description;
    const endDate = new Date(form.value.endDate);


    const endDateUnix = endDate.getTime() / 1000;
    this.createNewElection(endDateUnix, description);
  }

  private showDeniedAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Election creation failed',
        message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

  private showSucessfulAlert() {
    this.alertCtrl
      .create({
        header: 'Election creation successful',
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }
}
