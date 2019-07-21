import { Component, OnInit } from '@angular/core';
import { UniversityVotingService } from 'src/app/blockchain/contracts/university-voting/university-voting.service';
import { InstitutionContractService } from 'src/app/blockchain/contracts/institution-contract/institution-contract.service';
import { WalletService } from 'src/app/blockchain/wallet/wallet.service';
import { NgForm } from '@angular/forms';
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
  }

  // TODO REMOVE
  async approveRequest() {
    const result = await this.universityVotingDeployed.newInstitutionRequest(
      '0xBEF3a23a6ac01b16F601D1620681cf207ff55aF0',
      { from: '0x5b9bA5f0b6ef3E8D90304D8A9C7318c8226fe372' }
    );
    console.log(result.logs[0]);
  }

  onSubmit(form: NgForm) {
   if (!form.valid) {
      return;
    }
    const institutionName = form.value.institutionName;
    const adminName = form.value.adminName;

    this.submitInstitutionApproval(institutionName, adminName);
    form.reset();
  }

  private submitInstitutionApproval(institutionName: string, adminName: string) {
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
              from: '0xb14Dfc4C1a88be9a38271EDb81A0141259ac9B8a'
            }
          );
          console.log(result);
          loadingEl.dismiss();
          this.showSucessfulAlert()
        } catch (err) { 
          console.log(err);
          const errorString = err.toString();
          let sanitisedError; 
          switch (errorString) { 
            // tslint:disable-next-line: max-line-length
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
        header: 'Request submitted. We just need to verify your university status. Please check back later.',
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

}
