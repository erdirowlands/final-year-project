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
  universityVotingDeployed: any;

  institutions: Institution[];
  institutionsArray: string[];

  public institutionsObservable = new Subject<string[]>();
  isLoading = false;

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
  //  this.universityVotingDeployed = await this.universityVotingContract.universityVotingAbstraction.at(
  //    environment.ethereum.universityVotingContractAddress
 //   );
  //  this.getInstitutionAddresses();
  }

  ionViewWillEnter() {
    //  this.isLoading = true;
    //  this.institutionsObservable.subscribe(() => {
    //    this.isLoading = false;
    // setInterval(() => this.getInstitutionAddresses(), 10);
  //  this.refreshInstitutionAddresses();
    //  });
  }

  async getInstitutionAddresses() {
    //  let test =  await this.universityVotingDeployed.getInstitutionAddresses();
    // console.log(test);
    await this.universityVotingDeployed.getInstitutionAddresses(
      (err, addresses) => {
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

  async getInstitutionLength() {
    console.log(
      await this.universityVotingDeployed.getInstitutionsTotal.call()
    );
  }

  ngOnDestroy() {
    if (this.institutionsObservable) {
      this.institutionsObservable.unsubscribe();
    }
  }
}
