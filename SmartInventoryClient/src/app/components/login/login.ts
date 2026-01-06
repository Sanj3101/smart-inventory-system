import { ChangeDetectorRef, Component } from '@angular/core';
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
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notifService: NotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  login() {
    if (!this.email || !this.password) return;

    this.error = '';
    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: res => {
        this.authService.setSession(res.token, res.role);
        const route = this.authService.getRedirectRouteByRole(res.role);
        this.router.navigate([route]);
        this.notifService.fetchUnreadCount();
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Invalid email or password';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
