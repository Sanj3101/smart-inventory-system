import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../models/notification';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private baseUrl = 'http://localhost:5122/api/notifications';

  // global unread count state
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) { }

  // -------- API calls --------

  getMyNotifications() {
    return this.http.get<Notification[]>(this.baseUrl);
  }

  fetchUnreadCount() {
    return this.http
      .get<{ count: number }>(`${this.baseUrl}/unread-count`)
      .subscribe({
        next: res => this.unreadCountSubject.next(res.count),
        error: () => this.unreadCountSubject.next(0)
      });
  }


  markAsRead(id: number) {
    return this.http.put(`${this.baseUrl}/${id}/read`, {});
  }

  markAllAsRead() {
    return this.http.put(`${this.baseUrl}/read-all`, {});
  }

  // -------- helpers --------

  decrementUnread() {
    const current = this.unreadCountSubject.value;
    this.unreadCountSubject.next(Math.max(0, current - 1));
  }

  resetUnread() {
    this.unreadCountSubject.next(0);
  }
}
