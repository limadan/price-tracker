import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogService, Log } from '../../services/log.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss',
})
export class LogsComponent implements OnDestroy {
  logs = signal<Log[]>([]);
  startDate = signal<string>('');
  endDate = signal<string>('');
  severity = signal<string>('');
  productId = signal<string>('');
  errorMessage = signal<string>('');
  destroy$ = new Subject<void>();

  constructor(private logService: LogService) {
    this.loadLogs();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLogs() {
    this.errorMessage.set('');
    const filters = {
      startDate: this.startDate(),
      endDate: this.endDate(),
      severity: this.severity(),
      productId: this.productId(),
    };

    this.logService
      .getLogs(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.logs.set(data);
        },
        error: (error) => {
          this.errorMessage.set(error);
        },
      });
  }

  deleteAllLogs() {
    if (confirm('Are you sure you want to delete all logs?')) {
      this.logService
        .deleteAllLogs()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.logs.set([]);
          },
          error: (error) => {
            this.errorMessage.set(error);
          },
        });
    }
  }

  onFilterChange() {
    this.loadLogs();
  }
}
