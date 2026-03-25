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
  private userMarker: any = null;
  private destinationMarker: any = null;
  private routeLayer: any = null;
  private defaultParkingIcon: any;
  private userLocation: { lat: number, lng: number } | null = null;

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
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3005/3005355.png', 
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38]
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
    
    // Clear previous generic routes
    if (this.routeLayer) {
        this.map.removeLayer(this.routeLayer);
        this.routeLayer = null;
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
          
          if (this.destinationMarker) {
            this.map.removeLayer(this.destinationMarker);
          }
          this.destinationMarker = L.marker([lat, lon]).addTo(this.map).bindPopup(data[0].display_name).openPopup();
        } else {
          alert("Location not found.");
        }
      })
      .catch(e => console.error("Search error", e));
  }

  getDirections() {
      if (!this.destinationMarker) {
         alert("Please search for a destination first!");
         return;
      }
      if (!this.userLocation) {
         alert("Your live location is not available. Please allow location access or click the 'My Location' button.");
         return;
      }

      this.isDirectionsMode = true;

      // Destination:
      const destLat = this.destinationMarker.getLatLng().lat;
      const destLon = this.destinationMarker.getLatLng().lng;
      
      // Start (Live User Location)
      const startLat = this.userLocation.lat;
      const startLon = this.userLocation.lng;

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
        this.userLocation = { lat: e.latlng.lat, lng: e.latlng.lng };

        if (this.userMarker) {
            this.map.removeLayer(this.userMarker);
        }
        
        // Custom user icon - explicitly smaller with different URL so it looks like a person pos
        const userIcon = L.icon({
           iconUrl: 'https://cdn-icons-png.flaticon.com/512/7133/7133312.png',
           iconSize: [40, 40],
           iconAnchor: [20, 20]
        });

        // Marker for user's Current Location
        this.userMarker = L.marker(e.latlng, { icon: userIcon })
           .addTo(this.map)
           .bindPopup('<b>You are here</b>').openPopup();
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

