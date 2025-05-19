import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { interval, Subscription, switchMap } from 'rxjs';
import { ChartDataset, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-hey-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatTooltipModule,
    MatIconModule,
    NgChartsModule,
  ],
  templateUrl: './hey-form.component.html',
})
export class HeyFormComponent {
  result: any = null;
  error: string = '';

  pingResults: number[] = [];
  pinging = false;
  private pingSub?: Subscription;

  heyForm: FormGroup;
  pingForm: FormGroup;

  resultChart: any = {};

  summaryChartData = {
    labels: ['Total', 'Slowest', 'Fastest', 'Average', 'RPS'],
    datasets: [
      {
        label: 'Summary Stats',
        data: [0, 0, 0, 0, 0],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  latencyChartData = {
    labels: ['0%', '10%', '25%', '50%', '75%', '90%'],
    datasets: [
      {
        label: 'Latency (s)',
        data: [0, 0, 0, 0, 0, 0],
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.3,
      },
    ],
  };

  statusChartData = {
    labels: ['200', '400', '500'],
    datasets: [
      {
        label: 'Status Codes',
        data: [0, 0, 0],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
      },
    ],
  };

  // Summary bar chart
  barOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
  };

  // Latency distribution line chart
  lineOptions: ChartOptions<'line'> = { responsive: true };

  // Status codes pie chart
  pieOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
  };

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.heyForm = this.fb.group({
      requestNumbers: [''],
      duration: [''],
      concurrency: [''],
      qps: [''],
      proxy: [''],
      targetUrl: ['', Validators.required],
      outputCsv: [false],
    });

    this.pingForm = this.fb.group({
      host: [''],
    });
  }

  loading = false;

  onSubmit() {
    if (!this.heyForm.valid) return;

    const payload = this.heyForm.value;
    Object.keys(payload).forEach(
      (key) =>
        (payload[key] === '' || payload[key] == null) && delete payload[key]
    );

    this.loading = true;
    this.http.post('http://localhost:4000/run-hey', payload).subscribe({
      next: (res: any) => {
        this.result = res.results || res;
        this.error = '';
        this.loading = false;
        this.resultChart = res.results || res;
        this.updateCharts();
      },
      error: (err) => {
        this.result = null;
        this.error = err.error?.error || 'Server error';
        this.loading = false;
      },
    });
  }

  updateCharts() {
    // Update summary chart
    this.summaryChartData = {
      labels: ['Total', 'Slowest', 'Fastest', 'Average', 'RPS'],
      datasets: [
        {
          label: 'Summary Stats',
          data: [
            this.resultChart.summary.total,
            this.resultChart.summary.slowest,
            this.resultChart.summary.fastest,
            this.resultChart.summary.average,
            this.resultChart.summary.requestsPerSec,
          ],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
      ],
    };

    this.latencyChartData = {
      labels: this.resultChart.latencyDistribution.map(
        (l: any) => l.percentile
      ),
      datasets: [
        {
          label: 'Latency (s)',
          data: this.resultChart.latencyDistribution.map((l: any) => l.time),
          fill: false,
          borderColor: 'rgba(255, 99, 132, 1)',
          tension: 0.3,
        },
      ],
    };

    this.statusChartData = {
      labels: this.resultChart.statusCodes.map((s: any) => s.statusCode),
      datasets: [
        {
          label: 'Status Code Count',
          data: this.resultChart.statusCodes.map((s: any) => s.count),
          backgroundColor: ['#4caf50', '#f44336', '#ff9800', '#2196f3'],
        },
      ],
    };
  }

  startPing() {
    const host = this.pingForm.value.host;
    this.pingResults = [];
    this.pinging = true;

    this.pingSub = interval(1000)
      .pipe(
        switchMap(() =>
          this.http.get<any>(`http://localhost:4000/ping?host=${host}`)
        )
      )
      .subscribe({
        next: (res) => {
          if (res.alive) {
            this.pingResults.push(res.time);
          } else {
            this.pingResults.push(-1); // show -1 or "timeout"
          }
          if (this.pingResults.length > 1) {
            this.pingResults.shift(); // keep last 1 pings
          }
        },
        error: (err) => {
          this.pinging = false;
          console.error(err);
        },
      });
  }

  stopPing() {
    this.pingSub?.unsubscribe();
    this.pinging = false;
    this.pingResults = [];
  }

  ngOnDestroy(): void {
    this.pingSub?.unsubscribe();
  }
}
