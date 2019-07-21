import { Component, OnInit } from '@angular/core';
import { UniversityVotingService } from 'src/app/blockchain/contracts/university-voting/university-voting.service';
import { InstitutionContractService } from 'src/app/blockchain/contracts/institution-contract/institution-contract.service';
import { WalletService } from 'src/app/blockchain/wallet/wallet.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';

import { InstitutionApprovalRequest } from './institution-approval-request.model';

const { asciiToHex } = require('web3-utils');

@Component({
  selector: 'app-institution-approval-request',
  templateUrl: './institution-approval-request.page.html',
  styleUrls: ['./institution-approval-request.page.scss']
})
export class InstitutionApprovalRequestPage implements OnInit {
  universityVotingDeployed: any;
  form: FormGroup;

  constructor(
    private wallet: WalletService,
    private universityVotingContract: UniversityVotingService,
    private institutionContract: InstitutionContractService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    this.universityVotingDeployed = await this.universityVotingContract.universityVotingAbstraction.at(
      '0xA5cb9ECa6B6dC9dcB35Aa63f2a65D8565F41B3c0'
    );

    this.form = new FormGroup({
      institutionName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      adminName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  async approveRequest() {
    const result = await this.universityVotingDeployed.newInstitutionRequest(
      '0xBEF3a23a6ac01b16F601D1620681cf207ff55aF0',
      { from: '0x5b9bA5f0b6ef3E8D90304D8A9C7318c8226fe372' }
    );
    console.log(result.logs[0]);
  }

    onSubmitInstitutionApproval(
    institutionName: string,
    adminName: string
  ) {
    if (!this.form.valid || !this.form.get('image').value) {
      return;
    }
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(async loadingEl => {
        try {
          loadingEl.present();
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
          const newRequestDataAsBytes32 = requestArray.map(requestArray =>
            asciiToHex(requestArray)
          );
          const result = await this.universityVotingDeployed.submitInstitutionApprovalRequest(
            newRequestDataAsBytes32,
            {
              // TODO THIS WILL BE FOR INFURA _ AS ADDRESS NOT FOUND ON GANACHE (would work with metamask though)
              // from: this.wallet.keypair.adminAddress
              from: '0xE0f2A9E9e7c456a6806cae0a621fC4FDe4A46b9F'
            }
          );
          console.log(result);
        } catch (err) {
          loadingEl.dismiss();
          this.showAlert(err);
        }
      });
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'New institution request failed',
        message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }
}
