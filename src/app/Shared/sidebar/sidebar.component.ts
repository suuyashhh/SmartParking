import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  sidebarService = inject(SidebarService);

  get isOpen() {
    return this.sidebarService.isOpen;
  }

  closeSidebar() {
    this.sidebarService.close();
  }

  activeTab: string = 'categories';

  categories = [
    { name: 'Performance Nutrition', hasSub: true },
    { name: 'Vitamins and Supplements', hasSub: true },
    { name: 'Health Food and Drinks', hasSub: true },
    { name: 'Workout Gear', hasSub: true }
  ];

  menuItems = [
    { icon: 'account_circle', name: 'My Account' },
    { icon: 'shopping_bag', name: 'My Orders' },
    { icon: 'verified', name: 'Authenticity' },
    { icon: 'storefront', name: 'Nutrabay Products' },
    { icon: 'local_offer', name: 'Offers' },
    { icon: 'favorite', name: 'Support' }
  ];
}
