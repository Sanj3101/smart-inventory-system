import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { CustomerOrderService } from '../../../services/customer/cust-order-service';
import { OrderStatus } from '../../../models/order-status';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './customer-dashboard.html',
  styleUrl: './customer-dashboard.css'
})
export class CustomerDashboard implements OnInit {

  orders: any[] = [];

  totalOrders = 0;

  created = 0;
  approved = 0;
  packed = 0;
  shipped = 0;
  delivered = 0;
  cancelled = 0;

  OrderStatus = OrderStatus;

  constructor(
    private orderService: CustomerOrderService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders() {
    this.orderService.getMyOrders().subscribe(orders => {
      this.orders = orders;
      this.totalOrders = orders.length;

      this.created = orders.filter(o => o.status === OrderStatus.Created).length;
      this.approved = orders.filter(o => o.status === OrderStatus.Approved).length;
      this.packed = orders.filter(o => o.status === OrderStatus.Packed).length;
      this.shipped = orders.filter(o => o.status === OrderStatus.Shipped).length;
      this.delivered = orders.filter(o => o.status === OrderStatus.Delivered).length;
      this.cancelled = orders.filter(o => o.status === OrderStatus.Cancelled).length;
      this.cdr.detectChanges();
    });
  }
}
