import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-sales-by-product-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './sales-by-product-table.html',
  styleUrl: './sales-by-product-table.css'
})
export class SalesByProductTable {

  @Input() data: any[] = [];

  displayedColumns = ['product', 'quantity', 'revenue'];
}
