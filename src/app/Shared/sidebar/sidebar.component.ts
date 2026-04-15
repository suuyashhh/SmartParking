import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../sidebar.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  sidebarService = inject(SidebarService);
  authService = inject(AuthService);

  get userName(): string {
    const user = this.authService.getCurrentUser();
    return user?.name || user?.NAME || 'Guest User';
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isOpen() {
    return this.sidebarService.isOpen;
  }

  closeSidebar() {
    this.sidebarService.close();
  }

  onLogout() {
    this.authService.logout();
    this.sidebarService.close();
  }

  activeTab: string = 'categories';

  categories = [
    { name: 'Performance Nutrition', hasSub: true },
    { name: 'Vitamins and Supplements', hasSub: true },
    { name: 'Health Food and Drinks', hasSub: true },
    { name: 'Login', hasSub: true, link: '/provider-login' }
  ];

  menuItems = [
    { icon: 'shopping_bag', name: 'My Orders' },
    { icon: 'verified', name: 'Authenticity' },
    { icon: 'storefront', name: 'Nutrabay Products' },
    { icon: 'local_offer', name: 'Offers' },
    { icon: 'favorite', name: 'Support' }
  ];
}
