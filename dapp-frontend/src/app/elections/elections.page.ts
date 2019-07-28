import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Web3ProviderService } from '../blockchain/provider/web3provider.service';
import { WalletService } from '../blockchain/wallet/wallet.service';
import { NavController } from '@ionic/angular';
const electionArtifact = require('../blockchain/contracts/artifacts/Election.json');

@Component({
  selector: 'app-elections',
  templateUrl: './elections.page.html',
  styleUrls: ['./elections.page.scss']
})
export class ElectionsPage implements OnInit {
  electionAbstraction: any;
  description: string;
  address: string;
  candidates: string[];

  openingTime: string;
  closingTime: string;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private web3: Web3ProviderService,
    private wallet: WalletService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(async paramMap => {
      if (!paramMap.has('address')) {
        this.navController.navigateBack('/institutions/tabs/view');
        return;
      }
      const web3 = this.web3.getWeb3();
      this.electionAbstraction = new web3.eth.Contract(
        electionArtifact.abi,
        paramMap.get('address')
      );
      this.address = paramMap.get('address');
    });
  }

  private async getElectionDescription() {
    await this.electionAbstraction.methods
      .getDescription()
      .call({ from: this.wallet.keypair.adminAddress }, (error, description) => {
        console.log('asdsadd ' + name);
        this.description = description;
      });
  }

}
