import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

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
    this.authService.login(password);
    this.router.navigateByUrl(
      '/institutions/institution-tabs/select-institution'
    );
  }
}
