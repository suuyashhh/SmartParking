import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../Shared/sidebar/sidebar.component';
import { FooterComponent } from '../../Shared/footer/footer.component';
import { SidebarService } from '../../Shared/sidebar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, FooterComponent, CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  sidebarService = inject(SidebarService);

  get isSidebarOpen() {
    return this.sidebarService.isOpen;
  }
}
