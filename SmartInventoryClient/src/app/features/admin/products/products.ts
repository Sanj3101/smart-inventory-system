import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../../services/admin/product-service';
import { Product } from '../../../models/product';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/admin/category-service';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: 'app-products',
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
    MatCheckboxModule,
    MatSidenavModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit, AfterViewInit {

  displayedColumns = [
    'id',
    'name',
    'price',
    'category',
    'isActive',
    'actions'
  ];

  dataSource = new MatTableDataSource<Product>();
  selectedProduct: Product | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('drawer') drawer!: MatDrawer;

  isMobile = false;
  loading = false;
  categories: Category[] = [];


  productForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    categoryId: new FormControl<number | null>(null, Validators.required),
    isActive: new FormControl(true)
  });

  constructor(
    private service: ProductService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource.filterPredicate = this.filterPredicate;
  }

  ngOnInit() {
    this.isMobile = window.innerWidth <= 768;
    this.load();
    this.loadCategories();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.sort.active = 'id';
    this.sort.direction = 'desc';
    this.sort.sortChange.emit();
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  load() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load products', 'Close', { duration: 3000 });
      }
    });
  }

  getCategoryName(categoryId: number | null): string {
    return this.categories.find(c => c.id === categoryId)?.name ?? '—';
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: data => (this.categories = data),
      error: () =>
        this.snackBar.open('Failed to load categories', 'Close', {
          duration: 3000
        })
    });
  }


  filterPredicate = (data: Product, filter: string) => {
    const text = `
      ${data.id}
      ${data.name}
      ${data.category}
      ${data.price}
      ${data.isActive ? 'active' : 'inactive'}
    `.toLowerCase();

    return text.includes(filter);
  };

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.dataSource.filter = value;
    this.paginator.firstPage();
  }


  openAdd() {
    this.selectedProduct = null;
    this.productForm.reset({
      price: 0,
      categoryId: 0,
      isActive: true
    });
    this.drawer.open();
  }

  openEdit(product: Product) {
    this.selectedProduct = product;
    this.productForm.patchValue({
      ...product,
      categoryId: product.categoryId
    });
    this.drawer.open();
  }

  closeDrawer() {
    this.drawer.close();
    this.selectedProduct = null;
  }

  submit() {
    if (this.productForm.invalid) return;

    const payload = this.productForm.value as any;

    if (this.selectedProduct) {
      this.service.update(this.selectedProduct.id, payload).subscribe({
        next: () => {
          this.snackBar.open('Product updated', 'Close', { duration: 2000 });
          this.closeDrawer();
          this.load();
        }
      });
    } else {
      this.service.add(payload).subscribe({
        next: () => {
          this.snackBar.open('Product added', 'Close', { duration: 2000 });
          this.closeDrawer();
          this.load();
        }
      });
    }
  }

  deactivate(id: number) {
    if (!confirm('Deactivate this product?')) return;

    this.service.deactivate(id).subscribe({
      next: () => {
        this.snackBar.open('Product disabled', 'Close', { duration: 2000 });
        this.load();
      }
    });
  }

  reactivate(id: number) {
    this.service.reactivate(id).subscribe({
      next: () => {
        this.snackBar.open('Product enabled', 'Close', { duration: 2000 });
        this.load();
      }
    });
  }
}
