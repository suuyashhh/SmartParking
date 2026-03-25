import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../sidebar.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  sidebarService = inject(SidebarService);

  toggleMenu() {
    this.sidebarService.toggle();
  }

  navItems = [
    { icon: 'home', label: 'Home', active: true, link: '/Parking/dashboard' },
    { icon: 'menu', label: 'Menu', active: false, action: true },
    { icon: 'shopping_bag', label: 'Orders', active: false, link: '/Parking/parking-provider' },
    { icon: 'person', label: 'Account', active: false }
  ];
}
