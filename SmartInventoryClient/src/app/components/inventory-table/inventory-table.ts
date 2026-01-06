import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-inventory-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './inventory-table.html',
  styleUrl: './inventory-table.css'
})
export class InventoryTable implements AfterViewInit, OnChanges {

  @Input() data: any[] = [];

  displayedColumns = ['product', 'quantity', 'status'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource.data = this.data || [];
      this.attachTableFeatures();
    }
  }

  ngAfterViewInit(): void {
    this.attachTableFeatures();
  }

  private attachTableFeatures() {
    if (!this.paginator || !this.sort) return;

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // sort
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'product':
          return item.productName?.toLowerCase();
        case 'quantity':
          return item.availableQuantity;
        case 'status':
          return item.status?.toLowerCase();
        default:
          return item[property];
      }
    };

    // filter
    this.dataSource.filterPredicate = (data, filter) => {
      const text = `
        ${data.productName}
        ${data.status}
        ${data.availableQuantity}
      `.toLowerCase();

      return text.includes(filter);
    };
  }

  // search
  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.dataSource.filter = value;
    this.dataSource.paginator?.firstPage();
  }
}
