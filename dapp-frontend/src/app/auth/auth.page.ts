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
          this.router.navigateByUrl('/institutions/tabs/view');
          this.isLoading = false;
        } catch (err) {
          this.router.navigateByUrl('/auth');
          loadingEl.dismiss();
          this.showAlert(err, 'Authentication failed');
          
        }
        if (!this.isLogin) {
        this.showAlert('Great, your account has been created! You\'ll be able to find your find and manage your Institution on the next page. If it\'s not there, you can submit a request to us to add it. Happy decentralised voting!',  "Account created");
        this.router.navigateByUrl('/institutions/tabs/view');
      }
        loadingEl.dismiss();
        
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
