import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  constructor(private router: Router) {}

  onLogin() {
    this.router.navigate(['/Parking/providerlogin']);
  }

  onRegister() {
    // Assuming register page will be handled here as well, or similar route.
    // For now, staying consistent with login.
  }
}
