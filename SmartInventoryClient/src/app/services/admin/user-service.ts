import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'http://localhost:5122/api/admin/users';

  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }
  
  updateRole(
    userId: string,
    payload: { role: string; warehouseId?: number | null }
  ) {
    return this.http.put(`${this.baseUrl}/${userId}/role`, payload);
  }

  assignWarehouse(userId: string, warehouseId: number) {
    return this.http.put(`${this.baseUrl}/${userId}/assign-warehouse`, {
      warehouseId
    });
  }
}
