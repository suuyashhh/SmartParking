import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { AuthService } from '../../Shared/auth.service'; @Component({
  selector: 'app-provider-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './provider-login.component.html',
  styleUrls: ['./provider-login.component.css']
})
export class ProviderLoginComponent {
  private router = inject(Router);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = environment.BASE_URL;
  hidePassword = true;
  isEmailFocused = false;
  isPasswordFocused = false;
  isLoading = false;
  errorMessage = '';

  loginData = {
    phone: '',
    password: '',
    remember: true
  };

  currentYear = new Date().getFullYear();

  onLogin() {
    if (!this.loginData.phone || !this.loginData.password) {
      this.errorMessage = 'Please enter both phone and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const body = { PHONE: this.loginData.phone, PASS: this.loginData.password };

    this.http.post(`${this.baseUrl}ParkingLogin/login`, body).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Login successful:', response);

        if (response) {
          this.authService.setCurrentUser(response);
        }

        // Premium touch: small delay for visual feedback
        setTimeout(() => {
          this.router.navigate(['/Parking/dashboard']);
        }, 800);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'Invalid credentials. Please verify your phone and password.';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
        console.error('Auth error:', err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/Parking']);
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}

