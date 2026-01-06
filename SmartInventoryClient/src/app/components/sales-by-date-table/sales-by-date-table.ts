import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-sales-by-date-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './sales-by-date-table.html',
  styleUrl: './sales-by-date-table.css'
})
export class SalesByDateTable implements OnChanges {

  @Input() data: any[] = [];

  displayedColumns = ['date', 'quantity', 'revenue'];

  ngOnChanges() {
  }
}
