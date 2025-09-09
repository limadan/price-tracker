import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService, Report } from '../../services/report.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {
  reports = signal<Report[]>([]);
  reportType = signal<'hourly' | 'daily' | 'monthly'>('hourly');
  startDate = signal<string>('');
  endDate = signal<string>('');
  errorMessage = signal<string>('');

  constructor(private reportService: ReportService) {
    this.loadReports();
  }

  loadReports() {
    this.errorMessage.set('');
    const service = this.reportService;
    let observable;

    switch (this.reportType()) {
      case 'hourly':
        observable = service.getHourlyReports(this.startDate(), this.endDate());
        break;
      case 'daily':
        observable = service.getDailyReports(this.startDate(), this.endDate());
        break;
      case 'monthly':
        observable = service.getMonthlyReports(this.startDate(), this.endDate());
        break;
    }

    observable.subscribe({
      next: (data) => {
        this.reports.set(data);
      },
      error: (error) => {
        this.errorMessage.set(error);
      },
    });
  }

  onReportTypeChange() {
    this.loadReports();
  }

  onDateChange() {
    this.loadReports();
  }
}
