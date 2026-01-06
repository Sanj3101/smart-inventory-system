import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';

import { OrderService } from '../../../services/finance/order-service';
import { FinanceOrder } from '../../../models/finance-order';
import { OrderStatus } from '../../../models/order-status';
import { InvoiceDialog } from '../invoice-dialog/invoice-dialog';
import { MatDividerModule } from "@angular/material/divider";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSnackBarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatDividerModule
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit, AfterViewInit {
  displayedColumns = [
    'id',
    'customerEmail',
    'status',
    'paid',
    'createdAt',
    'actions',
    'expand',
  ];

  dataSource = new MatTableDataSource<FinanceOrder>();
  OrderStatus = OrderStatus;

  loading = false;
  isMobile = false;

  selectedOrder: FinanceOrder | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('drawer') drawer!: MatDrawer;

  constructor(
    private service: OrderService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.dataSource.filterPredicate = this.filterPredicate;

    this.dataSource.sortingDataAccessor = (
      item: FinanceOrder,
      property: string
    ) => {
      switch (property) {
        case 'customerEmail':
          return item.customerEmail?.toLowerCase() ?? '';

        case 'createdAt':
          return new Date(item.createdAt).getTime();

        case 'status':
          return OrderStatus[item.status];

        default:
          return (item as any)[property];
      }
    };
  }

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 768;
    this.load();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Default sort
    this.sort.active = 'createdAt';
    this.sort.direction = 'desc';
    this.sort.sortChange.emit();
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  load() {
    this.loading = true;
    this.selectedOrder = null;

    this.service.getOrders().subscribe({
      next: orders => {
        console.log(orders);
        this.dataSource.data = orders;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load orders', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  /* ============================
     FILTER
  ============================ */
  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.dataSource.filter = value;
    this.dataSource.paginator?.firstPage();
  }

  filterPredicate = (data: FinanceOrder, filter: string): boolean => {
    const text = `
      ${data.id}
      ${data.customerEmail}
      ${OrderStatus[data.status]}
      ${data.isPaid}
      ${new Date(data.createdAt).toISOString()}
      ${data.items.map(i => i.productName).join(' ')}
    `.toLowerCase();

    return text.includes(filter);
  };

  /* ============================
     DRAWER
  ============================ */
  openDetails(order: FinanceOrder) {
    this.selectedOrder = order;
    this.drawer.open();
  }

  closeDrawer() {
    this.drawer.close();
    this.selectedOrder = null;
  }

  /* ============================
     INVOICE
  ============================ */
  viewInvoice(orderId: number) {
    this.service.getInvoice(orderId).subscribe({
      next: invoice => {
        this.dialog.open(InvoiceDialog, {
          width: '700px',
          data: invoice,
        });
      },
      error: () => {
        this.snackBar.open('Failed to load invoice', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  /* ============================
     STATUS HELPERS
  ============================ */
  getStatusLabel(status: OrderStatus): string {
    return OrderStatus[status];
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.Created:
        return 'status-created';
      case OrderStatus.Approved:
        return 'status-approved';
      case OrderStatus.Packed:
        return 'status-packed';
      case OrderStatus.Shipped:
        return 'status-shipped';
      case OrderStatus.Delivered:
        return 'status-delivered';
      case OrderStatus.Cancelled:
        return 'status-cancelled';
      default:
        return '';
    }
  }
}
