import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomerOrderService } from '../../../services/customer/cust-order-service';
import { OrderStatus } from '../../../models/order-status';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceDialog } from '../../finance/invoice-dialog/invoice-dialog';
import { AuthService } from '../../../services/auth-service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule
  ],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css'
})
export class MyOrders implements OnInit, AfterViewInit {

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();
  OrderStatus = OrderStatus;
  isSalesExec = false;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('drawer') drawer!: MatDrawer;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  selectedOrder: any = null;

  constructor(
    private service: CustomerOrderService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.isSalesExec = this.auth.hasRole('SalesExecutive');

    this.displayedColumns = this.isSalesExec
      ? ['id', 'customer', 'date', 'status', 'actions']
      : ['id', 'date', 'status', 'actions'];

    this.load();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


  load() {
    this.service.getMyOrders().subscribe(res => {
      this.dataSource.data = res;

      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'id':
            return item.id;

          case 'date':
            return new Date(item.createdAt);

          default:
            return item.id;
        }
      };


      // Search across useful fields
      this.dataSource.filterPredicate = (data, filter) => {
        const text = `
          ${data.id}
          ${data.customer?.email ?? ''}
          ${OrderStatus[data.status]}
        `.toLowerCase();

        return text.includes(filter);
      };

      this.cdr.detectChanges();
    });
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  

  openDetails(order: any) {
    this.selectedOrder = order;
    this.drawer.open();
  }

  cancel(order: any) {
    if (!confirm(`Cancel Order #${order.id}? This cannot be undone.`)) return;

    this.service.cancelOrder(order.id).subscribe(() => {
      order.status = OrderStatus.Cancelled;
      this.snack.open('Order cancelled', 'Close', { duration: 2500 });
    });
  }

  cancelFromDrawer() {
    if (!this.selectedOrder) return;
    this.cancel(this.selectedOrder);
    this.drawer.close();
  }

  viewInvoice(orderId: number) {
    this.service.getInvoice(orderId).subscribe({
      next: invoice =>
        this.dialog.open(InvoiceDialog, { width: '700px', data: invoice }),
      error: () =>
        this.snack.open('Failed to load invoice', 'Close', { duration: 3000 })
    });
  }

  canCancel(o: any) {
    return o.status !== OrderStatus.Cancelled &&
      o.status !== OrderStatus.Shipped;
  }

  isCancelled(o: any) {
    return o.status === OrderStatus.Cancelled;
  }
}
