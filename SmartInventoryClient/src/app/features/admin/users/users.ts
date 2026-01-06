import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  HostListener
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
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

import { WarehouseService } from '../../../services/admin/warehouse-service';
import { UserService } from '../../../services/admin/user-service';
import { User } from '../../../models/user';
import { Warehouse } from '../../../models/warehouse';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: 'app-users',
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
    MatSelectModule,
    MatSidenavModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit, AfterViewInit {

  displayedColumns = ['email', 'role', 'warehouseId', 'actions'];
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('drawer') drawer!: MatDrawer;

  isMobile = false;
  loading = false;
  warehouses: Warehouse[] = [];
  selectedUser: User | null = null;

  userForm = new FormGroup({
    role: new FormControl('', Validators.required),
    warehouseId: new FormControl<number | null>(null)
  });

  roles = [
    'Customer',
    'WarehouseManager',
    'SalesExecutive',
    'FinanceOfficer',
    'Admin'
  ];

  constructor(
    private service: UserService,
    private warehouseService: WarehouseService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource.filterPredicate = this.filterPredicate;

    this.dataSource.sortingDataAccessor = (item: any, property) => {
      const value = item[property];
      return typeof value === 'string' ? value.toLowerCase() : value;
    };
  }


  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 768;
    this.load();
    this.loadWarehouses();

    this.userForm.get('role')!.valueChanges.subscribe(role => {
      const warehouseCtrl = this.userForm.get('warehouseId')!;
      if (role === 'WarehouseManager') {
        warehouseCtrl.setValidators([Validators.required, Validators.min(1)]);
      } else {
        warehouseCtrl.clearValidators();
        warehouseCtrl.setValue(null);
      }
      warehouseCtrl.updateValueAndValidity();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.sort.active = 'email';
    this.sort.direction = 'asc';
    this.sort.sortChange.emit();
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  load() {
    this.loading = true;

    this.service.getAll().subscribe({
      next: users => {
        this.dataSource.data = users;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load users', 'Close', {
          duration: 3000
        });
      }
    });
  }

  private loadWarehouses() {
    this.warehouseService.getAll().subscribe({
      next: w => (this.warehouses = w),
      error: () =>
        this.snackBar.open('Failed to load warehouses', 'Close', { duration: 3000 })
    });
  }

  filterPredicate = (user: User, filter: string): boolean => {
    const text = `
      ${user.email}
      ${user.role}
      ${user.warehouseId ?? ''}
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

  /* ================= DRAWER ================= */

  openEdit(user: User) {
    this.selectedUser = user;
    this.userForm.patchValue({
      role: user.role ?? '',
      warehouseId: user.warehouseId ?? null
    });
    this.drawer.open();
  }

  closeDrawer() {
    this.drawer.close();
    this.selectedUser = null;
    this.userForm.reset();
  }

  submit() {
    if (!this.selectedUser || this.userForm.invalid) return;

    this.service.updateRole(this.selectedUser.id, {
      role: this.userForm.value.role!,
      warehouseId: this.userForm.value.warehouseId
    }).subscribe({
      next: () => {
        this.snackBar.open('User updated successfully', 'Close', {
          duration: 2000
        });
        this.closeDrawer();
        this.load();
      },
      error: err => {
        this.snackBar.open(err.error || 'Update failed', 'Close', {
          duration: 3000
        });
      }
    });
  }
}
