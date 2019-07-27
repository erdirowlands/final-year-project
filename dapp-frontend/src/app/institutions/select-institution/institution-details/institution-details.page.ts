import { Component, OnInit } from '@angular/core';
import { InstitutionContractService } from 'src/app/blockchain/contracts/institution-contract/institution-contract.service';
import { NavController, ModalController } from '@ionic/angular';
import { Institution } from './institution.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { WalletService } from 'src/app/blockchain/wallet/wallet.service';
import { Admin } from 'src/app/auth/admin.model';
import { Election} from './election.model'
import { Web3ProviderService } from 'src/app/blockchain/provider/web3provider.service';

const institutionArtifact = require('../../../blockchain/contracts/artifacts/Institution.json');

@Component({
  selector: 'app-institution-details',
  templateUrl: './institution-details.page.html',
  styleUrls: ['./institution-details.page.scss']
})
export class InstitutionDetailsPage implements OnInit {
  institutionAbstraction: any;
  institutionAddress: string;
  institutionName: string;
  admins: Admin[] = [];
  Elections: Election[] = [];

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

  private async getElectionDetails() {
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

  private async getElectionddresses() {
    let electionAddresses = [];
    await this.institutionAbstraction.methods
      .getElectionAddressArray()
      .call({ from: this.wallet.keypair.adminAddress }, (error, addresses) => {
        if (name === undefined && name !== '') {
          return;
        }
        electionAddresses = addresses;
      });
    console.log('ELECTION addresses are' + electionAddresses);
    return electionAddresses;
  }


  openEtherScan(address: string) {
    window.open('https://kovan.etherscan.io/address/' + address);
  }

  isLoggedInAdmin(address: string) {
    return this.wallet.keypair.adminAddress === address;
  }
}
