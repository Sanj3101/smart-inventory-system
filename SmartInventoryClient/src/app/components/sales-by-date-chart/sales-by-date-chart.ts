import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-sales-by-date-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './sales-by-date-chart.html',
  styleUrl: './sales-by-date-chart.css'
})
export class SalesByDateChart implements OnChanges {

  @Input() data: any[] = [];

  chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      mode: 'index',
      intersect: false
    },

    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 10,
        callbacks: {
          label: (ctx) => {
            const value = Number(ctx.raw || 0);
            return `Revenue: ₹${value.toLocaleString()}`;
          }
        }
      }
    },

    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 11 },
          maxRotation: 0
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)'
        },
        ticks: {
          font: { size: 11 },
          callback: value => `₹${Number(value).toLocaleString()}`
        }
      }
    }
  };

  ngOnChanges() {
    if (!this.data?.length) return;

    this.chartData = {
      labels: this.data.map(d => d.label),
      datasets: [
        {
          label: 'Revenue',
          data: this.data.map(d => d.totalRevenue),

          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79,70,229,0.12)',
          borderWidth: 2,

          pointRadius: 2,
          pointHoverRadius: 5,
          pointBackgroundColor: '#4f46e5',

          tension: 0.35,
          fill: true
        }
      ]
    };
  }
}
