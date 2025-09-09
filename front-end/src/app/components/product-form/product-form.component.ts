import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Product, ProductUrl, ProductRequest } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnChanges {
  @Input() product: Product | null = null;
  @Input() isVisible: boolean = false;
  @Output() formSubmitted = new EventEmitter<ProductRequest>();
  @Output() formCancelled = new EventEmitter<void>();

  form!: FormGroup;
  isEditing = signal(false);
  errorMessage = signal<string>('');

  get urls(): FormArray {
    return this.form.get('urls') as FormArray;
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      targetPrice: [null, Validators.required],
      urls: this.fb.array([]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] || changes['isVisible']) {
      if (this.isVisible) {
        this.isEditing.set(!!this.product);
        if (this.product) {
          this.form.patchValue({
            name: this.product.name,
            targetPrice: this.product.targetPrice,
          });
          this.urls.clear();
          if (this.product.urls && this.product.urls.length > 0) {
            this.product.urls.forEach((url) => {
              this.urls.push(this.createUrlGroup(url));
            });
          } else {
            this.urls.push(this.createUrlGroup());
          }
        } else {
          this.form.reset({
            name: '',
            targetPrice: null,
          });
          this.urls.clear();
          this.urls.push(this.createUrlGroup());
        }
      }
    }
  }

  private createUrlGroup(url?: ProductUrl): FormGroup {
    return this.fb.group({
      storeId: [url?.storeId ?? 1, Validators.required],
      url: [url?.url ?? '', Validators.required],
    });
  }

  addUrl() {
    this.urls.push(this.createUrlGroup());
  }

  removeUrl(index: number) {
    this.urls.removeAt(index);
  }

  onSubmit() {
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value);
    }
  }

  onCancel() {
    this.formCancelled.emit();
  }
}
