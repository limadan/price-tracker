import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { LogService, Log } from '../../services/log.service';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss',
})
export class LogsComponent {
  logs = signal<Log[]>([]);
  startDate = signal<string>('');
  endDate = signal<string>('');
  severity = signal<string>('');
  productId = signal<string>('');
  errorMessage = signal<string>('');

  constructor(private logService: LogService) {
    this.loadLogs();
  }

  loadLogs() {
    this.errorMessage.set('');
    const filters = {
      startDate: this.startDate(),
      endDate: this.endDate(),
      severity: this.severity(),
      productId: this.productId(),
    };

    this.logService.getLogs(filters).subscribe({
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
      this.logService.deleteAllLogs().subscribe({
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
