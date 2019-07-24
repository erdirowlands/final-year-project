import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { WalletService } from 'src/app/blockchain/wallet/wallet.service';

const { Clipboard } = Plugins;


@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.page.html',
  styleUrls: ['./recovery.page.scss'],
})
export class RecoveryPage implements OnInit {

  constructor(private wallet: WalletService) { }

  ngOnInit() {
  }

}
