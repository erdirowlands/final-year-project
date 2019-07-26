import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {
  ModalController,
  LoadingController,
  AlertController
} from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { InstitutionContractService } from 'src/app/blockchain/contracts/institution-contract/institution-contract.service';
import { WalletService } from 'src/app/blockchain/wallet/wallet.service';
import { Web3ProviderService } from 'src/app/blockchain/provider/web3provider.service';

const institutionArtifact = require('../../../../blockchain/contracts/artifacts/Institution.json');
const { time } = require('openzeppelin-test-helpers');

@Component({
  selector: 'app-create-election',
  templateUrl: './create-election.component.html',
  styleUrls: ['./create-election.component.scss']
})
export class CreateElectionComponent implements OnInit {

  institutionAbstraction: any;

  @Input() institutionAddress: string;
  @ViewChild('f') form: NgForm;
  constructor(
    private modalCtrl: ModalController,
    private web3: Web3ProviderService,
    private wallet: WalletService,
    private institutionContract: InstitutionContractService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    const web3 = this.web3.getWeb3();
    this.institutionAbstraction = new web3.eth.Contract(
      institutionArtifact.abi,
      this.institutionAddress
    );
  }

  private async createNewElection(
    duration: number,
    description: string
  ) {
    const electionStartTime = await time.latest();
    duration =
      (await electionStartTime) + time.duration.weeks(1);
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

          await this.universityVotingContract.submitInstitutionRequestSigner(
            requestArray,
            this.wallet.keypair.adminPrivateKey,
            this.wallet.keypair.adminAddress
            // '0x5D0A44B2F735738D8D121CF8866D45A516582C5DCFACD05E79F431FD3BBE1B98',
            // '0xeCDED0f569Ccd0FcEF2bc359e6F742BA1d6e533A'
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

  onCreateElection() {
    if (!this.form.valid) {
      return;
    }
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
