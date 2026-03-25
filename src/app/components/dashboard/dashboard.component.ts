import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarService } from '../../Shared/sidebar.service';

declare const L: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  sidebarService = inject(SidebarService);

  searchQuery: string = '';
  isDirectionsMode: boolean = false;
  
  private map: any;
  private currentMarker: any;
  private routeLayer: any;
  private defaultParkingIcon: any;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    // Init map with Kolhapur coords as default or any center
    this.map = L.map('map').setView([18.5204, 73.8567], 14);

    // Add free OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Initial Parking Spot Marker
    this.defaultParkingIcon = L.icon({
      // We use a safe external fallback for the icon just like Zomato/Swiggy pin
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3005/3005355.png', 
      iconSize: [38, 38]
    });

    L.marker([18.5204, 73.8567], { icon: this.defaultParkingIcon })
      .addTo(this.map)
      .bindPopup('<b>Parking Slot A1</b><br>Available: Yes');

    this.getCurrentLocation();
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  onSearch() {
    this.isDirectionsMode = false;
    
    // Clear previous generic routes if searching new
    if (this.routeLayer) {
        this.map.removeLayer(this.routeLayer);
    }

    if (!this.searchQuery.trim()) return;

    // Nominatim Geocoding API
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(this.searchQuery)}&format=json`)
      .then(r => r.json())
      .then(data => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          this.map.flyTo([lat, lon], 15);
          
          if (this.currentMarker) {
            this.map.removeLayer(this.currentMarker);
          }
          this.currentMarker = L.marker([lat, lon]).addTo(this.map).bindPopup(data[0].display_name).openPopup();
        } else {
          alert("Location not found.");
        }
      })
      .catch(e => console.error("Search error", e));
  }

  getDirections() {
      // Use OSRM for generic routing from center to Kolhapur default parking
      if (!this.currentMarker) return;
      this.isDirectionsMode = true;

      // From User Location to our Default Parking:
      const destLat = 18.5204;
      const destLon = 73.8567;
      
      const startLat = this.currentMarker.getLatLng().lat;
      const startLon = this.currentMarker.getLatLng().lng;

      fetch(`https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${destLon},${destLat}?overview=full&geometries=geojson`)
        .then(r => r.json())
        .then(data => {
            if (this.routeLayer) {
              this.map.removeLayer(this.routeLayer);
            }
            if (data.routes && data.routes.length > 0) {
               this.routeLayer = L.geoJSON(data.routes[0].geometry, {
                  style: { color: '#1a73e8', weight: 5, opacity: 0.8 }
               }).addTo(this.map);

               this.map.fitBounds(this.routeLayer.getBounds(), { padding: [50, 50] });
            }
        }).catch(err => {
            console.error("OSRM Route Error", err);
            alert("Could not fetch route right now.");
        });
  }

  getCurrentLocation() {
    this.map.locate({ setView: true, maxZoom: 16 });

    // Handle user location success
    this.map.on('locationfound', (e: any) => {
        if (this.currentMarker) {
            this.map.removeLayer(this.currentMarker);
        }
        
        // Marker for user's Current Location
        this.currentMarker = L.marker(e.latlng).addTo(this.map).bindPopup('<b>You are here</b><br>Your Live Location').openPopup();
    });

    // Handle user location denied or failed
    this.map.on('locationerror', (e: any) => {
      console.warn("Could not find location", e.message);
    });
  }

  zoomIn() {
    this.map.zoomIn();
  }

  zoomOut() {
    this.map.zoomOut();
  }
}
