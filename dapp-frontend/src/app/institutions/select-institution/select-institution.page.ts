import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { UniversityVotingService } from 'src/app/blockchain/contracts/university-voting/university-voting.service';
import { InstitutionContractService } from 'src/app/blockchain/contracts/institution-contract/institution-contract.service';
import { Institution } from './institution-details/institution.model';
import { Web3ProviderService } from 'src/app/blockchain/provider/web3provider.service';
import { WalletService } from 'src/app/blockchain/wallet/wallet.service';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

const institutionArtifact = require('../../blockchain/contracts/artifacts/Institution.json');

@Component({
  selector: 'app-select-institution',
  templateUrl: './select-institution.page.html',
  styleUrls: ['./select-institution.page.scss']
})
export class SelectInstitutionPage implements OnInit, OnDestroy {
  institutions: Institution[] = [];
  institutionsArray: string[];
  placeHolderImage = '../assets/select-institutions/institution_item.png';
  public institutionsObservable = new Subject<string[]>();
  institutionAbstraction: any;
  isLoading = false;

  universityVotingAbstraction: any;

  constructor(
    private wallet: WalletService,
    private web3Provider: Web3ProviderService,
    private universityVotingContract: UniversityVotingService,
    private institutionContract: InstitutionContractService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  /**
   * Get an instance of the University Voting contract which is responsible for
   * showing Institutions that have been created.
   */
  async ngOnInit() {
    this.universityVotingAbstraction = this.universityVotingContract.universityVotingAbstraction;
    await this.getInstitutionAddresses();
    //  this.refreshInstitutionAddresses();
  await   this.getInstitutionNames();
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.refreshInstitutionAddresses();
  }

  ionViewWillLeave() {}

  ionViewDidLeave() {
    this.institutionsObservable.next(null);
  }

  async getInstitutionContractDetails() {
    await this.universityVotingAbstraction.methods
      .getInstitutionAddresses()
      .call({ from: this.wallet.keypair.adminAddress }, (error, addresses) => {
        if (addresses === undefined || addresses.length === 0) {
          return;
        }
        if (
          !this.institutionsArray ||
          this.institutionsArray.length !== addresses.length ||
          this.institutionsArray[0] !== this.institutionsArray[0]
        ) {
          console.log('New institutions detected');

          this.institutionsObservable.next(addresses);
          this.isLoading = false;
          this.institutionsArray = addresses;
        }
        console.log('Checking request refresh time: ' + this.institutions);
        console.log(this.institutions);
        console.log(error);
        this.isLoading = false;
      });
  }

  // TODO: Tricky..
  async getInstitutionNames() {
    const web3 = this.web3Provider.getWeb3();
    for (let i = 0; i < this.institutionsArray.length; i++) {
      this.institutionAbstraction = new web3.eth.Contract(
        institutionArtifact.abi,
        this.institutionsArray[i]
      );
      await this.institutionAbstraction.methods
        .getInstitutionName()
        .call({ from: this.wallet.keypair.adminAddress }, (error, name) => {
          if (name === undefined && name !== '') {
            return;
          }
          console.log('Inst name' + name);
          
          let institution = new Institution(this.institutionsArray[i], name,  []);
          this.institutions.push(institution);
          console.log('Inst name' + name);
          console.log('new institution' + this.institutions[i].ethereumAddress);
          this.isLoading = false;
        });
    }
  }

  async getInstitutionAddresses() {
    await this.universityVotingAbstraction.methods
      .getInstitutionAddresses()
      .call({ from: this.wallet.keypair.adminAddress }, (error, addresses) => {
        if (addresses === undefined || addresses.length == 0) {
          return;
        }
        if (
          !this.institutionsArray ||
          this.institutionsArray.length !== addresses.length ||
          this.institutionsArray[0] !== this.institutionsArray[0]
        ) {
          console.log('New institutions detected');

          this.institutionsObservable.next(addresses);
          this.isLoading = false;
          this.institutionsArray = addresses;
        }
        console.log('Checking request refresh time: ' + this.institutionsArray);
        console.log(this.institutionsArray);
        console.log(error);
        this.isLoading = false;
      });
  }

  refreshInstitutionAddresses() {
    this.institutionsObservable.subscribe(addresses => {
      this.institutionsArray = addresses;
       setInterval(() => this.getInstitutionAddresses(), environment.institutionObservableRefresh.testTimeout);
      console.log('Refresh: event');
    });
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

  ngOnDestroy() {
    if (this.institutionsObservable) {
      this.institutionsObservable.complete();
    }
  }
}