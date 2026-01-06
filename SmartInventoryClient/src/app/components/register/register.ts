import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  email = '';
  password = '';
  confirmPassword = '';

  error = '';
  success = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  register() {

    this.error = '';
    this.success = '';

    if (!this.email || !this.password || !this.confirmPassword) {
      this.error = 'All fields are required.';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters long.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.loading = true;

    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        this.success = 'Account created successfully. Redirecting to login…';
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: () => {
        this.error = 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
