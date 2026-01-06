import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { StockService } from '../../../services/warehouse/stock-service';
import { WarehouseStock } from '../../../models/warehouse-stock';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: 'app-stock',
  templateUrl: './stock.html',
  styleUrl: './stock.css',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltip
]
})
export class Stock implements OnInit {

  displayedColumns = ['productId', 'productName', 'stockQuantity', 'actions'];
  dataSource = new MatTableDataSource<WarehouseStock>();

  editingProductId: number | null = null;
  editedQuantity: number = 0;

  isMobile = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: StockService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 768;
    this.loadStock();

    this.dataSource.filterPredicate = (data, filter) => {
      const text = `
        ${data.productId}
        ${data.productName}
        ${data.stockQuantity}
      `.toLowerCase();

      return text.includes(filter);
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  loadStock() {
    this.service.getStock().subscribe({
      next: data => {
        this.dataSource.data = data;
      },
      error: err => {
        this.showError(err);
      }
    });
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.dataSource.filter = value;
    this.dataSource.paginator?.firstPage();
  }

  startEdit(stock: WarehouseStock) {
    this.editingProductId = stock.productId;
    this.editedQuantity = stock.stockQuantity;
  }

  cancelEdit() {
    this.editingProductId = null;
    this.editedQuantity = 0;
  }

  save(productId: number) {
    if (this.editedQuantity < 0) {
      this.snackBar.open('Quantity cannot be negative', 'Close', { duration: 3000 });
      return;
    }

    this.service.updateStock(productId, this.editedQuantity).subscribe({
      next: () => {
        this.snackBar.open('Stock updated successfully', 'Close', { duration: 2000 });
        this.cancelEdit();
        this.loadStock();
      },
      error: err => {
        this.showError(err);
      }
    });
  }

  private showError(err: any) {
    const message =
      err?.error?.message ??
      'Operation failed';

    this.snackBar.open(message, 'Close', { duration: 4000 });
  }
}
