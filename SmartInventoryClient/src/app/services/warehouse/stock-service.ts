import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WarehouseStock } from '../../models/warehouse-stock';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private baseUrl = 'http://localhost:5122/api/warehouse-manager';

  constructor(private http: HttpClient) {}

  getStock(): Observable<WarehouseStock[]> {
    return this.http.get<WarehouseStock[]>(`${this.baseUrl}/stock`);
  }

  updateStock(productId: number, newQuantity: number) {
    return this.http.put(`${this.baseUrl}/stock`, {
      productId,
      newQuantity
    });
  }
}
