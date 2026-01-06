import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { ReportsService } from '../../../services/report-service';
import { WarehouseOrderService } from '../../../services/warehouse/warehouse-order-service';
import { InventoryTable } from '../../../components/inventory-table/inventory-table';
import { OrderStatus } from '../../../models/order-status';
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'app-warehouse-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    InventoryTable,
    MatDivider
],
  templateUrl: './warehouse-reports.html',
  styleUrl: './warehouse-reports.css'
})
export class WarehouseReports implements OnInit {

  inventory: any[] = [];
  orders: any[] = [];

  // KPIs
  totalProducts = 0;
  lowStock = 0;
  outOfStock = 0;
  pendingOrders = 0;

  constructor(
    private reportsService: ReportsService,
    private orderService: WarehouseOrderService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadInventory();
    this.loadOrders();
  }

  private loadInventory() {
    this.reportsService.getInventory()
      .subscribe(data => {
        this.inventory = data;

        this.totalProducts = data.length;
        this.lowStock = data.filter(i => i.status === 'LowStock').length;
        this.outOfStock = data.filter(i => i.status === 'OutOfStock').length;
        this.cdr.detectChanges();
      });
  }

  private loadOrders() {
    this.orderService.getWarehouseOrders()
      .subscribe(data => {
        this.orders = data;
        console.log(data)
        this.pendingOrders = data.filter(o =>
          o.status != OrderStatus.Delivered && o.status != OrderStatus.Cancelled
        ).length;
        this.cdr.detectChanges();
      });
  }
}
