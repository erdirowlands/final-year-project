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

var universityVotingArtifact = require('src/app/blockchain/contracts/artifacts/UniversityVoting.json');

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
    private web3: Web3ProviderService,
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

  /*
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
              from: '0xeCDED0f569Ccd0FcEF2bc359e6F742BA1d6e533A'
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
  } */
/*
  private async  submitInstitutionApproval(institutionName: string, adminName: string) {

    let web33 = this.web3.getWeb3();

    let myContract = new web33.eth.Contract(universityVotingArtifact.abi, '0x7ea7CD0F22c7AdA7E7E39e9f35baD5D732b914E9');

    const institutionRequest = new InstitutionApprovalRequest(
      institutionName,
      adminName
    );
    const requestArray = [
      institutionRequest.adminName,
      institutionRequest.institutionName
    ];

    const newRequestDataAsBytes32 = requestArray.map(requestArray =>
      asciiToHex(requestArray)
    );

    console.log(newRequestDataAsBytes32);

  //let method1 = myContract.methods.submitInstitutionApprovalRequest(newRequestDataAsBytes32).encodeABI();
  //  let method1 = myContract.methods.submitInstitutionApprovalRequest("[0x6173647300000000000000000000000000000000000000000000000000000000, 0x6869000000000000000000000000000000000000000000000000000000000000]").encodeABI();
   let method1 = myContract.methods.submitInstitutionApprovalRequest(['0x6173647300000000000000000000000000000000000000000000000000000000', '0x6869000000000000000000000000000000000000000000000000000000000000']).encodeABI();


    let method1Hex = asciiToHex(method1);

    const privateKey = new Buffer('0x83bd955d4e7bad3b941f4c438ff0b05546b4d1dbc1ff2e3b276dcc70fdd36eec', 'hex');

   // let pk = web33.eth.accounts.privateKeyToAccount('0x5D0A44B2F735738D8D121CF8866D45A516582C5DCFACD05E79F431FD3BBE1B98');

  // 
    let gasCost = await  web33.eth.gasPrice;

    let theNonce = await web33.eth.getTransactionCount('0xeCDED0f569Ccd0FcEF2bc359e6F742BA1d6e533A');
    
   // const walletAccount = this.wallet.wallet[0];

   // this.wallet.wallet.add(pk); 
 //  const walletAccount = this.wallet.wallet[2];

    let tx = {
      nonse: theNonce,
      chainId: '4',
      to : environment.ethereum.universityVotingContractAddress,
      data : method1,
      gasPrice: gasCost,
      gas: '3000000'
  };
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(async loadingEl => {
        try {
          loadingEl.present();
          // Institution data
          web33.eth.accounts.signTransaction(tx, privateKey).then(signed => {
            web33.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log);
        });
         // console.log(result);
          loadingEl.dismiss();
          this.router.navigate(['/institutions/tabs/view']);
          this.showSucessfulAlert();
        } catch (err) { 
        //  console.log(err);
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
  } */

  private async  submitInstitutionApproval(institutionName: string, adminName: string) {

    let web33 = this.web3.getWeb3();

    let myContract = new web33.eth.Contract(universityVotingArtifact.abi, environment.ethereum.universityVotingContractAddress);

    const institutionRequest = new InstitutionApprovalRequest(
      institutionName,
      adminName
    );
    const requestArray = [
      institutionRequest.adminName,
      institutionRequest.institutionName
    ];

    const newRequestDataAsBytes32 = requestArray.map(requestArray =>
      ethers.utils.formatBytes32String(requestArray)
    );

    console.log(newRequestDataAsBytes32);

  //let method1 = myContract.methods.submitInstitutionApprovalRequest(newRequestDataAsBytes32).encodeABI();
  //  let method1 = myContract.methods.submitInstitutionApprovalRequest("[0x6173647300000000000000000000000000000000000000000000000000000000, 0x6869000000000000000000000000000000000000000000000000000000000000]").encodeABI();
 //  let method1 = myContract.methods.submitInstitutionApprovalRequest(['0x6173647300000000000000000000000000000000000000000000000000000000', '0x6869000000000000000000000000000000000000000000000000000000000000']).encodeABI();
 //  let method1 = myContract.methods.approveInstitutionRequest('0x5CCa18974610A506b31D65eddAe341D3679CFe02').encodeABI();
   let method1 = myContract.methods.submitInstitutionApprovalRequest(newRequestDataAsBytes32).encodeABI();

    let method1Hex = asciiToHex(method1);

   // const privateKey = new Buffer('0x83bd955d4e7bad3b941f4c438ff0b05546b4d1dbc1ff2e3b276dcc70fdd36eec', 'hex');

   const privateKey = Buffer.from(
    '5D0A44B2F735738D8D121CF8866D45A516582C5DCFACD05E79F431FD3BBE1B98',
    'hex',
  );

   // let pk = web33.eth.accounts.privateKeyToAccount('0x5D0A44B2F735738D8D121CF8866D45A516582C5DCFACD05E79F431FD3BBE1B98');

  // 
    let gasCost = await  web33.eth.gasPrice;

    let theNonce = await web33.eth.getTransactionCount('0xeCDED0f569Ccd0FcEF2bc359e6F742BA1d6e533A', 'pending');
    
   // const walletAccount = this.wallet.wallet[0];

   // this.wallet.wallet.add(pk); 
 //  const walletAccount = this.wallet.wallet[2];

    let rawTx = {
      nonce: web33.utils.toHex(theNonce),
      gasPrice: web33.utils.toHex(toWei('2','gwei')),
      gasLimit: web33.utils.toHex('5000000'),
      to : environment.ethereum.universityVotingContractAddress,
      value: '0x0',
      data : method1,
  };
  const tx = new Tx(rawTx, {chain: 'kovan', hardfork: 'petersburg'});
  tx.sign(privateKey);

  const serializedTx = tx.serialize();

    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(async loadingEl => {
        try {
          loadingEl.present();
          // Institution data
          let result =  web33.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', console.log);
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
