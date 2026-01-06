import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { UserService } from '../../../services/admin/user-service';
import { CategoryService } from '../../../services/admin/category-service';
import { ProductService } from '../../../services/admin/product-service';
import { WarehouseService } from '../../../services/admin/warehouse-service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  // KPI counts
  totalUsers = 0;
  admins = 0;
  warehouseUsers = 0;
  customers = 0;
  finance = 0;
  sales = 0;

  totalWarehouses = 0;
  totalProducts = 0;
  totalCategories = 0;

  constructor(
    private userService: UserService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadCategories();
    this.loadProducts();
    this.loadWarehouses();
  }

  private loadUsers() {
    this.userService.getAll().subscribe(users => {
      this.totalUsers = users.length;
      this.admins = users.filter(u => u.role === 'Admin').length;
      this.warehouseUsers = users.filter(u => u.role === 'WarehouseManager').length;
      this.customers = users.filter(u => u.role === 'Customer').length;
      this.finance = users.filter(u => u.role === 'FinanceOfficer').length;
      this.sales = users.filter(u => u.role === 'SalesExecutive').length;
      this.cdr.detectChanges();
    });
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe(c => {
      this.totalCategories = c.length;
      this.cdr.detectChanges();
    });
  }

  private loadProducts() {
    this.productService.getAll().subscribe(p => {
      this.totalProducts = p.length;
      this.cdr.detectChanges();
    });
  }

  private loadWarehouses() {
    this.warehouseService.getAll().subscribe(w => {
      this.totalWarehouses = w.length;
      this.cdr.detectChanges();
    });
  }
}
