import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

import {
  LoadingController,
  AlertController,
  ModalController,
  PopoverController
} from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { NewUserPage } from './new-user/new-user.page';

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
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private popOver: PopoverController
  ) {}

  // ionViewWillEnter() {
  //   this.authService.secureWallet();
  //   this.authService.initialiseWallet()
  //  }

  ngOnInit() {
    if (!this.authService.checkForWalletFile()) {
      this.isLogin = false;
      this.openModal();
    }
  }

  login(password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(async loadingEl => {
        try {
          loadingEl.present();
          await this.delay(100);
          await this.authService.authenticateWallet(password);
          this.isLoading = false;
        } catch (err) {
          loadingEl.dismiss();
          this.showAlert(err, 'Authentication failed');
        }
        this.showAlert('Great, your account has been created! You\'ll be able to view your special recovery phrase should you ever lose your device or delete the app. Go to settings > recovery for more information',  "Account created");
        loadingEl.dismiss();
        this.router.navigateByUrl('/institutions/tabs/view');
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

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: NewUserPage
    });
    modal.present();
  }

  private showAlert(message: string, headerText: string) {
    this.alertCtrl
      .create({
        header: headerText,
        message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
