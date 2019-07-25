import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins, Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';


import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
import { WalletService } from './blockchain/wallet/wallet.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnDestroy {
  private descryptSubscription: Subscription;
  private previousDecryptState = false;


  constructor(
    private platform: Platform,
    private authService: AuthService,
    private wallet: WalletService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }



  isOwner() {
    return this.wallet.keypair.adminAddress === environment.ethereum.owner;
  }

  ngOnDestroy() {
    this.authService.logout();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
