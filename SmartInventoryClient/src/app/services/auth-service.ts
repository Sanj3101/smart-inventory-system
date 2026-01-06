import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5122/api/auth';

  token = signal<string | null>(localStorage.getItem('token'));
  role = signal<string | null>(localStorage.getItem('role'));

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }

  register(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/register`, {
      email,
      password
    });
  }

  hasRole(expectedRole: string): boolean {
    return this.role() === expectedRole;
  }

  setSession(token: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    this.token.set(token);
    this.role.set(role);
  }

  getRedirectRouteByRole(role: string): string {
    switch (role) {
      case 'Admin': return '/admin';
      case 'Customer': return '/customer';
      case 'SalesExecutive': return '/sales';
      case 'WarehouseManager': return '/warehouse';
      case 'FinanceOfficer': return '/finance';
      default: return '/login';
    }
  }


  logout() {
    localStorage.clear();
    this.token.set(null);
    this.role.set(null);
  }

  isLoggedIn() {
    return !!this.token();
  }
  getToken(): string | null {
    return this.token();
  }

  getRole(): string | null {
    return this.role();
  }

}
