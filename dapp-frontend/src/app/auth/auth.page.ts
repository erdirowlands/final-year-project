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


  constructor(private authService: AuthService, private router: Router) {}

  private loadingCtrl: LoadingController;

  ngOnInit() {}

  
  login(password: string) {
    this.isLoading = true;
    this.loadingCtrl
    .create({ keyboardClose: true, message: 'Logging in...' })
    .then(loadingEl => {
      loadingEl.present();
      this.authService.authenticateWallet(password); 
    this.router.navigateByUrl(
      '/institutions/institution-tabs/select-institution'
    );
    errRes => {
      loadingEl.dismiss();

     //this.showAlert(message);
    } 
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



  }

