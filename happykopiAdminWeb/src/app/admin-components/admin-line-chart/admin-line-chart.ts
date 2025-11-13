import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartPointDto, DashboardService } from '../../services/dashboard.service';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-line-chart',
  standalone: true,
  template: `
    <div class="chart-container">
      <canvas #lineChart></canvas>
    </div>
  `,
  styleUrls: ['./admin-line-chart.css']
})
export class AdminLineChart implements OnChanges, OnDestroy {
  @ViewChild('lineChart') lineChart!: ElementRef<HTMLCanvasElement>;
  @Input() period: 'today' | 'this-week' | 'this-month' = 'today';
  private chart!: Chart;

  constructor(private dashboardService: DashboardService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['period'] && this.period) {
      this.loadChartData();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) this.chart.destroy();
  }

  /** ✅ Public method that parent can call with labels and values */
  public updateChartData(labels: string[], values: number[]): void {
    if (!this.chart) {
      // Chart doesn’t exist yet — create it
      this.renderChart(labels, values);
    } else {
      // Chart exists — just update its data
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = values;
      this.chart.update();
    }
  }

  /** Internal method to load data from the backend based on selected period */
  private loadChartData(): void {
    let request$;
    switch (this.period) {
      case 'this-week':
        request$ = this.dashboardService.getChartThisWeek();
        break;
      case 'this-month':
        request$ = this.dashboardService.getChartThisMonth();
        break;
      default:
        request$ = this.dashboardService.getChartToday();
    }

    request$.subscribe({
      next: (data: ChartPointDto[]) => {
        const labels = data.map((x) => x.label);
        const values = data.map((x) => x.totalSales);
        this.renderChart(labels, values);
      },
      error: (err: unknown) => console.error('Failed to load chart data:', err),
    });
  }

  /** Chart.js rendering logic */
  private renderChart(labels: string[], values: number[]): void {
    const ctx = this.lineChart.nativeElement.getContext('2d');
    if (!ctx) return;
    if (this.chart) this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: `Sales (${this.period.replace('-', ' ')})`,
            data: values,
            borderColor: '#f3b622',
            backgroundColor: 'rgba(243,182,34,0.3)',
            tension: 0.3,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          y: { beginAtZero: true },
          x: { ticks: { color: '#333' } },
        },
      },
    });
  }
}
