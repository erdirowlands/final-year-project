import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UniversityVotingService } from 'src/app/blockchain/contracts/university-voting/university-voting.service';
import { InstitutionContractService } from 'src/app/blockchain/contracts/institution-contract/institution-contract.service';
import { WalletService } from 'src/app/blockchain/wallet/wallet.service';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

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
    private alertCtrl: AlertController,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.universityVotingDeployed = await this.universityVotingContract.universityVotingAbstraction.at(
      environment.ethereum.universityVotingContractAddress
    );
  }

  // TODO REMOVE
  async approveRequest() {
    const result = await this.universityVotingDeployed.newInstitutionRequest(
      '0xBEF3a23a6ac01b16F601D1620681cf207ff55aF0',
      { from: '0xBEF3a23a6ac01b16F601D1620681cf207ff55aF0' }
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
              from: '0x4d220007930cf3FaC24358c387531eC5A18F3116'
            }
          );
          console.log(result);
          loadingEl.dismiss();
          this.router.navigate(['/institutions/tabs/view']);
          this.showSucessfulAlert();
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
          this.router.navigate(['/institutions/tabs/view']);
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
