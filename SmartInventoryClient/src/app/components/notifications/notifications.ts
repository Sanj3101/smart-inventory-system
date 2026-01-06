import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { NotificationService } from '../../services/notification-service';
import { Notification } from '../../models/notification';
import { MatIconModule } from "@angular/material/icon";

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit {

  notifications: Notification[] = [];
  loading = false;

  constructor(
    private notifService: NotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.notifService.getMyNotifications().subscribe({
      next: res => {
        this.notifications = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => this.loading = false
    });
  }

  open(n: Notification) {
    if (!n.isRead) {
      this.notifService.markAsRead(n.id).subscribe();
      n.isRead = true;
      this.notifService.decrementUnread();
    }

    if (n.orderId) {
      this.router.navigate(['/orders', n.orderId]);
    }
  }

  markRead(n: Notification, event: MouseEvent) {
    event.stopPropagation();

    if (n.isRead) return;

    this.notifService.markAsRead(n.id).subscribe(() => {
      n.isRead = true;
      this.notifService.fetchUnreadCount();
      this.cdr.detectChanges();
    });
  }


  markAllRead() {
    this.notifService.markAllAsRead().subscribe(() => {
      this.notifications.forEach(n => n.isRead = true);
      this.notifService.resetUnread();
    });
  }

  goBack() {
    window.history.back();
  }

}
