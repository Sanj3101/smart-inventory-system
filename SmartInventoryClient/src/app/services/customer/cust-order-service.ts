import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerOrderService {

  private baseUrl = 'http://localhost:5122/api/orders';

  constructor(private http: HttpClient) { }

  // Place order (payment assumed at placement)
  placeOrder(dto: {
    items: { productId: number; quantity: number }[]
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}`, dto);
  }

  // View my orders
  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/created-by-me`);
  }

  // Cancel order
  cancelOrder(orderId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${orderId}/cancel`, {});
  }

  // Invoice (after shipped)
  getInvoice(orderId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${orderId}/invoice`);
  }
}
