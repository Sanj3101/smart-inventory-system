import { AfterViewInit, Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { WarehouseOrderService } from '../../../services/warehouse/warehouse-order-service';
import { WarehouseOrder } from '../../../models/warehouse-order';
import { MatDividerModule } from "@angular/material/divider";
import { OrderStatus } from '../../../models/order-status';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';


@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    MatTabsModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule

  ],
  selector: 'app-orders',
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class WarehouseOrders implements OnInit, AfterViewInit {

  @ViewChild('activePaginator') activePaginator!: MatPaginator;
  @ViewChild('donePaginator') donePaginator!: MatPaginator;

  @ViewChild('activeSort') activeSort!: MatSort;
  @ViewChild('doneSort') doneSort!: MatSort;

  @ViewChild('drawer') drawer!: MatDrawer;


  activeColumns = ['id', 'status', 'createdAt', 'actions', 'expand'];
  doneColumns = ['id', 'status', 'createdAt', 'badge', 'expand'];

  activeOrders = new MatTableDataSource<WarehouseOrder>();
  doneOrders = new MatTableDataSource<WarehouseOrder>();

  selectedOrder: WarehouseOrder | null = null;
  OrderStatus = OrderStatus;
  loading = false;
  isMobile = false;

  constructor(
    private service: WarehouseOrderService,
    private snackBar: MatSnackBar,
  ) {
    this.activeOrders.filterPredicate = this.filterPredicate;
    this.doneOrders.filterPredicate = this.filterPredicate;
  }

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 768;
    this.loadOrders();
  }

  ngAfterViewInit() {
    // Active
    this.activeOrders.paginator = this.activePaginator;
    this.activeOrders.sort = this.activeSort;

    // Completed
    this.doneOrders.paginator = this.donePaginator;
    this.doneOrders.sort = this.doneSort;

    // DEFAULT SORT
    this.activeSort.active = 'createdAt';
    this.activeSort.direction = 'desc';
    this.activeSort.sortChange.emit();

    this.doneSort.active = 'createdAt';
    this.doneSort.direction = 'desc';
    this.doneSort.sortChange.emit();
  }

  loadOrders() {
    this.loading = true;
    this.selectedOrder = null;

    this.service.getWarehouseOrders().subscribe({
      next: orders => {
        this.activeOrders.data = orders.filter(o =>
          o.status === OrderStatus.Created ||
          o.status === OrderStatus.Approved ||
          o.status === OrderStatus.Packed ||
          o.status === OrderStatus.Shipped
        );

        this.doneOrders.data = orders.filter(o =>
          o.status === OrderStatus.Delivered ||
          o.status === OrderStatus.Cancelled
        );

        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.showError(err);
      }
    });
    setTimeout(() => {
      this.activeOrders.sort = this.activeSort;
      this.activeOrders.paginator = this.activePaginator;

      this.doneOrders.sort = this.doneSort;
      this.doneOrders.paginator = this.donePaginator;
    });

  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  filterPredicate = (data: WarehouseOrder, filter: string): boolean => {
    const text = `
    ${data.id}
    ${OrderStatus[data.status]}
    ${new Date(data.createdAt).toISOString()}
    ${data.items.map(i => i.productName).join(' ')}
  `.toLowerCase();

    return text.includes(filter);
  };


  applyFilter(event: Event, type: 'active' | 'done') {
    const value = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (type === 'active') {
      this.activeOrders.filter = value;
      this.activeOrders.paginator?.firstPage();
    } else {
      this.doneOrders.filter = value;
      this.doneOrders.paginator?.firstPage();
    }
  }

  approve(orderId: number) {
    this.service.approveOrder(orderId).subscribe({
      next: () => {
        this.snackBar.open('Order approved', 'Close', { duration: 2000 });
        this.loadOrders();
      },
      error: err => this.showError(err)
    });
  }


  pack(orderId: number) {
    this.service.packOrder(orderId).subscribe({
      next: () => {
        this.snackBar.open('Order packed', 'Close', { duration: 2000 });
        this.loadOrders();
      },
      error: err => this.showError(err)
    });
  }

  ship(orderId: number) {
    const confirmed = confirm(
      'This will ship the order and deduct stock.\nThis action cannot be undone.\n\nProceed?'
    );

    if (!confirmed) return;

    this.service.shipOrder(orderId).subscribe({
      next: () => {
        this.snackBar.open('Order shipped', 'Close', { duration: 2000 });
        this.loadOrders();
      },
      error: err => this.showError(err)
    });
  }

  deliver(orderId: number) {
    const confirmed = confirm('Mark this order as delivered?');

    if (!confirmed) return;

    this.service.deliverOrder(orderId).subscribe({
      next: () => {
        this.snackBar.open('Order delivered', 'Close', { duration: 2000 });
        this.loadOrders();
      },
      error: err => this.showError(err)
    });
  }


  openDetails(order: WarehouseOrder) {
    this.selectedOrder = order;
    this.drawer.open();
  }

  closeDrawer() {
    this.drawer.close();
    this.selectedOrder = null;
  }

  onTabChange() {
    this.closeDrawer();
  }

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


  private showError(err: any) {
    const message =
      err?.error?.message ?? 'Operation failed';

    this.snackBar.open(message, 'Close', { duration: 4000 });
  }
}

