import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins, Capacitor } from '@capacitor/core';

import { Platform } from '@ionic/angular';


import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  private descryptSubscription: Subscription;
  private previousDecryptState = false;


  constructor(
    private platform: Platform,
    private authService: AuthService,
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

  ngOnInit() {
    this.descryptSubscription = this.authService.isWalletDecrypted.subscribe(isAuth => {
      if (!isAuth && this.previousDecryptState !== isAuth) {
        this.router.navigateByUrl('/auth');
      }
      this.previousDecryptState = isAuth;
    });
  }

  ngOnDestroy() {
    if (this.descryptSubscription) {
      this.descryptSubscription.unsubscribe();
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
