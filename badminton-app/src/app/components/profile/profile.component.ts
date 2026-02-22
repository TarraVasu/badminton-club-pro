import { Component, OnInit } from '@angular/core';
import { DataService, Player } from '../../services/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: any = {};
  selectedFile: File | null = null;
  formError = '';

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getProfile().subscribe({
      next: (data) => {
        this.profile = { ...data };
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
  }

  saveProfile(): void {
    this.formError = '';
    if (!this.profile.name?.trim()) {
      this.formError = 'Name is required';
      return;
    }

    const formData = new FormData();
    Object.keys(this.profile).forEach(key => {
      if (this.profile[key] !== null && this.profile[key] !== undefined && key !== 'image') {
        formData.append(key, this.profile[key]);
      }
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.dataService.updateProfile(formData).subscribe({
      next: (updated) => {
        this.profile = { ...updated };
        this.selectedFile = null;
      },
      error: (err) => {
        this.formError = 'Failed to update profile. Please try again.';
        console.error('Error updating profile:', err);
      }
    });
  }
}
