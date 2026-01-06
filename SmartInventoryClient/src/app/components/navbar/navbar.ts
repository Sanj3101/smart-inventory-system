import { ChangeDetectorRef, Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { ROLE_MENUS, MenuItem } from './menu.config';
import { AuthService } from '../../services/auth-service';
import { NotificationService } from '../../services/notification-service';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  unreadCount = 0;

  isLoggedIn = computed(() => !!this.auth.token());

  menuItems = computed<MenuItem[]>(() => {
    const role = this.auth.role();
    return role ? ROLE_MENUS[role] ?? [] : [];
  });

  constructor(
    public auth: AuthService,
    private notifService: NotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.notifService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
      this.cdr.markForCheck();
    });

    this.notifService.fetchUnreadCount();
  }

  logout() {
    if (!confirm('Are you sure you want to logout?')) return;

    this.notifService.resetUnread();
    this.auth.logout();
    this.router.navigate(['/login']);
    this.cdr.detectChanges();
  }
}
