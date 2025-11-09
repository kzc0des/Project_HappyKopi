import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-line-chart',
  template: `
    <div class="chart-container">
      <canvas #lineChart></canvas>
    </div>
  `,
  styleUrls: ['./admin-line-chart.css']
})
export class AdminLineChart implements AfterViewInit, OnDestroy {
  @ViewChild('lineChart') lineChart!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart;

  chartLabels: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  chartData: number[] = [0, 0, 0, 0, 0, 0, 0]; 

  mockData: number[] = [15, 35, 50, 40, 60, 75, 45];

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createChart();
      this.loadMockData();
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.chart) this.chart.destroy();
  }

  private createChart(): void {
    const ctx = this.lineChart.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [
          {
            label: 'Weekly Sales',
            data: this.chartData,
            borderColor: '#f3b622',
            backgroundColor: 'rgba(243, 182, 34, 0.3)',
            borderWidth: 2,
            tension: 0.3,
            pointBackgroundColor: '#f3b622',
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeInOutQuart',
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#2c3e50',
            },
          },
        },
        scales: {
          x: {
            ticks: { color: '#2c3e50' },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#2c3e50' },
            grid: { color: '#eee' },
          },
        },
      },
    });
  }

  loadMockData(): void {

    setTimeout(() => {
      this.updateChartData(this.chartLabels, this.mockData);
    }, 200);
  }

  updateChartData(newLabels: string[], newData: number[]): void {
    if (!this.chart) return;

    this.chartLabels = newLabels;
    this.chartData = newData;
    
    this.chart.data.labels = newLabels;
    this.chart.data.datasets[0].data = newData;
    this.chart.update('active');
  }
}