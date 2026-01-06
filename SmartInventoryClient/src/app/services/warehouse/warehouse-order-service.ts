import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WarehouseOrder } from '../../models/warehouse-order';

@Injectable({
  providedIn: 'root',
})
export class WarehouseOrderService {

  private readonly baseUrl = 'http://localhost:5122/api/orders';

  constructor(private http: HttpClient) {
    console.log('WarehouseOrderService loaded');
  }


  getWarehouseOrders(): Observable<WarehouseOrder[]> {
    return this.http.get<WarehouseOrder[]>(`${this.baseUrl}/warehouse`);
  }

  approveOrder(orderId: number): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/${orderId}/approve`,
      {}
    );
  }

  packOrder(orderId: number): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/${orderId}/pack`,
      {}
    );
  }

  shipOrder(orderId: number): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/${orderId}/ship`,
      {}
    );
  }

  deliverOrder(orderId: number): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/${orderId}/deliver`,
      {}
    );
  }
}
