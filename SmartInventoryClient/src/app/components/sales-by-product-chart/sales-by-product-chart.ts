import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-sales-by-product-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './sales-by-product-chart.html',
  styleUrl: './sales-by-product-chart.css'
})
export class SalesByProductChart implements OnChanges {

  @Input() data: any[] = [];

  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 10,
        callbacks: {
          label: ctx => {
            const value = Number(ctx.raw || 0);
            return `Units sold: ${value.toLocaleString()}`;
          }
        }
      }
    },

    scales: {
      x: {
        beginAtZero: true,
        grid: { display: false },
        ticks: {
          font: { size: 11 },
          precision: 0
        }
      },
      y: {
        grid: { display: false },
        ticks: {
          font: { size: 11 },
          autoSkip: false
        }
      }
    }
  };

  ngOnChanges() {
    if (!this.data?.length) return;

    this.chartData = {
      labels: this.data.map(d => d.productName),
      datasets: [
        {
          label: 'Units Sold',
          data: this.data.map(d => d.totalQuantity),
          backgroundColor: '#22c55e',
          borderRadius: 6,
          barThickness: 12,
          maxBarThickness: 14
        }
      ]
    };
  }
}
