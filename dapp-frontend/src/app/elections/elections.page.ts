import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Web3ProviderService } from '../blockchain/provider/web3provider.service';
import { WalletService } from '../blockchain/wallet/wallet.service';
import { NavController } from '@ionic/angular';
import { Candidate } from './candidate.model';
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
  candidates: Candidate[];

  openingTime: string;
  closingTime: string;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private web3: Web3ProviderService,
    private wallet: WalletService
  ) {}

  async ngOnInit() {
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

    await this.getElectionDescription();
    console.log('This description is' + this.description);

    await this.getCandidateAddresses();
    await this.getCandidateDetails();
  }

  private async getCandidateDetails() {
    const candidateAddresses = await this.getCandidateAddresses();
    for (let i = 0; i < candidateAddresses.length; i++) {
      await this.electionAbstraction.methods
        .getCandidateName(candidateAddresses[i])
        .call({ from: this.wallet.keypair.adminAddress }, (error, name) => {
          if (name === undefined && name !== '') {
            return;
          }
          let candidateName;
          const candidate = new Candidate(candidateAddresses[i], candidateName);
          this.candidates.push(candidate);
          // this.institution = new Institution(name, "test", ["sad"]);
          console.log(
            'Candidate name and address' + candidateName,
            candidateAddresses[i]
          );
          console.log('Candidate name error ' + error);
        });
    }
  }

  private async getCandidateAddresses() {
    let candidateAddresses = [];
    await this.electionAbstraction.methods
      .getCandidateAddresses()
      .call({ from: this.wallet.keypair.adminAddress }, (error, addresses) => {
        if (name === undefined && name !== '') {
          return;
        }
        candidateAddresses = addresses;
      });
    console.log('candidate addresses are' + candidateAddresses);
    return candidateAddresses;
  }

  private async getElectionDescription() {
    await this.electionAbstraction.methods
      .getDescription()
      .call(
        { from: this.wallet.keypair.adminAddress },
        (error, description) => {
          console.log('asdsadd ' + name);
          this.description = description;
        }
      );
  }
}
