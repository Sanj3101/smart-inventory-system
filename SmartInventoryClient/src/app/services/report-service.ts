import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private baseUrl = 'http://localhost:5122/api/reports';

  constructor(private http: HttpClient) { }

  getSalesByDate(from: Date, to: Date): Observable<any[]> {
    const params = new HttpParams()
      .set('from', from.toISOString())
      .set('to', to.toISOString());

    return this.http.get<any[]>(`${this.baseUrl}/sales/by-date`, { params });
  }

  getSalesByProduct(from: Date, to: Date): Observable<any[]> {
    const params = new HttpParams()
      .set('from', from.toISOString())
      .set('to', to.toISOString());

    return this.http.get<any[]>(`${this.baseUrl}/sales/by-product`, { params });
  }

  getInventory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/inventory`);
  }

  getTopProducts(limit = 5): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/top-products?limit=${limit}`);
  }


}
