import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../models/product';
import { ProductCreateDto } from '../../models/product-create';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private api = 'http://localhost:5122/api/products';

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Product[]>(this.api);
  }

  add(product: ProductCreateDto) {
    return this.http.post(this.api, product);
  }

  update(id: number, product: Partial<Product>) {
    return this.http.put(`${this.api}/${id}`, product);
  }

  reactivate(id: number) {
    return this.http.put(`${this.api}/${id}/reactivate`, {});
  }

  deactivate(id: number) {
    return this.http.put(`${this.api}/${id}/deactivate`, {});
  }

}
