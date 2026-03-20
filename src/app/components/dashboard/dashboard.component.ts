import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarService } from '../../Shared/sidebar.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  sidebarService = inject(SidebarService);
  private sanitizer = inject(DomSanitizer);

  searchQuery: string = 'parking';
  currentZoom: number = 13;
  isDirectionsMode: boolean = false;
  
  mapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    `https://maps.google.com/maps?q=${this.searchQuery}&t=&z=${this.currentZoom}&ie=UTF8&iwloc=&output=embed`
  );

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  onSearch() {
    this.isDirectionsMode = false;
    this.updateMap();
  }

  updateMap() {
    const encodedQuery = encodeURIComponent(this.searchQuery);
    const baseUrl = this.isDirectionsMode 
      ? `https://maps.google.com/maps?saddr=My+Location&daddr=${encodedQuery}`
      : `https://maps.google.com/maps?q=${encodedQuery}`;
    
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${baseUrl}&t=&z=${this.currentZoom}&ie=UTF8&iwloc=&output=embed`
    );
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.searchQuery = `${lat},${lng}`;
        this.isDirectionsMode = false;
        this.updateMap();
      }, (error) => {
        console.error('Error getting location', error);
        alert('Could not get your location. Please check your browser permissions.');
      });
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }

  getDirections() {
    if (this.searchQuery.trim()) {
      this.isDirectionsMode = true;
      this.updateMap();
    }
  }

  zoomIn() {
    if (this.currentZoom < 21) {
      this.currentZoom++;
      this.updateMap();
    }
  }

  zoomOut() {
    if (this.currentZoom > 1) {
      this.currentZoom--;
      this.updateMap();
    }
  }
}
