import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { LogService, Log } from '../../services/log.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss',
})
export class LogsComponent implements OnDestroy {
  logs = signal<Log[]>([]);
  errorMessage = signal<string>('');

  form: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(private logService: LogService) {
    this.form = new FormGroup({
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      severity: new FormControl(''),
    });

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadLogs();
    });

    this.loadLogs();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLogs() {
    this.errorMessage.set('');
    const filters = {
      startDate: this.form.get('startDate')?.value,
      endDate: this.form.get('endDate')?.value,
      severity: this.form.get('severity')?.value,
      productId: '',
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
}
