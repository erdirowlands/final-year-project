import { Component, OnInit } from '@angular/core';
import { WalletService } from '../blockchain/wallet/wallet.service';


@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QRPage implements OnInit {

  ethereumDemoAddress: string;
  myAngularxQrCode: string = null;

  constructor(private wallet: WalletService) { }

  ngOnInit() {
    this.ethereumDemoAddress = this.wallet.keypair.adminAddress;
    this.myAngularxQrCode = this.ethereumDemoAddress;
  }

}
