import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';

import { ReportsService } from '../../services/report-service';
import { SalesByDateTable } from '../../components/sales-by-date-table/sales-by-date-table';
import { SalesByProductTable } from '../../components/sales-by-product-table/sales-by-product-table';
import { SalesByDateChart } from '../../components/sales-by-date-chart/sales-by-date-chart';
import { SalesByProductChart } from '../../components/sales-by-product-chart/sales-by-product-chart';
import { TopProductsKpi } from "../../components/top-product-kpi/top-product-kpi";
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    SalesByProductTable,
    SalesByDateTable,
    SalesByDateChart,
    SalesByProductChart,
    TopProductsKpi,
    MatSelectModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class ReportsComponent implements OnInit {
  form: FormGroup;

  salesByDate: any[] = [];
  salesByProduct: any[] = [];
  topProducts: any[] = [];

  salesByProductRaw: any[] = [];
  salesByProductChart: any[] = [];

  topN = 10;


  constructor(
    private fb: FormBuilder,
    private reportsService: ReportsService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      range: ['last30'],
      from: [],
      to: []
    });
  }

  ngOnInit(): void {
    this.setLast30Days();
    this.loadTopProducts();
    this.cdr.detectChanges();

  }


  setLast7Days() {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 7);

    this.applyPreset('last7', from, to);
  }

  setLast30Days() {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 30);

    this.applyPreset('last30', from, to);
  }

  setThisMonth() {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);

    this.applyPreset('thisMonth', from, now);
  }

  setCustomRange() {
    this.form.patchValue({ range: 'custom' });
  }

  private applyPreset(range: string, from: Date, to: Date) {
    this.form.patchValue({ range, from, to });
    this.applyFilters();
  }

  private loadTopProducts() {
    this.reportsService
      .getTopProducts()
      .subscribe(d => { this.topProducts = d; this.cdr.detectChanges(); });
  }

  private buildTopNChartData(data: any[]) {
    const sorted = [...data].sort((a, b) => b.revenue - a.revenue);

    const top = sorted.slice(0, this.topN);

    const others = sorted.slice(this.topN).reduce(
      (acc, p) => {
        acc.revenue += p.revenue;
        acc.quantity += p.quantity;
        return acc;
      },
      { productName: 'Others', revenue: 0, quantity: 0 }
    );

    this.salesByProductChart =
      sorted.length > this.topN ? [...top, others] : top;
  }


  applyFilters() {
    const { from, to } = this.form.value;
    if (!from || !to) return;

    this.reportsService.getSalesByDate(from, to)
      .subscribe(d => { this.salesByDate = d; this.cdr.detectChanges(); });

    this.reportsService.getSalesByProduct(from, to)
      .subscribe(d => {
        this.salesByProduct = d;
        this.salesByProductRaw = d;
        this.buildTopNChartData(d);
        this.cdr.detectChanges();
      });
  }

  onTopNChange(n: number) {
    this.topN = n;
    this.buildTopNChartData(this.salesByProductRaw);
  }

}
