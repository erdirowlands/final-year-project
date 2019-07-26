import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {
  ModalController,
  LoadingController,
  AlertController
} from '@ionic/angular';
import { NgForm } from '@angular/forms';

import { InstitutionContractService } from 'src/app/blockchain/contracts/institution-contract/institution-contract.service';
import { WalletService } from 'src/app/blockchain/wallet/wallet.service';

@Component({
  selector: 'app-create-election',
  templateUrl: './create-election.component.html',
  styleUrls: ['./create-election.component.scss']
})
export class CreateElectionComponent implements OnInit {
  @Input() institutionAddress: string;
  @ViewChild('f') form: NgForm;
  constructor(
    private modalCtrl: ModalController,
    private institutionContract: InstitutionContractService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  onCreateElection() {
    if (!this.form.valid) {
      return;
    }
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
