import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-parking-provider',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parking-provider.component.html',
  styleUrl: './parking-provider.component.css'
})
export class ParkingProviderComponent implements OnInit {
  isModalOpen = false;

  parkingData = {
    latitude: '',
    longitude: '',
    images: [] as string[],
    rate: null,
    contactNumber: '',
    address: '',
    vehicleType: '2' // '2' for 2-wheeler, '4' for 4-wheeler
  };

  ngOnInit() {}

  openModal() {
    this.isModalOpen = true;
    this.getLocation();
  }

  closeModal() {
    this.isModalOpen = false;
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.parkingData.latitude = position.coords.latitude.toString();
          this.parkingData.longitude = position.coords.longitude.toString();
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  onImageUpload(event: any) {
    const files = event.target.files;
    if (files) {
      const remainingSlots = 4 - this.parkingData.images.length;
      const filesToProcess = Math.min(files.length, remainingSlots);
      
      for (let i = 0; i < filesToProcess; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.parkingData.images.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {
    this.parkingData.images.splice(index, 1);
  }

  submitForm() {
    console.log('Form Submitted', this.parkingData);
    this.closeModal();
    // Further processing
  }
}
