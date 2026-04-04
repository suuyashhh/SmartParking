import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-provider-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './provider-login.component.html',
  styleUrl: './provider-login.component.css'
})
export class ProviderLoginComponent {
  hidePassword = true;
  isEmailFocused = false;
  isPasswordFocused = false;

  loginData = {
    email: '',
    password: '',
    remember: true
  };

  constructor(private router: Router) {}

  onLogin() {
    console.log('Provider login attempt:', this.loginData);
    this.router.navigate(['/Parking/dashboard']);
  }

  goBack() {
    this.router.navigate(['/Parking']);
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
