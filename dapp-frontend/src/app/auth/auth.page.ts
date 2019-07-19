import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

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

  /*
  login(password: string) {
    try {
      this.authService.authenticateWallet("passworsd");
    } catch (error) {
      alert("Wrong password")
      
    } //ERROR Error: Key derivation failed - possibly wrong password
    this.router.navigateByUrl(
      '/institutions/institution-tabs/select-institution'
    ); */

    autoLogin(password: string) {
      let authObs: Observable<string[]>;
      authObs = this.authService.authenticateWallet(password);
      authObs.subscribe(
        resData => {
          console.log("LOGGED IN");
         // this.isLoading = false;
         // loadingEl.dismiss();
          this.router.navigateByUrl('/places/tabs/discover');
        },
        errRes => {
          console.log("DENIED :()");

        });
    } 

    login(password: string) {
      return this.authService.authenticateWallet(password);
    }
  }

