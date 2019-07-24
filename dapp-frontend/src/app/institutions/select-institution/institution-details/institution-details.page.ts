import { Component, OnInit } from '@angular/core';
import { InstitutionContractService } from 'src/app/blockchain/contracts/institution-contract/institution-contract.service';
import { NavController } from '@ionic/angular';
import { Institution } from './institution.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { WalletService } from 'src/app/blockchain/wallet/wallet.service';

@Component({
  selector: 'app-institution-details',
  templateUrl: './institution-details.page.html',
  styleUrls: ['./institution-details.page.scss']
})
export class InstitutionDetailsPage implements OnInit {
  constructor(
    private wallet: WalletService,
    private institutionContract: InstitutionContractService,
    private navController: NavController,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  institutionAbstraction: any;
  institution: Institution;

  async ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('address')) {
        this.navController.navigateBack('/institutions/tabs/view');
        return;
      }
      this.institutionContract.generateContractAbstraction(
        paramMap.get('address')
      );
      this.institutionAbstraction = this.institutionContract.institutionAbstraction;
      this.getInstitutionName();
      this.getAdminName();
    });
  }

  private async getInstitutionName() {
    await this.institutionAbstraction.methods
      .getInstitutionName()
      .call({ from: this.wallet.keypair.adminAddress }, (error, name) => {
        if (name === undefined && name !== '') {
          return;
        }
        this.institution = new Institution(name, "test", ["sad"]);
        console.log("Inst name" + name);
      });
  }


  private async getAdminName() {
    await this.institutionAbstraction.methods
      .getAdmin('0x56EdDD46B3E6DF2a588b4a50069a9058742324dD')
      .call({ from: this.wallet.keypair.adminAddress }, (error, name) => {
        if (name === undefined && name !== '') {
          return;
        }
       // this.institution = new Institution(name, "test", ["sad"]);
        console.log("Admin name" + name);
        console.log("Admin name error " + error);
      });
  }
}
