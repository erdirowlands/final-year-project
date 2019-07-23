import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {
  isLoading = true;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  // ionViewWillEnter() {
  //   this.authService.secureWallet();
  //   this.authService.initialiseWallet()
  //  }

  ngOnInit() {}

  login(password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(async loadingEl => {
        try {

          if (this.authService.checkForWalletFile) {
            loadingEl.present();
            await this.delay(100);
            await this.authService.authenticateWallet("password");
            this.isLoading = false;

          }


        } catch (err) {
          loadingEl.dismiss();
          this.showAlert(err);
        }
        loadingEl.dismiss();
        this.router.navigateByUrl(
          '/institutions/tabs/view'
        );
      });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const password = form.value.password;

    this.login(password);
    form.reset();
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
