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

  ngOnInit() {}

  
  login(password: string) {
      try {
      this.isLoading = true;
      this.authService.authenticateWallet("password");
     } catch (error) {
     alert("Wrong password") //ERROR Error: Key derivation failed - possibly wrong password     
    } 
    this.router.navigateByUrl(
      '/institutions/institution-tabs/select-institution'
    ); 
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

