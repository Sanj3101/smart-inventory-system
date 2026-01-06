import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

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

import { CategoryService } from '../../../services/admin/category-service';
import { Category } from '../../../models/category';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: 'app-categories',
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
    MatTooltip
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit, AfterViewInit {

  displayedColumns = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<Category>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('drawer') drawer!: MatDrawer;

  isMobile = false;
  loading = false;
  selectedCategory: Category | null = null;

  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  constructor(
    private service: CategoryService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource.filterPredicate = this.filterPredicate;
  }

  /* ================= INIT ================= */

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 768;
    this.load();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // default sort like Products
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
        this.snackBar.open('Failed to load categories', 'Close', {
          duration: 3000
        });
      }
    });
  }


  filterPredicate = (data: Category, filter: string) => {
    const text = `
      ${data.id}
      ${data.name}
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
    this.selectedCategory = null;
    this.categoryForm.reset();
    this.drawer.open();
  }

  openEdit(category: Category) {
    this.selectedCategory = category;
    this.categoryForm.patchValue({ name: category.name });
    this.drawer.open();
  }

  closeDrawer() {
    this.drawer.close();
    this.selectedCategory = null;
    this.categoryForm.reset();
  }

  submit() {
    if (this.categoryForm.invalid) return;

    const payload = { name: this.categoryForm.value.name! };

    const request$ = this.selectedCategory
      ? this.service.update(this.selectedCategory.id, payload)
      : this.service.add(payload.name);

    request$.subscribe({
      next: () => {
        this.snackBar.open(
          this.selectedCategory ? 'Category updated' : 'Category added',
          'Close',
          { duration: 2000 }
        );
        this.closeDrawer();
        this.load();
      },
      error: () => {
        this.snackBar.open('Operation failed', 'Close', {
          duration: 3000
        });
      }
    });
  }

  delete(category: Category) {
    if (!confirm(`Delete category "${category.name}"?`)) return;

    this.service.delete(category.id).subscribe({
      next: () => {
        this.snackBar.open('Category deleted', 'Close', { duration: 2000 });
        this.load();
      },
      error: () => {
        this.snackBar.open('Failed to delete category', 'Close', {
          duration: 3000
        });
      }
    });
  }
}
