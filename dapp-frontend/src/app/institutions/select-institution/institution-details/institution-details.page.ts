import { Component, OnInit } from '@angular/core';
import { InstitutionContractService } from 'src/app/blockchain/contracts/institution-contract/institution-contract.service';
import { NavController, ModalController } from '@ionic/angular';
import { Institution } from './institution.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Subject } from 'rxjs';

import { WalletService } from 'src/app/blockchain/wallet/wallet.service';
import { Admin } from 'src/app/auth/admin.model';
import { Election} from './election.model'
import { Web3ProviderService } from 'src/app/blockchain/provider/web3provider.service';

const institutionArtifact = require('../../../blockchain/contracts/artifacts/Institution.json');
const electionArtifact = require('../../../blockchain/contracts/artifacts/Election.json');

@Component({
  selector: 'app-institution-details',
  templateUrl: './institution-details.page.html',
  styleUrls: ['./institution-details.page.scss']
})
export class InstitutionDetailsPage implements OnInit {
  institutionAbstraction: any;
  electionAbstraction: any;
  institutionAddress: string;
  institutionName: string;
  admins: Admin[] = [];
  elections: Election[] = [];
  electionAddresses: string[];
  electionsObservable = new Subject<string[]>();
  isLoading = false;
  areNamesLoading = true;


  constructor(
    private web3: Web3ProviderService,
    private wallet: WalletService,
    private institutionContract: InstitutionContractService,
    private navController: NavController,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(async paramMap => {
      if (!paramMap.has('address')) {
        this.navController.navigateBack('/institutions/tabs/view');
        return;
      }
      const web3 = this.web3.getWeb3();
      this.institutionAbstraction = new web3.eth.Contract(
        institutionArtifact.abi,
        paramMap.get('address')
      );
      this.institutionAddress = paramMap.get('address');
    });

    await this.getInstitutionName();
    console.log('This institution is' + this.institutionName);
    await this.getAdminDetails();

    await this.getElectionAddresses();
    await this.getElectionDetails();

  }

  private async getInstitutionName() {
    await this.institutionAbstraction.methods
      .getInstitutionName()
      .call({ from: this.wallet.keypair.adminAddress }, (error, name) => {
        console.log('asdsadd ' + name);
        this.institutionName = name;
      });
  }

  /**
   *  Returns the admin's name and if they are authorised.
   *  Returns false if the address supplied isn't found in the admins mapping within the contract.
   *  Multiple return types are supported in Solidity.
   * @param adminAddress the address of the admin to be queried.
   */
  private async getAdminDetails() {
    const adminAddresses = await this.getAdminAddresses();
    for (let i = 0; i < adminAddresses.length; i++) {
      await this.institutionAbstraction.methods
        .getAdmin(adminAddresses[i])
        .call({ from: this.wallet.keypair.adminAddress }, (error, name) => {
          if (name === undefined && name !== '') {
            return;
          }
          let adminName;
          let isAuthorised;
          [adminName, isAuthorised] = name;
          const admin = new Admin(adminName, adminAddresses[i], isAuthorised);
          this.admins.push(admin);
          // this.institution = new Institution(name, "test", ["sad"]);
          console.log('Admin name' + adminName, isAuthorised);
          console.log('Admin name error ' + error);
        });
    }
  }

  private async getAdminAddresses() {
    let adminAddresses = [];
    await this.institutionAbstraction.methods
      .getAdminAddressArray()
      .call({ from: this.wallet.keypair.adminAddress }, (error, addresses) => {
        if (name === undefined && name !== '') {
          return;
        }
        adminAddresses = addresses;
      });
    console.log('admin addresses are' + adminAddresses);
    return adminAddresses;
  }

  async getElectionAddresses() {
    await this.institutionAbstraction.methods
      .getElectionAddressArray()
      .call({ from: this.wallet.keypair.adminAddress }, (error, addresses) => {
        if (addresses === undefined || addresses.length === 0) {
          return;
        }
        if (
          !this.electionAddresses ||
          this.electionAddresses.length !== addresses.length ||
          this.electionAddresses[0] !== this.electionAddresses[0]
        ) {
          console.log('New Elections detected');

          this.electionsObservable.next(addresses);
          this.isLoading = false;
          this.electionAddresses = addresses;
        }
        console.log('Checking election address request refresh time: ' + this.electionAddresses);
        console.log('ELECTION ADDRESSES' + this.electionAddresses);
        console.log(error);
        this.isLoading = false;
      });
  }

  // TODO: Tricky..
  async getElectionDetails() {
    const web3 = this.web3.getWeb3();
    for (let i = 0; i < this.electionAddresses.length; i++) {
      this.electionAbstraction = new web3.eth.Contract(
        electionArtifact.abi,
        this.electionAddresses[i]
      );
      await this.electionAbstraction.methods
        .getElectionDetails()
        .call({ from: this.wallet.keypair.adminAddress }, (error, details) => {
          if (name === undefined && name !== '') {
            return;
          }
          console.log('Got an election name: ' + details[0] + 'Plus the opening time' + details[1] + 'and opening time: ' + details[2]);
          
          let description;
          let openingTime;
          let closingTime;
          [description, openingTime, closingTime] = details;

          // Unix timestamp to date conversion taken from https://www.w3resource.com/javascript-exercises/javascript-date-exercise-17.php
          const openingTimeDate = new Date(openingTime);
          const hour = openingTimeDate.getHours();
          const minutes = '0' + openingTimeDate.getMinutes();
          const seconds = '0' + openingTimeDate.getSeconds();

          const time =  hour + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);


          const election = new Election(this.electionAddresses[i], description,  openingTime, closingTime);
          this.elections.push(election);
          console.log('Inst name' + name);
          console.log('new institution' + this.elections[i].ethereumAddress);
          this.isLoading = false;
        });
      }
    

    this.areNamesLoading = false;
  }


  openEtherScan(address: string) {
    window.open('https://kovan.etherscan.io/address/' + address);
  }

  isLoggedInAdmin(address: string) {
    return this.wallet.keypair.adminAddress === address;
  }
}
