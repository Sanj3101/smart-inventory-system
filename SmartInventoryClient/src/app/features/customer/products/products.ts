import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { ProductService } from '../../../services/admin/product-service';
import { CartService } from '../../../services/customer/cart-service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class CustProducts implements AfterViewInit {

  displayedColumns: string[] = [
    'name',
    'category',
    'price',
    'quantity',
    'actions'
  ];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  quantities: Record<number, number> = {};

  constructor(
    private productService: ProductService,
    private cart: CartService
  ) { }

  ngAfterViewInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll().subscribe(products => {
      this.dataSource.data = products;

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // case-insensitive sorting
      this.dataSource.sortingDataAccessor = (item, property) => {
        const value = item[property];
        return typeof value === 'string'
          ? value.toLowerCase()
          : value;
      };

      // search across all visible fields
      this.dataSource.filterPredicate = (data, filter) => {
        const text = `${data.name} ${data.category} ${data.price}`;
        return text.toLowerCase().includes(filter);
      };

      products.forEach(p => (this.quantities[p.id] = 1));
    });
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  increaseQty(id: number) {
    this.quantities[id]++;
  }

  decreaseQty(id: number) {
    if (this.quantities[id] > 1) {
      this.quantities[id]--;
    }
  }

  addToCart(product: any) {
    this.cart.add({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: this.quantities[product.id]
    });
  }
}
