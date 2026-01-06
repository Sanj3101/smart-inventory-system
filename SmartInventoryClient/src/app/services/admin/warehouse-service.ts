import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Warehouse } from '../../models/warehouse';
import { WarehouseStock } from '../../models/warehouse-stock';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  private baseUrl = 'http://localhost:5122/api/warehouses';

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Warehouse[]>(this.baseUrl);
  }

  create(payload: { name: string; location: string }) {
    return this.http.post(this.baseUrl, payload);
  }

  assignProduct(payload: {
    warehouseId: number;
    productId: number;
    stockQuantity: number;
  }) {
    return this.http.post(`${this.baseUrl}/assign`, payload);
  }

  getStock(warehouseId: number) {
  return this.http.get<WarehouseStock[]>(
    `${this.baseUrl}/${warehouseId}/stock`
  );
}
}
