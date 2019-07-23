import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { UniversityVotingService } from 'src/app/blockchain/contracts/university-voting/university-voting.service';
import { InstitutionContractService } from 'src/app/blockchain/contracts/institution-contract/institution-contract.service';
import { Institution } from './institution-details/institution.model';
import { WalletService } from 'src/app/blockchain/wallet/wallet.service';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-select-institution',
  templateUrl: './select-institution.page.html',
  styleUrls: ['./select-institution.page.scss']
})
export class SelectInstitutionPage implements OnInit {

  institutions: Institution[];
  institutionsArray: string[];

  public institutionsObservable = new Subject<string[]>();
  isLoading = false;

  universityVotingAbstraction: any;

  constructor(
    private wallet: WalletService,
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
    this.getInstitutionAddresses();
  }

  ionViewWillEnter() {
    //  this.isLoading = true;
    this.institutionsObservable.subscribe(() => {
      //    this.isLoading = false;
      setInterval(() => this.getInstitutionAddresses(), environment.institutionObservableRefresh.kovanTimeout);
      this.refreshInstitutionAddresses();
    });
  }

  ionViewDidLeave() {
    this.institutionsObservable.unsubscribe();
  }

  async getInstitutionAddresses() {
    await this.universityVotingAbstraction.methods.getInstitutionAddresses()
    .call(
      { from: this.wallet.keypair.adminAddress },
      (error, addresses) => {
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
          this.institutions = addresses;
          console.log(this.institutions);
        }
      }
    );
  }

  refreshInstitutionAddresses() {
    this.institutionsObservable.subscribe(addresses => {
      this.institutionsArray = addresses;
      setInterval(() => this.getInstitutionAddresses(), 30000);
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
      this.institutionsObservable.unsubscribe();
    }
  }
}
