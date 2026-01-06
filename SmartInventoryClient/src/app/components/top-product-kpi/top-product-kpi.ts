import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-top-products-kpi',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './top-product-kpi.html',
  styleUrl: './top-product-kpi.css'
})
export class TopProductsKpi {
  @Input() data: any[] = [];
}
