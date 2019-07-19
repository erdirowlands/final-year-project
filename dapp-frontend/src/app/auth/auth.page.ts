import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { WalletService } from '../blockchain/wallet/wallet.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {
  isLoading = true;
  isLogin = true;


  constructor(private authService: AuthService, private router: Router, private walletSerivce: WalletService) {}

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
      try {
        this.authService.authenticateWallet("passworsd");
      } catch (error) {
        alert("Wrong password")
        
      }          this.router.navigateByUrl('/institutions/institution-tabs/select-institution');

      this.walletSerivce._keypairObservable.subscribe(
        resData => {
          console.log("SUCCESS " + resData);
          this.router.navigateByUrl('/institutions/institution-tabs/select-institution');
        },
        errRes => {
          console.log("ERROR: " + errRes);
        }
      );
    }



    login(password: string) {
      return this.authService.authenticateWallet(password);
    }
  }

