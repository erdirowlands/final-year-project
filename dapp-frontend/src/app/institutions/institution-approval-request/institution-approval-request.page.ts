import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UniversityVotingService } from 'src/app/blockchain/contracts/university-voting/university-voting.service';
import { InstitutionContractService } from 'src/app/blockchain/contracts/institution-contract/institution-contract.service';
import { WalletService } from 'src/app/blockchain/wallet/wallet.service';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

import { InstitutionApprovalRequest } from './institution-approval-request.model';
import { Web3ProviderService } from 'src/app/blockchain/provider/web3provider.service';
import { ethers } from 'ethers';
const Tx = require('ethereumjs-tx').Transaction;

const universityVotingArtifact = require('src/app/blockchain/contracts/artifacts/UniversityVoting.json');

const { asciiToHex } = require('web3-utils');
const { toWei } = require('web3-utils');
const { toHex } = require('web3-utils');

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
    private web3: Web3ProviderService
  ) {}

  async ngOnInit() {
    // this.universityVotingDeployed = await this.universityVotingContract.universityVotingAbstraction.at(
    //    environment.ethereum.universityVotingContractAddress
    //  );
  }

  // TODO REMOVE
  async approveRequest() {
    const result = await this.universityVotingDeployed.approveInstitutionRequest(
      '0x4d220007930cf3FaC24358c387531eC5A18F3116',
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

  private async submitInstitutionApproval(
    institutionName: string,
    adminName: string
  ) {
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
          this.universityVotingContract.submitInstitutionRequestSigner(
            newRequestDataAsBytes32,
            this.wallet.keypair.adminPrivateKey,
            this.wallet.keypair.adminAddress
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
        header:
          'Request submitted. We just need to verify your university status. Please check back later.',
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }
}
