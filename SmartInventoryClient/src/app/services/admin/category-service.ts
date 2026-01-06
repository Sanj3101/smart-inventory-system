import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  private api = 'http://localhost:5122/api/categories';

  constructor(private http: HttpClient) {}

  // GET all categories
  getAll() {
    return this.http.get<Category[]>(this.api);
  }

  // ADD category
  add(name: string) {
    return this.http.post(this.api, { name });
  }

  // UPDATE category
  update(id: number, data: Partial<Category>) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  // DELETE category
  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
