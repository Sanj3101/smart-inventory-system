import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FinanceOrder } from '../../models/finance-order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = 'http://localhost:5122/api/orders';

  constructor(private http: HttpClient) {
    console.log('Finance OrderService loaded');
   }

  getOrders(): Observable<FinanceOrder[]> {
    return this.http.get<FinanceOrder[]>(`${this.baseUrl}/finance`);
  }

  approve(orderId: number) {
    return this.http.put(`${this.baseUrl}/${orderId}/approve`, {});
  }
  
  getInvoice(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${orderId}/invoice`);
  }

}
