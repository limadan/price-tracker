import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { ReportService, Report } from '../../services/report.service';
import { ProductService, Product } from '../../services/product.service';
import { StoreService, Store } from '../../services/store.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgChartsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent implements OnDestroy {
  reports = signal<Report[]>([]);
  products = signal<Product[]>([]);
  stores = signal<Store[]>([]);
  errorMessage = signal<string>('');

  chartData = signal<ChartData<'line'>>({ datasets: [] });

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Average Price',
        },
      },
    },
  };

  form: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(
    private reportService: ReportService,
    private productService: ProductService,
    private storeService: StoreService
  ) {
    this.form = new FormGroup({
      reportType: new FormControl('hourly'),
      selectedProductId: new FormControl(null),
      selectedStoreId: new FormControl(null),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
    });

    this.loadProducts();
    this.loadStores();

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadReports();
    });

    this.loadReports();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => this.products.set(data),
      error: (error) => this.errorMessage.set(error),
    });
  }

  loadStores() {
    this.storeService.getStores().subscribe({
      next: (data) => this.stores.set(data),
      error: (error) => this.errorMessage.set(error),
    });
  }

  loadReports() {
    this.errorMessage.set('');
    const service = this.reportService;
    let observable;

    const reportType = this.form.get('reportType')?.value;
    const startDate = this.form.get('startDate')?.value;
    const endDate = this.form.get('endDate')?.value;
    const selectedProductId = this.form.get('selectedProductId')?.value;
    const selectedStoreId = this.form.get('selectedStoreId')?.value;

    switch (reportType) {
      case 'hourly':
        observable = service.getHourlyReports(
          startDate,
          endDate,
          selectedProductId || undefined,
          selectedStoreId || undefined
        );
        break;
      case 'daily':
        observable = service.getDailyReports(
          startDate,
          endDate,
          selectedProductId || undefined,
          selectedStoreId || undefined
        );
        break;
      case 'monthly':
        observable = service.getMonthlyReports(
          startDate,
          endDate,
          selectedProductId || undefined,
          selectedStoreId || undefined
        );
        break;
      default:
        observable = service.getHourlyReports(
          startDate,
          endDate,
          selectedProductId || undefined,
          selectedStoreId || undefined
        );
        break;
    }

    if (observable) {
      observable.subscribe({
        next: (data) => {
          this.reports.set(data);
          this.updateChartData();
        },
        error: (error) => {
          this.errorMessage.set(error);
        },
      });
    }
  }

  getSelectedProductName(): string | undefined {
    const product = this.products().find((p) => p.id === this.form.get('selectedProductId')?.value);
    return product?.name;
  }

  getSelectedStoreName(): string | undefined {
    const store = this.stores().find((s) => s.id === this.form.get('selectedStoreId')?.value);
    return store?.name;
  }

  clearFilters() {
    this.form.patchValue({
      selectedProductId: null,
      selectedStoreId: null,
      startDate: '',
      endDate: '',
    });
  }

  updateChartData() {
    const selectedProductId = this.form.get('selectedProductId')?.value;
    if (!selectedProductId) {
      this.chartData.set({ datasets: [] });
      return;
    }
    const sortedReports = [...this.reports()].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const labels = sortedReports.map((r) => new Date(r.date).toLocaleDateString());
    const data = sortedReports.map((r) => r.averagePrice);
    this.chartData.set({
      labels,
      datasets: [
        {
          label: 'Average Price',
          data,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          fill: false,
        },
      ],
    });
  }
}
