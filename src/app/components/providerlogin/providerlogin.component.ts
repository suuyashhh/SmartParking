import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-providerlogin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './providerlogin.component.html',
  styleUrl: './providerlogin.component.css'
})
export class ProviderloginComponent {
  loginData = {
    email: '',
    password: ''
  };

  constructor(private router: Router) {}

  onLogin() {
    console.log('Login attempt:', this.loginData);
    // Add authentication logic here
    // On success: this.router.navigate(['/Parking/dashboard']);
  }

  goBack() {
    this.router.navigate(['/Parking/account']);
  }
}
