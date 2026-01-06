import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

import { WarehouseService } from '../../../services/admin/warehouse-service';
import { Warehouse } from '../../../models/warehouse';
import { WarehouseStock } from '../../../models/warehouse-stock';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/admin/product-service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  standalone: true,
  selector: 'app-warehouses',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './warehouses.html',
  styleUrl: './warehouses.css'
})

export class Warehouses implements OnInit, AfterViewInit {

  displayedColumns = ['id', 'name', 'location', 'actions'];
  dataSource = new MatTableDataSource<Warehouse>();

  stockColumns = ['productId', 'productName', 'stockQuantity'];
  stockDataSource = new MatTableDataSource<WarehouseStock>();

  selectedWarehouse: Warehouse | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('drawer') drawer!: MatDrawer;

  isMobile = false;
  loading = false;
  products: Product[] = [];


  warehouseForm = new FormGroup({
    name: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required)
  });

  assignForm = new FormGroup({
    productId: new FormControl<number | null>(null, Validators.required),
    stockQuantity: new FormControl(1, [Validators.required, Validators.min(1)])
  });

  constructor(
    private service: WarehouseService,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource.filterPredicate = this.filterPredicate;
  }

  ngOnInit() {
    this.isMobile = window.innerWidth <= 768;
    this.loadWarehouses();
    this.loadProducts();
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.sort.active = 'id';
    this.sort.sortChange.emit();
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }


  loadWarehouses() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load warehouses', 'Close', {
          duration: 3000
        });
      }
    });
  }

  getProductName(productId: number | null): string {
    return this.products.find(p => p.id === productId)?.name ?? '—';
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: data =>
        this.products = data
          .filter(p => p.isActive)
          .sort((a, b) => a.name.localeCompare(b.name)),
      error: () =>
        this.snackBar.open('Failed to load products', 'Close', {
          duration: 3000
        })
    });
  }


  loadStock(warehouseId: number) {
    this.service.getStock(warehouseId).subscribe({
      next: data => {
        this.stockDataSource.data = data;
      },
      error: () => {
        this.snackBar.open('Failed to load stock', 'Close', {
          duration: 3000
        });
      }
    });
  }

  filterPredicate = (data: Warehouse, filter: string) => {
    const text = `
      ${data.id}
      ${data.name}
      ${data.location}
    `.toLowerCase();

    return text.includes(filter);
  };

  // search

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.dataSource.filter = value;
    this.paginator.firstPage();
  }

  // drawer helpers

  openCreate() {
    this.selectedWarehouse = null;
    this.warehouseForm.reset();
    this.drawer.open();
  }

  openManage(w: Warehouse) {
    this.selectedWarehouse = w;
    this.assignForm.reset({ stockQuantity: 1 });
    this.loadStock(w.id);
    this.drawer.open();
  }

  closeDrawer() {
    this.drawer.close();
    this.selectedWarehouse = null;
    this.stockDataSource.data = [];
  }

  // actions

  createWarehouse() {
    if (this.warehouseForm.invalid) return;

    this.service.create(this.warehouseForm.value as any).subscribe({
      next: () => {
        this.snackBar.open('Warehouse created', 'Close', { duration: 2000 });
        this.closeDrawer();
        this.loadWarehouses();
      },
      error: () => {
        this.snackBar.open('Failed to create warehouse', 'Close', {
          duration: 3000
        });
      }
    });
  }

  assignProduct() {
    if (!this.selectedWarehouse || this.assignForm.invalid) return;

    this.service.assignProduct({
      warehouseId: this.selectedWarehouse.id,
      productId: this.assignForm.value.productId!,
      stockQuantity: this.assignForm.value.stockQuantity!
    }).subscribe({
      next: () => {
        this.snackBar.open('Stock updated', 'Close', { duration: 2000 });
        this.assignForm.reset({ stockQuantity: 1 });
        this.loadStock(this.selectedWarehouse!.id);
      },
      error: err => {
        const message =
          err?.error?.message ?? 'Stock assignment failed';

        this.snackBar.open(message, 'Close', { duration: 4000 });
      }
    });
  }

  resetWarehouseForm() {
    this.warehouseForm.reset();
  }

  resetAssignForm() {
    this.assignForm.reset({
      stockQuantity: 1
    });
  }

}
