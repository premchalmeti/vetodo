import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { AppConstants } from '../../shared/appConstants';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  err_msg: string;
  hide: boolean = true;
  title: string = AppConstants.TITLE;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['dashboard']);
    }
  }

  login(): void {
    if (!this.username || !this.password) {
      this.err_msg = 'Please enter username and password';
      return;
    }

    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        // redirect to home
        console.log(response);
        if (response.ok) this.router.navigate(['dashboard']);
        else this.err_msg = response.err_msg;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
